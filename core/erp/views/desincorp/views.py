import json
import os
from django.conf import settings
from django.db import transaction
from django.db.models import Q
from core.erp.forms import DesincProdForm, FormProducto, UnidadForm, FormDepart, FormConcepMov
from core.erp.models import DesincProduc, DetDesincProd, Producto, Unidad, Departamento, CodBienes, SalidaProduc, DetSalidaProd, ConcepMovimiento, InventarioBienes, Empresa, DetTrasladoProd
from core.reportes.forms import ReportForm
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


class DesincListView(LoginRequiredMixin, Perms_Check, FormView):
    model = DesincProduc
    form_class = ReportForm
    template_name = 'desincorp/list.html'
    permission_required = 'erp.view_desincproduc'

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
                queryset = DesincProduc.objects.all()
                if len(start_date) and len(end_date):
                    queryset = queryset.filter(fecha_desinc__range=[start_date, end_date])
                for i in queryset:
                    item = {}
                    item['id'] = i.id
                    item['cod_desinc'] = i.cod_desinc
                    item['origen'] = i.origen.nombre
                    item['tipo_desinc'] = i.tipo_desinc.denominacion
                    item['fecha_desinc'] = i.fecha_desinc
                    item['total'] = i.total
                    item['estado'] = i.estado
                    data.append(item)

            elif action == 'search_detalle_prod':
                data = []
                for i in DetDesincProd.objects.filter(desinc_id=request.POST['id']):
                    item = {}
                    item['id'] = i.id
                    item['fecha_traslado'] = i.desinc.fecha_desinc
                    item['cod_traslado'] = i.desinc.cod_desinc
                    item['nombredepar'] = i.codubica.nombre
                    item['codbien'] = i.codbien.codbien
                    item['prodnombre'] = i.prod.nombre + ' - ' + i.prod.descripcion
                    item['precio'] = i.precio
                    item['subtotal'] = i.subtotal
                    data.append(item)
                    print("Esto es lo que contiene item: ", item)
                    
            else:
                data['error'] = 'Ha ocurrido un error'
        except Exception as e:
            data['error'] = str(e)
        return JsonResponse(data, safe=False)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Listado de Desincorporaciones en Unidad'
        context['create_url'] = reverse_lazy('erp:desinc_create')
        context['list_url'] = reverse_lazy('erp:desinc_list')
        context['entity'] = 'Desincorporaciones'
        context['btn_name'] = 'Nuevo Registro'
        return context

