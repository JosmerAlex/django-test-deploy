import json
import os
from django.conf import settings
from django.db import transaction
from django.db.models import Q
from core.erp.forms import IngresosForm, ProveedorForm, FormConcepMov, LoteForm
from core.reportes.forms import ReportForm
from core.erp.models import Producto, Proveedor, IngresoProduc, DetIngresoProduc, Almacen, Empresa, Seriales, Lotes
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
from django.template import Context
from datetime import date, datetime

from core.erp.mixins import ValidatePermissionRequiredMixin, Perms_Check
from configuracion.settings import MEDIA_URL, STATIC_URL

class IngresoListView(LoginRequiredMixin, Perms_Check, FormView):
    form_class = ReportForm
    template_name = 'ingresos_prod/list.html'
    permission_required = 'erp.view_ingresoproduc'

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
                queryset = IngresoProduc.objects.all()
                if len(start_date) and len(end_date):
                    queryset = queryset.filter(fecha_ingreso__range=[start_date, end_date])
                for i in queryset:
                    data.append(i.toJSON())                

            elif action == 'search_detalle_prod':
                data = []
                for i in DetIngresoProduc.objects.filter(ingresoPro_id=request.POST['id']):
                    data.append(i.toJSON())
               
            else:
                data['error'] = 'Ha ocurrido un error'
        except Exception as e:
            data['error'] = str(e)
        return JsonResponse(data, safe=False)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Listado de Incorporación'
        context['create_url'] = reverse_lazy('erp:ingreso_create')
        context['list_url'] = reverse_lazy('erp:ingreso_list')
        context['btn_name'] = 'Nuevo Registro'
        return context

class IngresoCreateView(LoginRequiredMixin, Perms_Check, CreateView):
    model = IngresoProduc
    form_class = IngresosForm
    template_name = 'ingresos_prod/create.html'
    success_url = reverse_lazy('erp:ingreso_list')
    url_redirect = success_url
    permission_required = 'erp.add_ingresoproduc'

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            action = request.POST['action']
            if action == 'search_products':                
                data = []                 
                ids_exclude = json.loads(request.POST['ids'])
                term = request.POST['term'].strip()                
                products = Producto.objects.filter(activo__in ='1')

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
                products = Producto.objects.filter(activo__in ='1').filter(nombre__icontains=term)
                for i in products.exclude(id__in=ids_exclude)[0:20]:
                    item = i.toJSON()
                    item['text'] = i.nombre
                    data.append(item)

            elif action == 'search_responalmac':
                data = []
                for i in Almacen.objects.filter(id=request.POST['id']):
                    item = {}
                    item['responsable'] = i.responsable + ' - ' + i.ced
                    data.append(item) 

            elif action == 'add':
                with transaction.atomic():
                    ingresos = json.loads(request.POST['ingresos'])
                    ingreso = IngresoProduc()
                    ingreso.cod_ingreso = ingresos['cod_ingreso']
                    ingreso.almacen_id = ingresos['almacen']
                    ingreso.respon_almac = ingresos['respon_almac']
                    ingreso.tipo_ingreso_id = ingresos['tipo_ingreso']
                    ingreso.proveedor_id = ingresos['proveedor']
                    ingreso.tipo_comprob = ingresos['tipo_comprob']
                    ingreso.num_comprob = ingresos['num_comprob']
                    ingreso.subtotal = Decimal(ingresos['subtotal'])
                    ingreso.iva = Decimal(ingresos['iva'])
                    ingreso.total = Decimal(ingresos['total'])
                    ingreso.fecha_ingreso = ingresos['fecha_ingreso']
                    ingreso.usuario = self.request.user
                    ingreso.observ = ingresos['observ']
                    ingreso.estado = 'DIS'
                    ingreso.save()                    
                    
                    for i in ingresos['productos']:
                        det = DetIngresoProduc()
                        det.precio = Decimal(i['precio'])
                        det.cant = int(i['cant'])
                        det.subtotal = Decimal(i['subtotal'])
                        det.iva = Decimal(i['iva'])                                               
                        det.ingresoPro_id = ingreso.id
                        det.prod_id = i['id']
                        det.save()                    
                    
                    
                    for s in ingresos['seriales']:
                        if len(s) > 0:
                            print('Hay Seriales')                        
                            serial = Seriales()                      
                            serial.incorp_id = ingreso.id
                            serial.prod_id = s['prod_id']
                            serial.serial = s['serial']
                            serial.save()

                    for l in ingresos['lotes']:
                        if len(l) > 0:
                            print('Hay Lotes')                        
                            lotes = Lotes()                      
                            lotes.incorp_id = ingreso.id
                            lotes.prod_id = l['prod_id']
                            lotes.nro_lote = l['nro_lote']
                            lotes.fecha_venc = l['fecha']
                            lotes.save()

                    data = {'id': ingreso.id}            
            
            elif action == 'search_proveedor':
                data = []
                term = request.POST['term']
                proveedors = Proveedor.objects.filter(
                    Q(empresa__icontains=term) | Q(ramo__icontains=term) | Q(documento__icontains=term))[0:20]
                for i in proveedors:
                    item = i.toJSON()
                    item['text'] = i.get_full_name()
                    data.append(item)
            elif action == 'create_proveedor':
                with transaction.atomic():
                    frmProvee =  ProveedorForm(request.POST)
                    data = frmProvee.save()
            
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
        context['title'] = 'Ingresando Producto'
        context['entity'] = 'Incorporación'
        context['list_url'] = self.success_url
        context['action'] = 'add'
        context['iva'] = Empresa.objects.values('nameimpuesto', ('iva')).last()
        context['det'] = []
        context['frmProvee'] = ProveedorForm()
        context['frmConcepMov'] = FormConcepMov()
        context['formLote'] = LoteForm()
        return context

