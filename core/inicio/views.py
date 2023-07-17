from datetime import datetime

from django.db.models import Sum
from django.db.models.functions import Coalesce
from django.http import JsonResponse
from django.shortcuts import render
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import TemplateView
from core.erp.models import *
from core.user.models import *
from django.views.generic import TemplateView

class IndexView(LoginRequiredMixin, TemplateView):
    template_name = 'index.html'

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)        

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            action = request.POST['action']
            if action == 'get_graph_incorp_year_month':
                data  = {
                    'name': 'Nº de Items Incorporados',
                    'showInLegend': False,
                    'colorByPoint': True,
                    'data': self.get_graph_incorp_year_month()
                }
            else:
                data['error'] = 'Ha ocurrido un error'
        except Exception as e:
            data['error'] = str(e)
        return JsonResponse(data, safe=False)
    
    def get_graph_incorp_year_month(self):
        data = []
        try:
            year = datetime.now().year
            for m in range(1, 13):
                for p in Producto.objects.all():    
                    incorp = DetIngresoProduc.objects.filter(ingresoPro__estado="APR", ingresoPro__fecha_ingreso__year=year, ingresoPro__fecha_ingreso__month=m).aggregate(
                        r=Coalesce(Sum('cant'), 0)).get('r')
                
                data.append(incorp)
        except:
            pass
        return data
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['dist'] = SalidaProduc.objects.filter(estado='DIS')
        context['incorp'] = IngresoProduc.objects.filter(estado='DIS')
        context['tras'] = TrasladoProduc.objects.filter(estado='DIS')
        context['desinc'] = DesincProduc.objects.filter(estado='DIS')
        context['users'] = User.objects.filter(is_active=1)
        context['products'] = Producto.objects.filter(activo=1)
        context['year'] = datetime.now().year
        context['graph_incorp_year_month'] = self.get_graph_incorp_year_month()
        context['title'] = 'Dashboard'
        context['entity'] = 'Dashboard'
        return context

def page_not_found404(request, exception):
    return render(request, '404.html')