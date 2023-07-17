import json
import os
from django.conf import settings
from django.db import transaction
from django.db.models import Q
from core.erp.forms import TrasladoProdForm
from core.reportes.forms import ReportForm
from core.erp.models import TrasladoProduc, DetTrasladoProd, Producto, Almacen, Unidad, Departamento, CodBienes, SalidaProduc, DetSalidaProd, ConcepMovimiento, InventarioBienes
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
from datetime import date, datetime
from core.erp.mixins import ValidatePermissionRequiredMixin

from configuracion.settings import MEDIA_URL, STATIC_URL


class AprobacionTrasListView(LoginRequiredMixin, ValidatePermissionRequiredMixin, FormView):
    model = TrasladoProduc
    form_class = ReportForm
    template_name = 'aprobaciones/traslados/list.html'
    permission_required = 'view_aprob'

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
                queryset = TrasladoProduc.objects.all()
                if len(start_date) and len(end_date):
                    queryset = queryset.filter(estado='DIS').filter(fecha_traslado__range=[start_date, end_date])
                for i in queryset:
                    item = {}
                    item['id'] = i.id
                    item['usuario'] = i.usuario.username
                    item['cod_traslado'] = i.cod_traslado
                    item['origen'] = i.origen.nombre
                    item['destino'] = i.destino.nombre
                    item['tipo_traslado'] = i.tipo_traslado.denominacion
                    item['fecha_traslado'] = i.fecha_traslado
                    item['estado'] = i.estado
                    data.append(item)

            elif action == 'search_detalle_prod':
                data = []
                for i in DetTrasladoProd.objects.filter(trasproduc_id=request.POST['id']):
                    item = {}
                    item['id'] = i.id
                    item['fecha_traslado'] = i.trasproduc.fecha_traslado
                    item['cod_traslado'] = i.trasproduc.cod_traslado
                    item['nombredepar'] = i.codubica.nombre
                    item['nombredepar_dest'] = i.ubica_destino.nombre
                    item['codbien'] = i.codbien.codbien
                    item['proddesc'] = i.prod.descripcion
                    item['prodnombre'] =  i.prod.nombre
                    data.append(item)
            
            elif action == 'edit':
                traslado = TrasladoProduc.objects.get(id=request.POST['param_id'])
                traslado.estado = request.POST['new_estado']
                traslado.save()

            else:
                data['error'] = 'Ha ocurrido un error'
        except Exception as e:
            data['error'] = str(e)
        return JsonResponse(data, safe=False)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Listado de Traslados por Aprobar'
        context['entity'] = 'Actualizar'
        context['frmStatusTras'] = TrasladoProdForm
        return context
