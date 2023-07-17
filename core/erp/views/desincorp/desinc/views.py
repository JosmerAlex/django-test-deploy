import json
import os
from django.conf import settings
from django.db import transaction
from django.db.models import Q
from core.erp.forms import DesincAlmacenForm, FormConcepMov
from core.reportes.forms import ReportForm
from core.erp.models import Producto, ControlStock, DesincAlmacen, DetDesincAlmacen, Almacen, DetIngresoProduc, Empresa
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import JsonResponse, HttpResponseRedirect, HttpResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import FormView, CreateView, UpdateView, DeleteView, View
from weasyprint import HTML, CSS
from django.template.loader import get_template
from django.urls import reverse_lazy
from decimal import Decimal
#from xhtml2pdf import pisa
from datetime import date, datetime
from django.template import Context
from core.erp.mixins import ValidatePermissionRequiredMixin, Perms_Check
from configuracion.settings import MEDIA_URL, STATIC_URL

class DesincorpListView(LoginRequiredMixin, Perms_Check, FormView):
    model = DesincAlmacen
    form_class = ReportForm
    template_name = 'desincorp/desinc_almacen/list.html'
    permission_required = 'erp.view_desincalmacen'

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            action = request.POST['action']
            if action == 'searchdata':
                data = []
                start_date = request.POST['start_date']
                end_date = request.POST['end_date']
                queryset = DesincAlmacen.objects.all()
                if len(start_date) and len(end_date):
                    queryset = queryset.filter(fecha_desinc__range=[start_date, end_date])
                for i in queryset:
                    item = {}
                    item['id'] = i.id
                    item['cod_desinc'] = i.cod_desinc
                    item['almacen'] = i.almacen.nombre
                    item['tipo_desinc'] = i.tipo_desinc.denominacion
                    item['fecha_desinc'] = i.fecha_desinc
                    item['total'] = i.total
                    item['estado'] = i.estado
                    data.append(item)

            elif action == 'search_detalle_prod':
                data = []
                for i in DetDesincAlmacen.objects.filter(desincorp_id=request.POST['id']):
                    item = {}
                    item['id'] = i.id
                    item['codigo'] = i.prod.codigo
                    item['prodcateg'] = i.prod.categorias.nombre
                    item['prodnombre'] = i.prod.nombre + ' - ' + i.prod.descripcion
                    item['precio'] = i.precio
                    item['cant'] = i.cant
                    item['subtotal'] = i.subtotal
                    data.append(item)
               
            else:
                data['error'] = 'Ha ocurrido un error'
        except Exception as e:
            data['error'] = str(e)
        return JsonResponse(data, safe=False)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Listado de Desincorporaciones en el Almacén'
        context['create_url'] = reverse_lazy('erp:desincorp_create')
        context['list_url'] = reverse_lazy('erp:desincorp_list')
        context['entity'] = 'Listado'
        context['btn_name'] = 'Nuevo Registro'
      #  context['form'] = IngresosForm()
        return context

