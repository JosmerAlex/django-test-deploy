from core.erp.forms import FormConcepMov
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.urls import reverse_lazy
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import ListView, CreateView, UpdateView, DeleteView, FormView
from django.contrib.auth.mixins import LoginRequiredMixin
from core.erp.mixins import ValidatePermissionRequiredMixin, Perms_Check
from core.erp.models import ConcepMovimiento


class ConcepMovListView(LoginRequiredMixin, Perms_Check, ListView):   
    model = ConcepMovimiento
    template_name = 'concepmov/list.html'
    permission_required = 'erp.view_concepmovimiento'

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            action = request.POST['action']
            if action == 'searchdata':
                data = []
                for i in ConcepMovimiento.objects.all():
                    data.append(i.toJSON())
            else:
                data['error'] = 'Ha ocurrido un error'
        except Exception as e:
            data['error'] = str(e)
        return JsonResponse(data, safe=False)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Listado de conceptos de movimientos'
        context['create_url'] = ''#reverse_lazy('erp:category_create')
        context['list_url'] = ''#reverse_lazy('erp:category_list')
        context['entity'] = 'Conceptos'
        context['btn_name'] = 'Nuevo Concepto'
        context['frmConcepMov'] = FormConcepMov()
        return context

class ConcepMovCreateView(LoginRequiredMixin, CreateView):
    model = ConcepMovimiento
    form_class = FormConcepMov
    success_url = reverse_lazy('erp:concepto_list')
    permission_required = 'erp.add_concepmovimiento'

    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            action = request.POST['action']
            if action == 'add':
                perms = ('erp.add_concepmovimiento',)
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
        context['title'] = 'Creación de un Almacen'
        context['entity'] = 'Codigos'
        context['list_url'] = self.success_url
        context['action'] = 'add'
        return context

class ConcepMovUpdateView(LoginRequiredMixin, UpdateView):
    model = ConcepMovimiento
    form_class = FormConcepMov
    template_name = 'concepmov/list.html'
    permission_required = 'erp.change_concepmovimiento'
    
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        self.object = self.get_object()
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            action = request.POST['action']
            if action == 'edit':
                perms = ('erp.change_concepmovimiento',)
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
        context['entity'] = 'Conceptos'
        context['list_url'] = reverse_lazy('erp:concepto_list')
        context['action'] = 'edit'
        return context

class ConcepMovDeleteView(LoginRequiredMixin, DeleteView):
    model = ConcepMovimiento
    form_class = FormConcepMov
    template_name = 'concepmov/list.html'
    #success_url = reverse_lazy('erp:category_list')
    permission_required = 'erp.delete_concepmovimiento'
    
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        self.object = self.get_object()
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            perms = ('erp.delete_concepmovimiento',)
            if request.user.has_perms(perms):
                self.object.delete()
            else:
                data['error'] = 'No tiene permisos para realizar esta acción'            
        except Exception as e:
            data['error'] = str(e)
        return JsonResponse(data)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        return context

