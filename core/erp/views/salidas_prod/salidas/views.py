import json
import os
from django.conf import settings
from django.db import transaction
from django.db.models import Q
from core.erp.forms import SalidasForm, UnidadForm, FormDepart, FormConcepMov
from core.reportes.forms import ReportForm
from core.erp.models import ControlStock, Almacen, Unidad, SalidaProduc, DetSalidaProd, DetSalidaInsumos, Empresa, Departamento, CodBienes, InventarioBienes, ConcepMovimiento
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import JsonResponse, HttpResponseRedirect, HttpResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import FormView, CreateView, UpdateView, DeleteView, View
from weasyprint import HTML, CSS
from django.template.loader import get_template
from django.urls import reverse_lazy
from decimal import Decimal
from django.template import Context
from datetime import date, datetime
from core.erp.mixins import ValidatePermissionRequiredMixin, Perms_Check

from configuracion.settings import MEDIA_URL, STATIC_URL


class SalidaListView(LoginRequiredMixin, Perms_Check, FormView):
    model = SalidaProduc
    form_class = ReportForm
    template_name = 'salidas_prod/list.html'
    permission_required = 'erp.view_salidaproduc'

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
                queryset = SalidaProduc.objects.all()
                if len(start_date) and len(end_date):
                    queryset = queryset.filter(fecha_salida__range=[start_date, end_date])
                for i in queryset:
                    data.append(i.toJSON())                

            elif action == 'search_detalle_prod':
                data = []
                for i in DetSalidaProd.objects.filter(salida_id=request.POST['id']):
                    item = {}
                    item['id'] = i.id
                    item['nombre'] = i.codubica.nombre
                    item['codbien'] = i.codbien.codbien
                    item['prodcateg'] = i.prod.categorias.nombre
                    item['proddesc'] = i.prod.descripcion
                    item['prodnombre'] = i.prod.nombre
                    item['precio'] = i.precio
                    data.append(item)
            
            elif action == 'search_detalle_mc':
                data = []
                for i in DetSalidaInsumos.objects.filter(salida_id=request.POST['id']):
                    item = {}
                    item['id'] = i.id
                    item['prod'] = i.prod.nombre +' / '+ i.prod.descripcion
                    item['categoria'] = i.prod.categorias.nombre
                    item['precio'] = i.precio
                    item['cantidad'] = i.cant
                    item['lote'] = i.nro_lote
                    item['fecha_venc'] = i.fecha_venc
                    data.append(item)
            else:
                data['error'] = 'Ha ocurrido un error'
        except Exception as e:
            data['error'] = str(e)
        return JsonResponse(data, safe=False)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Listado de Distribución de Productos'
        context['create_url'] = reverse_lazy('erp:salida_create')
        context['list_url'] = reverse_lazy('erp:salida_list')
        context['entity'] = 'Distribuciones'
        context['btn_name'] = 'Nuevo Registro'
       # context['form'] = SalidasForm()
        return context