class DesincorpCreateView(LoginRequiredMixin, Perms_Check, CreateView):
    model = DesincAlmacen
    form_class = DesincAlmacenForm
    template_name = 'desincorp/desinc_almacen/create.html'
    success_url = reverse_lazy('erp:desincorp_list')
    url_redirect = success_url
    permission_required = 'erp.add_desincalmacen'

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            action = request.POST['action']
            if action == 'search_products':                
                data = []
                 # muy importante los covierto a una lista para poder tratarlos, ya que cuando los envie desde ajax lo habia convertido a string
                ids_exclude = json.loads(request.POST['ids'])
                term = request.POST['term'].strip()
                # __gt, significa mayor que cero
               # products = Producto.objects.filter(activo__in='1', almacenes_id__in=request.POST['idalmacen'])
                products = ControlStock.objects.filter(almacenes_id__in=request.POST['idalmacen']).filter(productos__activo__in='1').filter(stock_actual__gt=0)

                if len(term):
                    products = products.filter(productos__nombre__icontains=term)
               
                for i in products.exclude(id__in=ids_exclude)[0:20]:
                    item = i.toJSON()
                    item['value'] = i.productos.nombre
                    data.append(item)
            elif action == 'search_autocomplete':
                data = []
                ids_exclude = json.loads(request.POST['ids'])
                term = request.POST['term'].strip()
                data.append({'id': term, 'text':term})
                products = ControlStock.objects.filter(almacenes_id__in=request.POST['idalmacen']).filter(productos__activo__in='1').filter(stock_actual__gt=0).filter(productos__nombre__icontains=term)
                for i in products.exclude(id__in=ids_exclude)[0:20]:
                    item = i.toJSON()
                    item['text'] = i.productos.nombre
                    data.append(item)

            elif action == 'search_responalmac':
                data = []
                for i in Almacen.objects.filter(id=request.POST['id']):
                    item = {}
                    item['responsable'] = i.responsable + ' - ' + i.ced
                    data.append(item) 

            elif action == 'add':
                with transaction.atomic():
                    desincorp = json.loads(request.POST['desincorp'])
                    desinc = DesincAlmacen()
                    desinc.cod_desinc = desincorp['cod_desinc']
                    desinc.almacen_id = desincorp['almacen']
                    desinc.respon_almac = desincorp['respon_almac']
                    desinc.tipo_desinc_id = desincorp['tipo_desinc']
                    desinc.subtotal = Decimal(desincorp['subtotal'])
                # ingreso.iva = Decimal(ingresos['iva'])
                    desinc.iva = desinc.iva
                    desinc.total = Decimal(desincorp['total'])
                    desinc.fecha_desinc = desincorp['fecha_desinc']
                    desinc.usuario = self.request.user
                    desinc.observ = desincorp['observ']
                    desinc.soportedocum = desincorp['soportedocum']
                    desinc.estado = 'DIS'
                    desinc.save()
                    
                    for i in desincorp['desinc_almacen']:
                        det = DetDesincAlmacen()
                        det.precio = Decimal(i['precio'])
                        det.cant = int(i['cant'])
                        det.subtotal = Decimal(i['subtotal'])
                        det.desincorp_id = desinc.id
                        det.prod_id = i['id']
                        det.save()
                        det.prod.stock_actual -= det.cant
                        det.prod.save()
                    data = {'id': desinc.id}           
            
            elif action == 'create_concepto':
                with transaction.atomic():
                    frmConcepMov =  FormConcepMov(request.POST)
                    data = frmConcepMov.save()
            else:
                data['error'] = 'No ha ingresado a ninguna opción'
        except Exception as e:
            data['error'] = str(e)
            #para que se pueda serializar agrego el safe=False
        return JsonResponse(data, safe=False)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Desincorporando Producto'
        context['entity'] = 'Listado'
        context['list_url'] = self.success_url
        context['iva'] = Empresa.objects.values('nameimpuesto', ('iva')).last()
        context['action'] = 'add'
        context['det'] = []
        context['frmConcepMov'] = FormConcepMov()
        return context

class DesincorpUpdateView(LoginRequiredMixin, Perms_Check, UpdateView):
    model = DesincAlmacen
    form_class = DesincAlmacenForm
    template_name = 'desincorp/desinc_almacen/create.html'
    success_url = reverse_lazy('erp:desincorp_list')
    url_redirect = success_url
    permission_required = 'erp.change_desincalmacen'

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get_form(self, form_class=None):
        instance = self.get_object()
        form = DesincAlmacenForm(instance=instance)
        form.fields['almacen'].queryset = Almacen.objects.filter(id=instance.almacen.id)
        return form

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            action = request.POST['action']
            if action == 'search_products':                
                data = []
                 # muy importante los covierto a una lista para poder tratarlos, ya que cuando los envie desde ajax lo habia convertido a string
                ids_exclude = json.loads(request.POST['ids'])
                term = request.POST['term'].strip()
                # __gt, significa mayor que cero
               # products = Producto.objects.filter(activo__in='1', almacenes_id__in=request.POST['idalmacen'])
                products = Producto.objects.filter(almacenes_id__in=request.POST['idalmacen']).filter(activo__in ='1').filter(stock_actual__gt=0)

                if len(term):
                    products = products.filter(nombre__icontains=term)
               
                for i in products.exclude(id__in=ids_exclude)[0:20]:
                    item = i.toJSON()
                    item['value'] = i.nombre
                    data.append(item)
            elif action == 'search_autocomplete':
                data = []
                ids_exclude = json.loads(request.POST['ids'])
                term = request.POST['term'].strip()
                data.append({'id': term, 'text':term})
                products = Producto.objects.filter(almacenes_id__in=request.POST['idalmacen']).filter(stock_actual__gt=0).filter(nombre__icontains=term)
                for i in products.exclude(id__in=ids_exclude)[0:20]:
                    item = i.toJSON()
                    item['text'] = i.nombre
                    data.append(item)
            elif action == 'edit':
                with transaction.atomic():
                    desincorp = json.loads(request.POST['desincorp'])
                    desinc = self.get_object()
                    desinc.cod_desinc = desincorp['cod_desinc']
                    desinc.almacen_id = desincorp['almacen']
                    desinc.respon_almac = desincorp['respon_almac']
                    desinc.tipo_desinc_id = desincorp['tipo_desinc']
                    desinc.subtotal = Decimal(desincorp['subtotal'])
                    desinc.iva = desinc.iva
                    desinc.total = Decimal(desincorp['total'])
                    desinc.fecha_desinc = desincorp['fecha_desinc']
                    desinc.usuario = self.request.user
                    desinc.observ = desincorp['observ']
                    desinc.soportedocum = desincorp['soportedocum']
                    desinc.estado = 'DIS'
                    desinc.save()
                    
                    detdesinc = DetDesincAlmacen.objects.filter(desincorp_id=self.get_object().id)
                    
                    for det in detdesinc:
                        det.prod.stock_actual += det.cant
                        det.prod.save() 

                    detdesinc.delete()          
                    
                    for i in desincorp['desinc_almacen']:
                        det = DetDesincAlmacen()
                        det.precio = Decimal(i['precio'])
                        det.cant = int(i['cant'])
                        det.subtotal = Decimal(i['subtotal'])
                        det.desincorp_id = desinc.id
                        det.prod_id = i['id']
                        det.save()

                        det.prod.stock_actual -= det.cant
                        det.prod.save()
                    data = {'id': desinc.id}            
            
            elif action == 'create_concepto':
                with transaction.atomic():
                    frmConcepMov =  FormConcepMov(request.POST)
                    data = frmConcepMov.save()
            else:
                data['error'] = 'No ha ingresado a ninguna opción'
        except Exception as e:
            data['error'] = str(e)
            #para que se pueda serializar agrego el safe=False
        return JsonResponse(data, safe=False)

    def get_details_product(self):
        data = []
        try:
            for i in DetDesincAlmacen.objects.filter(desincorp_id=self.get_object().id):
                item = {}
                item = i.prod.toJSON()
                item['full_name'] = i.prod.nombre + ' / ' + i.prod.categorias.nombre
                item['cant'] = i.cant
                item['precio'] = i.precio
                item['subtotal'] = i.subtotal
                data.append(item)
                print(item)

        except:
            pass
        return data

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = f'Edición del Registro: {self.object.cod_desinc}'
        context['entity'] = 'Listado'
        context['list_url'] = self.success_url
        context['iva'] = Empresa.objects.values('nameimpuesto', ('iva')).last()
        context['action'] = 'edit'
        context['det'] = json.dumps(self.get_details_product(), cls=DecimalEncoder)
        context['frmConcepMov'] = FormConcepMov()
        return context