class DesincCreateView(LoginRequiredMixin, Perms_Check, CreateView):
    model = DesincProduc
    form_class = DesincProdForm
    template_name = 'desincorp/create.html'
    success_url = reverse_lazy('erp:desinc_list')
    url_redirect = success_url
    permission_required = 'erp.add_desincproduc'

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            action = request.POST['action']
            if action == 'search_products':
                data = []
                 # muy importante los covierto a una lista para poder tratarlos, ya que cuando los envie desde ajax lo avia  convertido a string
                ids_exclude = json.loads(request.POST['idsCodbien'])
                term = request.POST['term'].strip()                
                
                for i in InventarioBienes.objects.filter(unidad_id__in=request.POST['idorigen']).exclude(ult_proc='DESINC').exclude(codbien_id__in=ids_exclude):
                    item = {}
                    item['full_name'] = i.prod.nombre + ' / ' + i.prod.descripcion
                    item['imagen'] = i.prod.get_imagen()                    
                    item['precio'] = i.prod.precio
                    item['prod'] = i.prod_id
                    item['codbien'] = i.codbien.toJSON()
                    item['codubica'] = i.ubica_fisica.toJSON()
                    item['salida'] = i.salida_id
                    item['id'] = i.id
                    data.append(item)

            elif action == 'search_responorigen':
                data = []
                #data = [{'id': '', 'text': '-----------'}]
                for i in Unidad.objects.filter(id=request.POST['id']):
                    item = {}
                    item['nombrejefe'] = i.nombrejefe + ' - ' + i.ced_resp
                    data.append(item)  

            elif action == 'search_autocomplete':
                data = []
                ids_exclude = json.loads(request.POST['idsCodbien'])
                term = request.POST['term'].strip()
                data.append({'id': term, 'text':term})

                for i in InventarioBienes.objects.filter(unidad_id__in=request.POST['idorigen']).exclude(ult_proc='DESINC').exclude(codbien_id__in=ids_exclude):
                    item = {}
                    item['full_name'] = i.prod.nombre  + ' / ' + i.prod.descripcion
                    item['imagen'] = i.prod.get_imagen()                    
                    item['precio'] = i.prod.precio
                    item['prod'] = i.prod_id
                    item['codbien'] = i.codbien.toJSON()
                    item['codubica'] = i.ubica_fisica.toJSON()
                    item['salida'] = i.salida_id
                    item['id'] = i.id
                    data.append(item)
                    
            elif action == 'add':
                with transaction.atomic():
                    desincorp = json.loads(request.POST['desincorp'])
                   # print(self.request.POST)
                    desinc = DesincProduc()
                    desinc.cod_desinc = desincorp['cod_desinc']
                    desinc.origen_id = desincorp['origen']
                    desinc.respon_origen = desincorp['respon_origen']
                    # desinc.ubicafisica_id = desincorp['ubicafisica']
                    desinc.tipo_desinc_id= desincorp['tipo_desinc']                    
                    desinc.fecha_desinc = desincorp['fecha_desinc']
                    desinc.usuario = self.request.user
                    desinc.observ = desincorp['observ']
                    desinc.estado = 'DIS'
                    desinc.soportedocum = desincorp['soportedocum']
                    #self.request.user
                    desinc.save()

                    for i in desincorp['produc_desinc']:
                        det = DetDesincProd()
                        det.precio = Decimal(i['precio'])
                        det.subtotal = Decimal(i['subtotal'])
                        det.codbien_id = int(i['codbien']['id'])
                        det.codubica_id = int(i['codubica']['id'])
                        det.desinc_id = desinc.id
                        det.prod_id = i['prod']
                        det.save()

                        invbienes = InventarioBienes.objects.get(codbien=int(i['codbien']['id']))
                        invbienes.tipo_proc_id = desincorp['tipo_desinc']
                        invbienes.ult_proc = 'DESINC'
                        invbienes.date_joined = desincorp['fecha_desinc']
                        invbienes.save()

                    data = {'id': desinc.id}
            elif action == 'search_ubicafisica':
                data = []
                term = request.POST['term']
                ubicafisica = Departamento.objects.filter(
                    Q(nombre__icontains=term))[0:10]
                for i in ubicafisica:
                    item = i.toJSON()
                    item['text'] = i.get_full_name()
                    data.append(item)
            elif action == 'busca_codbien':

                data = []
                # ids_exclude = json.loads(request.POST['idsCodbien'])
                term = request.POST['term'].strip()
                codbienes = CodBienes.objects.filter(estado__icontains='SAS')

                if len(term):
                    codbienes = codbienes.filter(codbien__icontains=term)
                for i in codbienes[0:1]:
                    item = i.toJSON()
                    item['value'] = i.codbien
                    # item['text'] = i.name
                    data.append(item)
            elif action == 'create_unidad':
                with transaction.atomic():
                    frmDestino =  UnidadForm(request.POST)
                    data = frmDestino.save()
            elif action == 'create_departamento':
                with transaction.atomic():
                    frmDepar =  FormDepart(request.POST)
                    data = frmDepar.save()

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
        context['title'] = 'Creando Nueva Desincorporación'
        context['entity'] = 'Desincorporación'
        context['list_url'] = self.success_url
        context['action'] = 'add'
        context['iva'] = Empresa.objects.values('nameimpuesto', ('iva')).last()
        context['frmUnidad'] = UnidadForm()
        context['frmdepar'] = FormDepart()
        context['frmConcepMov'] = FormConcepMov()
        # context['btn_name'] = 'Nuevo Ingreso'
        context['det'] = []
        return context

