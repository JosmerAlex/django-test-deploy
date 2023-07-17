from core.erp.forms import FormSubGrupo
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.urls import reverse_lazy
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import ListView, CreateView, UpdateView, DeleteView, FormView
from django.contrib.auth.mixins import LoginRequiredMixin
from core.erp.mixins import ValidatePermissionRequiredMixin, Perms_Check
from core.erp.models import SubGrupoCtaBienes


class SubGrupoListView(LoginRequiredMixin, Perms_Check, ListView):   
    model = SubGrupoCtaBienes
    template_name = 'subgrupo/list.html'
    permission_required = 'erp.view_subgrupoctabienes'

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            action = request.POST['action']
            if action == 'searchdata':
                data = []
                for i in SubGrupoCtaBienes.objects.all():
                    data.append(i.toJSON())
            else:
                data['error'] = 'Ha ocurrido un error'
        except Exception as e:
            data['error'] = str(e)
        return JsonResponse(data, safe=False)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Listado de SubGrupos'
        context['create_url'] = ''#reverse_lazy('erp:category_create')
        context['list_url'] = ''#reverse_lazy('erp:category_list')
        context['entity'] = 'Listado'
        context['btn_name'] = 'Nuevo SubGrupo'
        context['frmSubGrupo'] = FormSubGrupo()
        return context

class SubGrupoCreateView(LoginRequiredMixin, CreateView):
    model = SubGrupoCtaBienes
    form_class = FormSubGrupo
    success_url = reverse_lazy('erp:subgrupo_list')
    permission_required = 'erp.add_subgrupoctabienes'

    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            action = request.POST['action']
            if action == 'add':
                perms = ('erp.add_subgrupoctabienes',)
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
        context['action'] = 'add'
        return context

class SubGrupoUpdateView(LoginRequiredMixin, UpdateView):
    model = SubGrupoCtaBienes
    form_class = FormSubGrupo
    success_url = reverse_lazy('erp:subgrupo_list')
    permission_required = 'erp.change_subgrupoctabienes'

    def dispatch(self, request, *args, **kwargs):
        self.object = self.get_object()
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            action = request.POST['action']
            if action == 'edit':
                perms = ('erp.change_subgrupoctabienes',)
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

class SubGrupoDeleteView(LoginRequiredMixin, DeleteView):
    model = SubGrupoCtaBienes
    permission_required = 'erp.delete_subgrupoctabienes'


    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        self.object = self.get_object()
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            perms = ('erp.delete_subgrupoctabienes',)
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
