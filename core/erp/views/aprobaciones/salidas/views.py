import json
import os
from django.conf import settings
from django.db import transaction
from django.db.models import Q
from core.erp.forms import SalidasForm
from core.reportes.forms import ReportForm
from core.erp.models import Producto, Almacen, Unidad, SalidaProduc, DetSalidaProd, DetSalidaInsumos, DetIngresoProduc, Departamento, CodBienes, InventarioBienes, ConcepMovimiento, ControlStock
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import JsonResponse, HttpResponseRedirect, HttpResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import FormView, CreateView, UpdateView
from weasyprint import HTML, CSS
from django.template.loader import get_template
from django.urls import reverse_lazy
from decimal import Decimal
#from xhtml2pdf import pisa
from django.template import Context
from core.erp.mixins import ValidatePermissionRequiredMixin, Perms_Check

from configuracion.settings import MEDIA_URL, STATIC_URL

class AprobacionDistListView(LoginRequiredMixin, Perms_Check, FormView):
    model = SalidaProduc
    form_class = ReportForm
    template_name = 'aprobaciones/salidas/list.html'
    permission_required = 'auth.view_aprob'

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
                    queryset = queryset.filter(estado='DIS').filter(fecha_salida__range=[start_date, end_date])
                for i in queryset:
                    data.append(i.toJSON())

            elif action == 'search_detalle_prod':
                data = []
                for i in DetSalidaProd.objects.filter(salida_id=request.POST['id']):
                    item = {}
                    item['id'] = i.id
                    item['nombre'] = i.codubica.nombre
                    item['codbien'] = i.codbien.codbien
                    item['proddesc'] = i.prod.descripcion
                    item['prodcateg'] = i.prod.categorias.nombre
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
            
            elif action == 'edit':
                with transaction.atomic():
                    salida = SalidaProduc.objects.get(id=request.POST['param_id'])
                    salida.estado = request.POST['new_estado']
                    salida.save()

                    if salida.estado == 'APR':
                        if salida.tipo_salida.codigo == '53':
                            for sal in DetSalidaProd.objects.filter(salida_id=request.POST['param_id']):
                                stock = ControlStock.objects.all()
                                stock = stock.filter(almacenes_id=sal.salida.origen_id, productos_id=sal.prod_id)
                                for s in stock:
                                    s.stock_actual -= sal.cant 
                                    s.save()                  
                            
                                invbienes = InventarioBienes()
                                invbienes.codbien_id = sal.codbien_id
                                invbienes.prod_id = sal.prod_id
                                invbienes.unidad_id = sal.salida.destino_id
                                invbienes.ubica_fisica_id = sal.codubica_id
                                invbienes.tipo_proc_id = sal.salida.tipo_salida_id
                                invbienes.ant_tipo_proc_id = sal.salida.tipo_salida_id
                                invbienes.date_joined = sal.salida.fecha_salida
                                invbienes.ult_proc = 'DIST'
                                invbienes.ant_ult_proc = 'DIST'
                                invbienes.salida_id = sal.salida_id
                                invbienes.save()
                        else:
                            for sal in DetSalidaInsumos.objects.filter(salida_id=request.POST['param_id']):
                                stock = ControlStock.objects.all()
                                stock = stock.filter(almacenes_id=sal.salida.origen_id, productos_id=sal.prod_id)
                                for s in stock:
                                    s.stock_actual -= sal.cant 
                                    s.save() 
                       
            else:
                data['error'] = 'Ha ocurrido un error'
        except Exception as e:
            data['error'] = str(e)
        return JsonResponse(data, safe=False)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Listado de Distribuciones por Aprobar'
        context['entity'] = 'Actualizar'
        context['frmStatus'] = SalidasForm()
        return context

# class AprobacionDistUpdateView(LoginRequiredMixin, ValidatePermissionRequiredMixin, UpdateView):
#     model = SalidaProduc
#     form_class = SalidasForm
#     template_name = 'aprobaciones/salidas/list.html'
#     permission_required = 'view_aprobations'

#     @method_decorator(csrf_exempt)
#     def dispatch(self, request, *args, **kwargs):
#         return super().dispatch(request, *args, **kwargs)

#     # def get_form(self, form_class=None):
#     #     instance = self.get_object()
#     #     form = SalidasForm(instance=instance)
#     #     form.fields['destino'].queryset = Unidad.objects.filter(id=instance.destino.id)
#     #     return form

#     def post(self, request, *args, **kwargs):
#         data = {}
#         try:
#             action = request.POST['action']
#             if action == 'edit':
#                 salida = self.get_object()
#                 salida.estado = ''
#                 salida.save()          
#                 data = {'id': salida.id}
                
#             else:
#                 data['error'] = 'No ha ingresado a ninguna opción'
#         except Exception as e:
#             data['error'] = str(e)
#         return JsonResponse(data, safe=False)

#     def get_context_data(self, **kwargs):
#         context['action'] = 'edit'
#         context['frmStatus'] = SalidasForm()
#         return context