class SalidaCreateView(LoginRequiredMixin, Perms_Check, CreateView):
    model = SalidaProduc
    form_class = SalidasForm
    template_name = 'salidas_prod/create.html'
    success_url = reverse_lazy('erp:salida_list')
    url_redirect = success_url
    permission_required = 'erp.add_salidaproduc'

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)
    def post(self, request, *args, **kwargs):
        data = {}
        try:
            action = request.POST['action']
            
            if action == 'search_products':
                data = []                 
                datos_cantprod = json.loads(request.POST['datos_cantprod'])
                term = request.POST['term'].strip()                
                products = ControlStock.objects.filter(almacenes_id__in=request.POST['idorigen']).filter(stock_actual__gt=0).filter(productos__activo__in='1').filter(productos__grupobien__cod_grupo='02')
                
                if len(term):
                    products = products.filter(productos__nombre__icontains=term)
                for i in products:
                    for l in datos_cantprod:
                        if(i.id == l['id']):
                            i.stock_actual= int(i.stock_actual) - int(l['cantprod'])                         
                    if(i.stock_actual>0):
                        item = i.toJSON()
                        item['value'] = i.productos.nombre
                        data.append(item) 
            
            elif action == 'search_suministros':
                data = []                
                products2 = ControlStock.objects.filter(almacenes_id__in=request.POST['idorigen2']).filter(stock_actual__gt=0).filter(productos__activo__in='1').filter(productos__grupobien__cod_grupo='04')
                for i in products2:
                    item = i.toJSON()
                    item['value'] = i.productos.nombre
                    data.append(item)
                    
            elif action == 'search_autocomplete':
                data = []
                datos_cantprod = json.loads(request.POST['datos_cantprod'])
                # ids_exclude = json.loads(request.POST['ids'])
                term = request.POST['term'].strip()
                data.append({'id': term, 'text':term})
                products = ControlStock.objects.filter(almacenes_id__in=request.POST['idorigen']).filter(stock_actual__gt=0).filter(productos__activo__in='1').filter(productos__grupobien__cod_grupo='02')

                if len(term):
                    products = products.filter(productos__nombre__icontains=term)

                for i in products:
                    for l in datos_cantprod:
                        if(i.id == l['id']):
                            i.stock_actual= int(i.stock_actual) - int(l['cantprod'])                         
                        
                    if(i.stock_actual>0):
                        item = i.toJSON()
                        item['text'] = i.productos.nombre
                        data.append(item)

            elif action == 'search_autocomplete_suminist':
                data = []
                ids_exclude = json.loads(request.POST['ids'])
                term = request.POST['term'].strip()
                data.append({'id': term, 'text':term})
                products = ControlStock.objects.filter(almacenes_id__in=request.POST['idorigen2']).filter(stock_actual__gt=0).filter(productos__activo__in='1').filter(productos__grupobien__cod_grupo='04')
                
                if len(term):
                    products = products.filter(productos__nombre__icontains=term)
                
                for i in products.exclude(productos_id__in=ids_exclude)[0:20]:
                    item = i.toJSON()
                    item['text'] = i.productos.nombre
                    data.append(item)

            elif action == 'search_responorigen':
                data = []
                #data = [{'id': '', 'text': '-----------'}]
                for i in Unidad.objects.filter(id=request.POST['id']):
                    item = {}
                    item['nombrejefe'] = i.nombrejefe + ' - ' + i.ced_resp
                    data.append(item)

            elif action == 'add':
                with transaction.atomic():
                    salidas = json.loads(request.POST['salidas'])
                    salida = SalidaProduc()
                    salida.cod_salida = salidas['cod_salida']
                    salida.origen_id = salidas['origen']
                    salida.respon_origen = salidas['respon_origen']
                    salida.destino_id = salidas['destino']
                    salida.respon_destino = salidas['respon_destino']
                    salida.tipo_salida_id = salidas['tipo_salida']
                    salida.tipo_comprob = salidas['tipo_comprob']
                    salida.num_comprob = salidas['num_comprob']
                    salida.subtotal = Decimal(salidas['subtotal'])
                    salida.iva = Decimal(salidas['iva'])
                    salida.total = Decimal(salidas['total'])
                    salida.fecha_salida = salidas['fecha_salida']
                    salida.usuario = self.request.user
                    salida.observ = salidas['observ']
                    salida.estado = 'DIS'
                    salida.save()

                    for sal in SalidaProduc.objects.filter(id=salida.id):
                        if sal.tipo_salida.codigo == '53':

                            for i in salidas['produc_sal']:
                                det = DetSalidaProd()
                                det.precio = Decimal(i['precio'])
                                det.cant = 1
                                det.subtotal = Decimal(i['subtotal'])
                                det.codbien_id = int(i['codbien']['id'])
                                det.codubica_id = int(i['codubica']['id'])
                                det.salida_id = salida.id
                                det.prod_id = i['id']
                                det.save()
                            
                                det.codbien.estado = 'ASI'
                                det.codbien.save()                        
                        else:
                            for i in salidas['produc_sal2']:
                                det = DetSalidaInsumos()
                                det.precio = Decimal(i['precio'])
                                det.cant = int(i['cant'])
                                det.subtotal = Decimal(i['subtotal'])
                                det.nro_lote = i['nro_lote']                       
                                det.fecha_venc = i['fecha_venc']
                                det.salida_id = salida.id
                                det.prod_id = i['id']
                                det.save()                    
                            
                        data = {'id': salida.id}
            
            elif action == 'search_destino':
                data = []
                term = request.POST['term']
                destinos = Unidad.objects.filter(
                    Q(nombre__icontains=term) | Q(rif__icontains=term) | Q(nombrejefe__icontains=term))[0:20]
                for i in destinos:
                    item = i.toJSON()
                    item['text'] = i.get_full_name()
                    data.append(item)
            elif action == 'busca_ubicacionfisica':
               
                data = []
                term = request.POST['term'].strip()
                ubicafisica = Departamento.objects.filter()
                if len(term):
                    ubicafisica = ubicafisica.filter(nombre__icontains=term)
                for i in ubicafisica:
                    item = i.toJSON()
                    item['value'] = i.nombre
                    # item['text'] = i.name
                    data.append(item)
            
            elif action == 'busca_codbien':

                data = []
                ids_exclude = json.loads(request.POST['idsCodbien'])
                term = request.POST['term'].strip()
                codbienes = CodBienes.objects.filter(estado__icontains='SAS')

                if len(term):
                    codbienes = codbienes.filter(codbien__icontains=term)
                for i in codbienes.exclude(id__in=ids_exclude)[0:3]:
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
        context['title'] = 'Creando nueva Distribución'
        context['entity'] = 'Distribuciones'
        context['list_url'] = self.success_url
        context['action'] = 'add'
        context['iva'] = Empresa.objects.values('nameimpuesto', ('iva')).last()
        context['frmUnidad'] = UnidadForm()
        context['frmDepart'] = FormDepart()
        context['frmConcepMov'] = FormConcepMov()
        # context['btn_name'] = 'Nuevo Ingreso'
        context['det'] = []
        #context['form'] = SalidasForm()
        return context