class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return str(obj)
        return json.JSONEncoder.default(self, obj)

class DesincorpDeleteView(LoginRequiredMixin, DeleteView):
    model = DesincAlmacen
    permission_required = 'erp.delete_desincalmacen'

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        self.object = self.get_object()
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            perms = ('erp.delete_desincalmacen',)
            if request.user.has_perms(perms):
                self.object.delete()
            else:
                data['error'] = 'No tiene permisos para realizar esta acción'
        except Exception as e:
            data['error'] = str(e)
        return JsonResponse(data)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        return context

class DesincorpFacturaPdfView(Perms_Check, View):
    permission_required = 'erp.add_desincalmacen'
    
    def get(self, request, *args, **kwargs):
        try:
            template = get_template('desincorp/desinc_almacen/PDF_Desincorp.html')
            # encab_distrib= trasladoProduc.objects.get(id=self.kwargs['pk']).values('cod_traslado', 'origen', 'origen__nombre',  'destino', 'destino__nombre', 'destino__nombrejefe', 'tipo_traslado', 'tipo_comprob', 'num_comprob', 'subtotal', 'iva', 'total', 'fecha_traslado', 'usuario', 'observ', 'estado', 'aprobado')
            encab_desincorp= DesincAlmacen.objects.get(pk=self.kwargs['pk'])
            detalle_desincorp= DetDesincAlmacen.objects.filter(desincorp_id=self.kwargs['pk']).order_by('prod_id')
            context = {
            'encab_desincorp': encab_desincorp,
            'detalle_desincorp': detalle_desincorp,
            'comp': {'fecha': datetime.now, 'name': 'Dirección Regional de Salud Estado Portuguesa', 'rif': 'G-20008795-1', 'tlf': '(0257) - 2531550 - 2512246 - 2534014', 'redsocial': 'http://saludportuguesa.gob.ve; twitter: @saludportuguesa', 'address': 'Carrera 3 con calle 09 Antiguo Hospital, Sector Curazao Guanare Portuguesa Venezuela'},
            'icon': '{}{}'.format(settings.MEDIA_URL, 'imagportadalogin/klipartzcom.png')
            }
            html = template.render(context)
            css_url = os.path.join(settings.BASE_DIR, 'static/lib/bootstrap-4.6.0-dist/css/bootstrap.min.css')
            pdf = HTML(string=html, base_url=request.build_absolute_uri()).write_pdf(stylesheets=[CSS(css_url)])
            return HttpResponse(pdf, content_type='application/pdf')
        except:
            pass
        return HttpResponseRedirect(reverse_lazy('erp:desincorp_list'))