class DesincUpdateView(LoginRequiredMixin, Perms_Check, UpdateView):
    model = DesincProduc
    form_class = DesincProdForm
    template_name = 'desincorp/create.html'
    success_url = reverse_lazy('erp:desinc_list')
    url_redirect = success_url
    permission_required = 'erp.change_desincproduc'


    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)
    
    def get_form(self, form_class=None):
        instance = self.get_object()
        form = DesincProdForm(instance=instance)
        # form.fields['origen'].queryset = Unidad.objects.filter(id=instance.origen.id)
        return form

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            action = request.POST['action']
            if action == 'search_products':
                data = []
                 
                ids_exclude = json.loads(request.POST['idsCodbien'])
                term = request.POST['term'].strip()
                
                for i in InventarioBienes.objects.filter(unidad_id__in=request.POST['idorigen']).exclude(ult_proc='DESINC').exclude(codbien_id__in=ids_exclude):
                    item = {}
                    item['full_name'] = i.prod.nombre  + ' / ' + i.prod.descripcion
                    item['imagen'] = i.prod.get_imagen()                    
                    item['precio'] = i.prod.precio
                    item['prod'] = i.prod_id
                    item['codbien'] = i.codbien.toJSON()
                    item['codubica'] = i.ubica_fisica.toJSON()
                    item['salida'] = i.salida_id
                    item['id'] = i.id
                    data.append(item)

            elif action == 'search_responorigen':
                data = []
                #data = [{'id': '', 'text': '-----------'}]
                for i in Unidad.objects.filter(id=request.POST['id']):
                    item = {}
                    item['nombrejefe'] = i.nombrejefe + ' - ' + i.ced_resp
                    data.append(item)   

            elif action == 'search_autocomplete':
                data = []
                ids_exclude = json.loads(request.POST['idsCodbien'])
                term = request.POST['term'].strip()
                data.append({'id': term, 'text':term})

                for i in InventarioBienes.objects.filter(unidad_id__in=request.POST['idorigen']).exclude(ult_proc='DESINC').exclude(codbien_id__in=ids_exclude):
                    item = {}
                    item['full_name'] = i.prod.nombre  + ' / ' + i.prod.descripcion
                    item['imagen'] = i.prod.get_imagen()                    
                    item['precio'] = i.prod.precio
                    item['prod'] = i.prod_id
                    item['codbien'] = i.codbien.toJSON()
                    item['codubica'] = i.ubica_fisica.toJSON()
                    item['salida'] = i.salida_id
                    item['id'] = i.id
                    data.append(item)
            elif action == 'edit':
                with transaction.atomic():
                    desincorp = json.loads(request.POST['desincorp'])
                    desinc = self.get_object()
                    #desinc.cod_desinc = desincorp['cod_desinc']
                    desinc.origen_id = desincorp['origen']
                    # desinc.respon_origen = desincorp['respon_origen']
                    desinc.tipo_desinc_id= desincorp['tipo_desinc']                    
                    desinc.fecha_desinc = desincorp['fecha_desinc']
                    desinc.usuario = self.request.user
                    desinc.observ = desincorp['observ']
                    desinc.estado = 'DIS'
                    desinc.soportedocum = desincorp['soportedocum']
                   # desinc.detdesincprod_desinc_set.all().delete()
                    desinc.save()

                    for i in DetDesincProd.objects.filter(desinc_id=self.get_object().id):                    
                        invbienes= InventarioBienes.objects.get(codbien_id=i.codbien_id)

                        if invbienes.ant_ult_proc == 'DIST':
                            # dist = SalidaProduc.objects.get(id=invbienes.salida_id)
                            for sal in DetSalidaProd.objects.filter(codbien_id=invbienes.codbien_id):
                            
                                invbienes.ult_proc = 'DIST'
                                invbienes.tipo_proc_id = sal.salida.tipo_salida_id
                                invbienes.date_joined = sal.salida.fecha_salida
                                invbienes.save()
                        else:
                            for tras in DetTrasladoProd.objects.filter(codbien_id=invbienes.codbien_id):
                                invbienes.ult_proc = 'TRAS'
                                invbienes.tipo_proc_id = tras.trasproduc.tipo_traslado_id
                                invbienes.date_joined = tras.trasproduc.fecha_traslado
                                invbienes.save()

                    
                    detdesinc = DetDesincProd.objects.filter(desinc_id=self.get_object().id)
                    detdesinc.delete()


                    for i in desincorp['produc_desinc']:
                        det = DetDesincProd()
                        det.precio = Decimal(i['precio'])
                        det.subtotal = Decimal(i['subtotal'])
                        det.codbien_id = int(i['codbien']['id'])
                        det.codubica_id = int(i['codubica']['id'])
                        det.desinc_id = desinc.id
                        det.prod_id = int(i['id'])
                        det.save()

                        invbienes = InventarioBienes.objects.get(codbien_id=int(i['codbien']['id']))
                        invbienes.tipo_proc_id = desincorp['tipo_desinc']
                        invbienes.ult_proc = 'DESINC'
                        invbienes.date_joined = desincorp['fecha_desinc']
                        invbienes.save()

                    data = {'id': desinc.id}
            elif action == 'search_ubicafisica':
                data = []
                term = request.POST['term']
                ubicafisica = Departamento.objects.filter(
                    Q(nombre__icontains=term))[0:10]
                for i in ubicafisica:
                    item = i.toJSON()
                    item['text'] = i.get_full_name()
                    data.append(item)
            
            elif action == 'create_unidad':
                with transaction.atomic():
                    frmDestino =  UnidadForm(request.POST)
                    data = frmDestino.save()

            elif action == 'create_departamento':
                with transaction.atomic():
                    frmDepar =  FormDepart(request.POST)
                    data = frmDepar.save()
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
            for i in DetDesincProd.objects.filter(desinc_id=self.get_object().id):
               # print(i)
               item = {}
               item = i.prod.toJSON()
               item['codigo'] = i.prod.categorias.nombre
               item['full_name'] = i.prod.nombre + ' / ' + i.prod.categorias.nombre
               item['precio'] = i.precio
               item['subtotal'] = i.subtotal
               item['codbien'] = i.codbien.toJSON()
               item['codubica'] = i.codubica.toJSON()
               data.append(item)
        except:
            pass
        return data

    def get_context_data(self, **kwargs):     
        context = super().get_context_data(**kwargs)
        context['title'] = f'Edición de la Desincorporación: {self.object.cod_desinc}'
        context['entity'] = 'Desincorporación'
        context['list_url'] = self.success_url
        context['action'] = 'edit'
        context['iva'] = Empresa.objects.values('nameimpuesto', 'iva').last()
        context['frmUnidad'] = UnidadForm()
        context['frmdepar'] = FormDepart()
        context['frmConcepMov'] = FormConcepMov()
        # context['btn_name'] = 'Nuevo Ingreso'
        context['det'] = json.dumps(self.get_details_product(), cls=DecimalEncoder)
        return context