class IngresoUpdateView(LoginRequiredMixin, Perms_Check, UpdateView):
    model = IngresoProduc
    form_class = IngresosForm
    template_name = 'ingresos_prod/create.html'
    success_url = reverse_lazy('erp:ingreso_list')
    url_redirect = success_url
    permission_required = 'erp.change_ingresoproduc'

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get_form(self, form_class=None):
        instance = self.get_object()
        form = IngresosForm(instance=instance)
        form.fields['proveedor'].queryset = Proveedor.objects.filter(id=instance.proveedor.id)
        return form

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            action = request.POST['action']
            if action == 'search_products':                
                data = []
                ids_exclude = json.loads(request.POST['ids'])
                term = request.POST['term'].strip()               
                products = Producto.objects.filter(activo__in ='1')
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
                products = Producto.objects.filter(activo__in ='1').filter(nombre__icontains=term)
                for i in products.exclude(id__in=ids_exclude)[0:20]:
                    item = i.toJSON()
                    item['text'] = i.nombre
                    data.append(item)

            elif action == 'search_responalmac':
                data = []
                #data = [{'id': '', 'text': '-----------'}]
                for i in Almacen.objects.filter(id=request.POST['id']):
                    item = {}
                    item['responsable'] = i.responsable + ' - ' + i.ced
                    data.append(item) 
            elif action == 'edit':
                with transaction.atomic():
                    ingresos = json.loads(request.POST['ingresos'])                    
                    ingreso = self.get_object()
                    ingreso.cod_ingreso = ingresos['cod_ingreso']
                    ingreso.almacen_id = ingresos['almacen']
                    ingreso.respon_almac = ingresos['respon_almac']
                    ingreso.tipo_ingreso_id = ingresos['tipo_ingreso']
                    ingreso.proveedor_id = ingresos['proveedor']
                    ingreso.tipo_comprob = ingresos['tipo_comprob']
                    ingreso.num_comprob = ingresos['num_comprob']
                    ingreso.subtotal = Decimal(ingresos['subtotal'])
                    ingreso.iva = Decimal(ingresos['iva'])
                    ingreso.total = Decimal(ingresos['total'])
                    ingreso.fecha_ingreso = ingresos['fecha_ingreso']
                    ingreso.usuario = self.request.user
                    ingreso.observ = ingresos['observ']
                    ingreso.estado = 'DIS'
                    ingreso.save()
                    ingreso.detingresoproduc_ingresopro_set.all().delete()                    
                    
                    for i in ingresos['productos']:
                        det = DetIngresoProduc()
                        det.precio = Decimal(i['precio'])
                        det.cant = int(i['cant'])
                        det.subtotal = Decimal(i['subtotal'])
                        det.iva = Decimal(i['iva'])
                        det.ingresoPro_id = ingreso.id
                        det.prod_id = i['id']
                        det.save()

                        # det.prod.stock_actual += det.cant
                        # det.prod.precio = Decimal(i['precio'])
                        # det.prod.save()
                    data = {'id': ingreso.id}
            elif action == 'search_proveedor':
                data = []
                term = request.POST['term']
                proveedors = Proveedor.objects.filter(
                    Q(empresa__icontains=term) | Q(ramo__icontains=term) | Q(documento__icontains=term))[0:10]
                for i in proveedors:
                    item = i.toJSON()
                    item['text'] = i.get_full_name()
                    data.append(item)
            elif action == 'create_proveedor':
                with transaction.atomic():
                    frmProveedor = ProveedorForm(request.POST)
                    data = frmProveedor.save()
            elif action == 'create_concepto':
                with transaction.atomic():
                    frmConcepMov =  FormConcepMov(request.POST)
                    data = frmConcepMov.save()
            else:
                data['error'] = 'No ha ingresado a ninguna opción'
        except Exception as e:
            data['error'] = str(e)
        return JsonResponse(data, safe=False)

    def get_details_product(self):
        data = []
        try:
            for i in DetIngresoProduc.objects.filter(ingresoPro_id=self.get_object().id):
               # print(i)
                item = i.prod.toJSON()
                item['cant'] = i.cant
                item['precio'] = i.precio
                item['subtotal'] = i.subtotal
                item['iva'] = i.iva
                data.append(item)
        except:
            pass
        return data   

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = f'Edición del Ingreso: {self.object.cod_ingreso}'
        context['entity'] = 'Incorporación'
        context['list_url'] = self.success_url
        context['action'] = 'edit'
        context['iva'] = Empresa.objects.values('nameimpuesto', ('iva')).last()
        # aqui para evitar errores de datos especialmente de null etc, los convierto en formato json.
        context['det'] = json.dumps(self.get_details_product(), cls=Encoder)
        context['frmProvee'] = ProveedorForm()
        context['frmConcepMov'] = FormConcepMov()
        return context

class Encoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return str(obj)
        elif isinstance(obj, (datetime, date)):
            return obj.isoformat()
        return json.JSONEncoder.default(self, obj)
       
class IngresoDeleteView(LoginRequiredMixin, DeleteView):
    model = IngresoProduc
    permission_required = 'erp.delete_ingresoproduc'

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        self.object = self.get_object()
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        try:            
            perms = ('erp.delete_ingresoproduc',)
            if request.user.has_perms(perms):
                for s in Seriales.objects.filter(incorp_id=self.object.id):
                    s.delete()

                for l in Lotes.objects.filter(incorp_id=self.object.id):
                    l.delete()
                self.object.delete()
            else:
                data['error'] = 'No tiene permisos para realizar esta acción'
        except Exception as e:
            data['error'] = str(e)
        return JsonResponse(data)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Eliminación de un Ingreso'
        context['entity'] = 'Ingresos'
        return context

class IngresoFacturaPdfView(Perms_Check, View):
    permission_required = 'erp.add_ingresoproduc'

    def get(self, request, *args, **kwargs):
        try:
            template = get_template('ingresos_prod/guia_ingresoPDF.html')
            encab_ing= IngresoProduc.objects.get(pk=self.kwargs['pk'])
            detalle_ing= DetIngresoProduc.objects.filter(ingresoPro_id=self.kwargs['pk']).order_by('prod_id')
            context = {
            'encab_ing': encab_ing,
            'detalle_ing': detalle_ing,
            'comp': {'fecha': datetime.now, 'name': 'Dirección Regional de Salud Estado Portuguesa', 'rif': 'G-20008795-1', 'tlf': '(0257) - 2531550 - 2512246 - 2534014', 'redsocial': 'http://saludportuguesa.gob.ve; twitter: @saludportuguesa', 'address': 'Carrera 3 con calle 09 Antiguo Hospital, Sector Curazao Guanare Portuguesa Venezuela'},
            'icon': '{}{}'.format(settings.MEDIA_URL, 'imagportadalogin/klipartzcom.png')
            }
            html = template.render(context)
            css_url = os.path.join(settings.BASE_DIR, 'static/lib/bootstrap-4.6.0-dist/css/bootstrap.min.css')
            pdf = HTML(string=html, base_url=request.build_absolute_uri()).write_pdf(stylesheets=[CSS(css_url)])
            return HttpResponse(pdf, content_type='application/pdf')
        except:
            pass
        


   
