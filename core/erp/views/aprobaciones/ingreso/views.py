import json
import os
from django.conf import settings
from django.db import transaction
from django.db.models import Q
from core.erp.forms import IngresosForm
from core.erp.models import IngresoProduc, DetIngresoProduc, ControlStock, Seriales, Lotes
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import JsonResponse, HttpResponseRedirect, HttpResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import FormView
from weasyprint import HTML, CSS
from django.template.loader import get_template
from django.urls import reverse_lazy
from decimal import Decimal
#from xhtml2pdf import pisa
from django.template import Context
from core.reportes.forms import ReportForm

from core.erp.mixins import ValidatePermissionRequiredMixin, Perms_Check
from configuracion.settings import MEDIA_URL, STATIC_URL

class AprobIngresoListView(LoginRequiredMixin, Perms_Check, FormView):
    model = IngresoProduc
    form_class = ReportForm
    template_name = 'aprobaciones/ingreso/list.html'
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
                queryset = IngresoProduc.objects.all()
                if len(start_date) and len(end_date):
                    queryset = queryset.filter(estado='DIS').filter(fecha_ingreso__range=[start_date, end_date])
                for i in queryset:
                    data.append(i.toJSON())

            elif action == 'search_detalle_prod':
                data = []
                for i in DetIngresoProduc.objects.filter(ingresoPro_id=request.POST['id']):
                    data.append(i.toJSON())

            elif action == 'edit':
                with transaction.atomic():
                    ingreso = IngresoProduc.objects.get(id=request.POST['param_id'])
                    status = request.POST["new_estado"]
                    #print('STATUSSSS: ', status)
                    ingreso.estado = status
                    ingreso.save()

                    if ingreso.estado == 'APR':
                        for det in DetIngresoProduc.objects.filter(ingresoPro_id=request.POST['param_id']):
                            stock = ControlStock.objects.all()
                            stock = stock.filter(almacenes_id=det.ingresoPro.almacen_id, productos_id=det.prod_id)
                            if stock:
                                for c in stock.filter(productos_id=det.prod_id):
                                    c.stock_actual += det.cant
                                    c.precio = det.precio 
                                    c.save()
                            else:
                                stock = ControlStock()
                                stock.stock_actual += det.cant
                                stock.precio = det.precio
                                stock.almacenes_id = det.ingresoPro.almacen_id
                                stock.productos_id = det.prod_id 
                                stock.save()

                            for s in Seriales.objects.filter(incorp_id=ingreso.id):
                                for id_stock in ControlStock.objects.filter(almacenes_id=ingreso.almacen_id, productos_id=s.prod_id):
                                    s.stock_id = id_stock.id
                                    s.disp = "Disponible"
                                    s.save()

                            for l in Lotes.objects.filter(incorp_id=ingreso.id):
                                for id_stock in ControlStock.objects.filter(almacenes_id=ingreso.almacen_id, productos_id=l.prod_id):
                                    l.stock_id = id_stock.id
                                    l.save()                                                    
                           
            else:
                data['error'] = 'Ha ocurrido un error'
        except Exception as e:
            data['error'] = str(e)
        return JsonResponse(data, safe=False)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Listado de Incorporaciones por Aprobar'
        context['entity'] = 'Actualizar'
        context['frmStatusIng'] = IngresosForm()
        return context
