import json
import os
from django.conf import settings
from django.db import transaction
from django.db.models import Q
from core.erp.forms import DesincProdForm
from core.reportes.forms import ReportForm
from core.erp.models import DesincProduc, DetDesincProd
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

from core.erp.mixins import ValidatePermissionRequiredMixin, Perms_Check

from configuracion.settings import MEDIA_URL, STATIC_URL


class AprobacionDesincListView(LoginRequiredMixin, Perms_Check, FormView):
    model = DesincProduc
    form_class = ReportForm
    template_name = 'aprobaciones/desincorp/list.html'
    permission_required = 'auth_permission.view_aprob'

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
                    queryset = queryset.filter(estado='DIS').filter(fecha_desinc__range=[start_date, end_date])
                for i in queryset:
                    item = {}
                    item['id'] = i.id
                    item['usuario'] = i.usuario.username
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
                    item['proddesc'] = i.prod.descripcion
                    item['prodnombre'] = i.prod.nombre
                    item['precio'] = i.precio
                    item['subtotal'] = i.subtotal
                    data.append(item)

            elif action == 'edit':
                desinc = DesincProduc.objects.get(id=request.POST['param_id'])
                desinc.estado = request.POST['new_estado']
                desinc.save()
                data = {'id': desinc.id}

            else:
                data['error'] = 'Ha ocurrido un error'
        except Exception as e:
            data['error'] = str(e)
        return JsonResponse(data, safe=False)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Listado de Desincorporaciones por Aprobar'
        context['entity'] = 'Actualizar'
        context['frmStatusDes'] = DesincProdForm
        return context
