from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import JsonResponse
from django.shortcuts import render
from django.urls import reverse_lazy
from django.views.generic import ListView, CreateView, UpdateView, DeleteView
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from core.erp.forms import FormMoneda
from core.erp.mixins import ValidatePermissionRequiredMixin, Perms_Check
from core.erp.models import Moneda

class MonedaListView(LoginRequiredMixin, Perms_Check, ListView):
    model = Moneda
    template_name = 'monedas/list.html'
    permission_required = 'erp.view_moneda'

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            action = request.POST['action']           
            if action == 'searchdata':
                data = []
                for i in Moneda.objects.all():
                    data.append(i.toJSON())

            # elif action == 'activar':
            #     with transaction.atomic():
            #         perms = ('user.change_producto',)
            #         if request.user.has_perms(perms):
            #             status = Producto.objects.get(id=request.POST['id'])
            #             status.activo = True
            #             status.save()
            #         else:
            #             data['error'] = 'No tiene permisos para realizar esta acción'        
            
            # elif action == 'inactivar':
            #     with transaction.atomic():
            #         perms = ('user.change_producto',)
            #         if request.user.has_perms(perms):
            #             status = Producto.objects.get(id=request.POST['id'])
            #             status.activo = False
            #             status.save()
            #         else:
            #             data['error'] = 'No tiene permisos para realizar esta acción'

            else:
                data['error'] = 'Ha ocurrido un error'
        except Exception as e:
            data['error'] = str(e)
        return JsonResponse(data, safe=False)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Listado de Monedas'
        # context['create_url'] = reverse_lazy('erp:monedas_create')
        # context['list_url'] = reverse_lazy('erp:monedas_list')
        context['btn_name'] = 'Nuevo Registro'
        context['frmMoneda'] = FormMoneda()
        context['entity'] = 'Monedas'
        return context

class MonedaCreateView(LoginRequiredMixin, CreateView):
    model = Moneda
    success_url = reverse_lazy('erp:monedas_list')
    form_class = FormMoneda
    permission_required = 'erp.add_moneda'

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        try:           
            action = request.POST['action']
            if action == 'add':
                perms = ('erp.add_moneda',)
                if request.user.has_perms(perms):
                    form = self.get_form()
                    data = form.save()
                else:
                    data['error'] = 'No tiene permisos para realizar esta acción'
            else:
               data['error'] = 'No ha ingresado a ninguna opción'
        except Exception as e:
            data['error'] = str(e)
        return JsonResponse(data, safe=False)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['action'] = 'add'
        return context


class MonedaUpdateView(LoginRequiredMixin, UpdateView):
    model = Moneda    
    form_class = FormMoneda
    success_url = reverse_lazy('erp:monedas_list')
    permission_required = 'erp.change_moneda'

    def dispatch(self, request, *args, **kwargs):
        self.object = self.get_object()
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        try:           
            action = request.POST['action']
            if action == 'edit':
                perms = ('erp.change_moneda',)
                if request.user.has_perms(perms):
                    form = self.get_form()
                    data = form.save()
                else:
                    data['error'] = 'No tiene permisos para realizar esta acción'
            else:
               data['error'] = 'No ha ingresado a ninguna opción'
        except Exception as e:
            data['error'] = str(e)
        return JsonResponse(data, safe=False)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['list_url'] = self.success_url
        context['action'] = 'edit'
        return context