class DecimalEncoder(json.JSONEncoder):
  def default(self, obj):
    if isinstance(obj, Decimal):
      return str(obj)
    return json.JSONEncoder.default(self, obj)

class DesincDeleteView(LoginRequiredMixin, DeleteView):
    model = DesincProduc
    permission_required = 'erp.delete_desincproduc'

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        self.object = self.get_object()
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            perms = ('erp.delete_desincproduc',)
            if request.user.has_perms(perms):
                with transaction.atomic():
                    for i in DetDesincProd.objects.filter(desinc_id=self.get_object().id):                    
                        invbienes = InventarioBienes.objects.get(codbien_id=i.codbien_id)

                        if invbienes.ant_ult_proc == 'DIST':
                            # dist = SalidaProduc.objects.get(id=invbienes.salida_id)
                            for sal in DetSalidaProd.objects.filter(codbien_id=invbienes.codbien_id):
                            
                                invbienes.ult_proc = 'DIST'
                                invbienes.tipo_proc_id = sal.salida.tipo_salida_id
                                invbienes.date_joined = sal.salida.fecha_salida
                                invbienes.save()
                        else:
                            for tras in DetTrasladoProd.objects.filter(codbien_id=invbienes.codbien_id):
                                invbienes.ult_proc = 'TRAS'
                                invbienes.tipo_proc_id = tras.trasproduc.tipo_traslado_id
                                invbienes.date_joined = tras.trasproduc.fecha_traslado
                                invbienes.save()
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

class DesincFacturaPdfView(View):
   def get(self, request, *args, **kwargs):
        try:
            template = get_template('desincorp/PDF_Desinc.html')
            # encab_distrib= trasladoProduc.objects.get(id=self.kwargs['pk']).values('cod_traslado', 'origen', 'origen__nombre',  'destino', 'destino__nombre', 'destino__nombrejefe', 'tipo_traslado', 'tipo_comprob', 'num_comprob', 'subtotal', 'iva', 'total', 'fecha_traslado', 'usuario', 'observ', 'estado', 'aprobado')
            encab_desinc= DesincProduc.objects.get(pk=self.kwargs['pk'])
            detalle_desinc= DetDesincProd.objects.filter(desinc_id=self.kwargs['pk']).order_by('codubica_id')
            context = {
            'encab_desinc': encab_desinc,
            'detalle_desinc': detalle_desinc,
            'comp': {'fecha': datetime.now, 'name': 'Dirección Regional de Salud Estado Portuguesa', 'rif': 'G-20008795-1', 'tlf': '(0257) - 2531550 - 2512246 - 2534014', 'redsocial': 'http://saludportuguesa.gob.ve; twitter: @saludportuguesa', 'address': 'Carrera 3 con calle 09 Antiguo Hospital, Sector Curazao Guanare Portuguesa Venezuela'},
            'icon': '{}{}'.format(settings.MEDIA_URL, 'imagportadalogin/klipartzcom.png')
            }
            html = template.render(context)
            css_url = os.path.join(settings.BASE_DIR, 'static/lib/bootstrap-4.6.0-dist/css/bootstrap.min.css')
            pdf = HTML(string=html, base_url=request.build_absolute_uri()).write_pdf(stylesheets=[CSS(css_url)])
            return HttpResponse(pdf, content_type='application/pdf')
        except:
            pass
        return HttpResponseRedirect(reverse_lazy('erp:desinc_list'))