class SalidaUpdateView(LoginRequiredMixin, Perms_Check, UpdateView):
    model = SalidaProduc
    form_class = SalidasForm
    template_name = 'salidas_prod/create.html'
    success_url = reverse_lazy('erp:salida_list')
    url_redirect = success_url
    permission_required = 'erp.change_salidaproduc'

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get_form(self, form_class=None):
        instance = self.get_object()
        form = SalidasForm(instance=instance)
        form.fields['destino'].queryset = Unidad.objects.filter(id=instance.destino.id)
        return form

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            action = request.POST['action']
            if action == 'search_products':
                data = []                
                datos_cantprod = json.loads(request.POST['datos_cantprod'])
                term = request.POST['term'].strip()                
                products = ControlStock.objects.filter(almacenes_id__in=request.POST['idorigen']).filter(stock_actual__gt=0).filter(productos__activo__in='1').filter(productos__grupobien__cod_grupo='02')
                
                if len(term):
                    products = products.filter(productos__nombre__icontains=term)

                for i in products:
                    for l in datos_cantprod:
                        if(i.id == l['id']):
                            i.stock_actual= int(i.stock_actual) - int(l['cantprod'])                         
                    if(i.stock_actual>0):
                        item = i.toJSON()
                        item['value'] = i.productos.nombre
                        data.append(item) 
            
            elif action == 'search_suministros':
                data = []                
                products2 = ControlStock.objects.filter(almacenes_id__in=request.POST['idorigen2']).filter(stock_actual__gt=0).filter(productos__activo__in='1').filter(productos__grupobien__cod_grupo='04')
                for i in products2:
                    item = i.toJSON()
                    item['value'] = i.productos.nombre
                    data.append(item)
                    
            elif action == 'search_autocomplete':
                data = []
                datos_cantprod = json.loads(request.POST['datos_cantprod'])
                term = request.POST['term'].strip()
                data.append({'id': term, 'text':term})
                products = ControlStock.objects.filter(almacenes_id__in=request.POST['idorigen']).filter(stock_actual__gt=0).filter(productos__activo__in='1').filter(productos__grupobien__cod_grupo='02')

                if len(term):
                    products = products.filter(productos__nombre__icontains=term)

                for i in products:
                    for l in datos_cantprod:
                        if(i.id == l['id']):
                            i.stock_actual= int(i.stock_actual) - int(l['cantprod'])                         
                        
                    if(i.stock_actual>0):
                        item = i.toJSON()
                        item['text'] = i.productos.nombre
                        data.append(item)

            elif action == 'search_autocomplete_suminist':
                data = []
                ids_exclude = json.loads(request.POST['ids'])
                term = request.POST['term'].strip()
                data.append({'id': term, 'text':term})
                products = ControlStock.objects.filter(almacenes_id__in=request.POST['idorigen2']).filter(stock_actual__gt=0).filter(productos__activo__in='1').filter(productos__grupobien__cod_grupo='04')
                
                if len(term):
                    products = products.filter(productos__nombre__icontains=term)
                
                for i in products.exclude(productos_id__in=ids_exclude)[0:20]:
                    item = i.toJSON()
                    item['text'] = i.productos.nombre
                    data.append(item)

            elif action == 'edit':
                with transaction.atomic():
                    salidas = json.loads(request.POST['salidas'])                    
                    salida = self.get_object()
                    salida.cod_salida = salidas['cod_salida']
                    salida.origen_id = salidas['origen']
                    salida.respon_origen = salidas['respon_origen']
                    salida.destino_id = salidas['destino']
                    salida.respon_destino = salidas['respon_destino']
                    salida.tipo_salida_id = salidas['tipo_salida']
                    salida.tipo_comprob = salidas['tipo_comprob']
                    salida.num_comprob = salidas['num_comprob']
                    salida.subtotal = Decimal(salidas['subtotal'])
                    salida.iva = Decimal(salidas['iva'])
                    salida.total = Decimal(salidas['total'])
                    salida.fecha_salida = salidas['fecha_salida']
                    salida.usuario = self.request.user
                    salida.observ = salidas['observ']
                    salida.estado = 'DIS'
                    salida.save()
                    #salida.detsalidaprod_salida_set.all().delete() 
                    detsalida = DetSalidaProd.objects.filter(salida_id=self.get_object().id)                    
                    for det in detsalida:
                        det.codbien.estado = 'SAS'
                        det.codbien.save()          
                    detsalida.delete()

                    detsalidaMc = DetSalidaInsumos.objects.filter(salida_id=self.get_object().id)                       
                    detsalidaMc.delete()

                    for sal in SalidaProduc.objects.filter(id=salida.id):
                        if sal.tipo_salida.codigo == '53':

                            for i in salidas['produc_sal']:
                                det = DetSalidaProd()
                                det.precio = Decimal(i['precio'])
                                det.cant = int(i['cant'])
                                det.subtotal = Decimal(i['subtotal'])
                                det.codbien_id = int(i['codbien']['id'])
                                det.codubica_id = int(i['codubica']['id'])
                                det.salida_id = salida.id
                                det.prod_id = i['id']
                                det.save()
                            
                                det.codbien.estado = 'ASI'
                                det.codbien.save()                        
                        else:
                            for i in salidas['produc_sal2']:
                                det = DetSalidaInsumos()
                                det.precio = Decimal(i['precio'])
                                det.cant = int(i['cant'])
                                det.subtotal = Decimal(i['subtotal'])
                                det.nro_lote = i['nro_lote']                       
                                det.fecha_venc = i['fecha_venc']
                                det.salida_id = salida.id
                                det.prod_id = i['id']
                                det.save()                    
                        data = {'id': salida.id}
            
            elif action == 'search_destino':
                data = []
                term = request.POST['term']
                destinos = Unidad.objects.filter(
                    Q(nombre__icontains=term) | Q(rif__icontains=term))[0:20]
                for i in destinos:
                    item = i.toJSON()
                    item['text'] = i.get_full_name()
                    data.append(item)

            elif action == 'busca_ubicacionfisica':
                data = []
                term = request.POST['term'].strip()
                ubicafisica = Departamento.objects.filter()
                if len(term):
                    ubicafisica = ubicafisica.filter(nombre__icontains=term)
                for i in ubicafisica:
                    item = i.toJSON()
                    item['value'] = i.nombre
                    data.append(item)

            elif action == 'busca_codbien':
                data = []
                ids_exclude = json.loads(request.POST['idsCodbien'])
                term = request.POST['term'].strip()
                codbienes = CodBienes.objects.filter(estado__icontains='SAS')
                if len(term):
                    codbienes = codbienes.filter(codbien__icontains=term)
                for i in codbienes.exclude(id__in=ids_exclude)[0:3]:
                    item = i.toJSON()
                    item['value'] = i.codbien
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
        return JsonResponse(data, safe=False)

    def get_details_product(self):
        data = []
        try:
            for i in DetSalidaProd.objects.filter(salida_id=self.get_object().id):
                stock = ControlStock.objects.all()
                for s in stock.filter(almacenes_id=i.salida.origen, productos_id=i.prod_id):                
                    print(s)
                    item = i.prod.toJSON()
                    item['stock_actual'] = s.stock_actual
                    item['precio'] = s.precio
                    item['codbien'] = i.codbien.toJSON()
                    item['codubica'] = i.codubica.toJSON()
                    item['cant'] = i.cant
                    item['fila'] = i.id                          
                    data.append(item)
        except:
            pass
        return data   

    def get_details_mc(self):
        data = []
        try:
            for i in DetSalidaInsumos.objects.filter(salida_id=self.get_object().id):
                stock = ControlStock.objects.all()
                for s in stock.filter(almacenes_id=i.salida.origen, productos_id=i.prod_id):
                    item = s.toJSON()                    
                    item['cant'] = i.cant
                    item['prod'] = i.prod.toJSON()
                    item['stock_actual'] = s.stock_actual
                    item['precio'] = s.precio
                    item['nro_lote'] = i.nro_lote
                    item['fecha_venc'] = i.fecha_venc       
                    data.append(item)
                    print(data)
        except:
            pass
        return data           

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = f'Edición de la Distribución: {self.object.cod_salida}'
        context['entity'] = 'Salidas'
        context['list_url'] = self.success_url
        context['action'] = 'edit'
        context['iva'] = Empresa.objects.values('nameimpuesto', ('iva')).last()
        # aqui para evitar errores de datos especialmente de null etc, los convierto en formato json.
        context['det'] = json.dumps(self.get_details_product(), cls=DecimalEncoder)
        context['det_mc'] = json.dumps(self.get_details_mc(), cls=Encoder)
        context['frmUnidad'] = UnidadForm()
        context['frmDepar'] = FormDepart()
        context['frmConcepMov'] = FormConcepMov()
        return context

