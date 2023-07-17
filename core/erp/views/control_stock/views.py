import json
from django.conf import settings
from django.db import transaction
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import JsonResponse, response
from django.urls import reverse_lazy
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import ListView, FormView
#from django.views.generic import TemplateView

from core.erp.forms import FormControlStock
from core.erp.models import Producto, Almacen, ControlStock
from django.template.loader import get_template
from core.erp.mixins import ValidatePermissionRequiredMixin, Perms_Check
from decimal import Decimal
from django.template import Context


class StockListView(LoginRequiredMixin, Perms_Check, FormView):
    model = ControlStock
    form_class = FormControlStock
    template_name = 'control_stock/list.html'
    permission_required = 'erp.view_controlstock'

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            action = request.POST['action']           
            if action == 'searchdata':
                data = []
                almacen = request.POST['almacen']
                queryset = ControlStock.objects.all()
                if almacen:
                    queryset = queryset.filter(almacenes_id__in=request.POST['almacen'])
                    for i in queryset:
                        item = {}
                        item['id'] = i.productos.id
                        item['prod'] = i.productos.nombre
                        item['desc'] = i.productos.descripcion                  
                        item['categorias'] = i.productos.categorias.nombre
                        item['precio'] = i.precio
                        item['stock'] = i.stock_actual
                        item['stock_min'] = i.stock_min
                        item['stock_max'] = i.stock_max
                        data.append(item)

            # elif action == 'edit':
            #     products = json.loads(request.POST['product'])
            #     stock_minimos = json.loads(request.POST['stock_minimo'])
                
            #     for i, product in enumerate(products):
            #         prod_id = product['prod_id']
            #         stock_min = stock_minimos[i]
                    
            #         queryset = ControlStock.objects.filter(almacenes_id=request.POST['almacen'], productos_id=prod_id)
                    
            #         for control_stock in queryset:
            #             control_stock.stock_min = stock_min
            #             control_stock.save()
                        
            #             print('Producto Filtrado: ', control_stock.productos.nombre)
            #             print('Valor del stock mínimo: ', stock_min)
            
            elif action == 'edit':
                product = json.loads(request.POST['product'])
                stock_minimo = json.loads(request.POST['stock_minimo'])
                queryset = ControlStock.objects.all()
                prod_id = list(filter(None, product['prod_id']))
                for p in prod_id:
                    for s in queryset.filter(almacenes_id=request.POST['almacen'], productos_id=p):
                        for st_min in stock_minimo['stock_min']:
                            s.stock_min = st_min
                        #s.stock_max = stock['stock_max']
                            print('Productos Filtrados: ', s.productos.nombre)
                            print('Valor de los stock minimos: ', st_min)
                            s.save()

            else:
                data['error'] = 'Ha ocurrido un error'
        except Exception as e:
            data['error'] = str(e)
        return JsonResponse(data, safe=False)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Listado de Productos'
        #context['create_url'] = reverse_lazy('erp:_create')
        context['list_url'] = reverse_lazy('erp:stock_list')
        #context['btn_name'] = 'Nuevo Producto'
        context['entity'] = 'Productos'
        return context