class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return str(obj)
        return json.JSONEncoder.default(self, obj)

class Encoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return str(obj)
        elif isinstance(obj, (datetime, date)):
            return obj.isoformat()
        return json.JSONEncoder.default(self, obj)

class SalidaDeleteView(LoginRequiredMixin, DeleteView):
    model = SalidaProduc
    form_class = SalidasForm
    permission_required = 'erp.delete_salidaproduc'

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        self.object = self.get_object()
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            perms = ('erp.delete_salidaproduc',)
            if request.user.has_perms(perms):                                  
                # invbienes= InventarioBienes.objects.filter(salida_id=self.get_object().id)
                # invbienes.delete()
                self.object.delete()
            else:
                data['error'] = 'No tiene permisos para realizar esta acción'
                    
        except Exception as e:
            data['error'] = str(e)
        return JsonResponse(data)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)        
        return context

class SalidaFacturaPdfView(Perms_Check, View):
    permission_required = 'erp.add_salidaproduc'

    def get(self, request, *args, **kwargs):
        try:            
            template = get_template('salidas_prod/inven_pordistribPDF.html')
        #  encab_distrib= SalidaProduc.objects.get(id=self.kwargs['pk']).values('cod_salida', 'origen', 'origen__nombre',  'destino', 'destino__nombre', 'destino__nombrejefe', 'tipo_salida', 'tipo_comprob', 'num_comprob', 'subtotal', 'iva', 'total', 'fecha_salida', 'usuario', 'observ', 'estado', 'aprobado')
            encab_distrib= SalidaProduc.objects.get(pk=self.kwargs['pk'])

            detalle_distrib= DetSalidaProd.objects.filter(salida_id=self.kwargs['pk']).order_by('codubica_id')

            context = {
            'encab_distrib': encab_distrib,
            'detalle_distrib': detalle_distrib,
            'comp': {'fecha': datetime.now, 'name': 'Dirección Regional de Salud Estado Portuguesa', 'rif': 'G-20008795-1', 'tlf': '(0257) - 2531550 - 2512246 - 2534014', 'redsocial': 'http://saludportuguesa.gob.ve; twitter: @saludportuguesa', 'address': 'Carrera 3 con calle 09 Antiguo Hospital, Sector Curazao Guanare Portuguesa Venezuela'},
            'icon': '{}{}'.format(settings.MEDIA_URL, 'imagportadalogin/klipartzcom.png')
            }

            html = template.render(context)
            css_url = os.path.join(settings.BASE_DIR, 'static/lib/bootstrap-4.6.0-dist/css/bootstrap.min.css')
            pdf = HTML(string=html, base_url=request.build_absolute_uri()).write_pdf(stylesheets=[CSS(css_url)])
            return HttpResponse(pdf, content_type='application/pdf')
        except:
            pass
        return HttpResponseRedirect(reverse_lazy('erp:salida_list'))






   
