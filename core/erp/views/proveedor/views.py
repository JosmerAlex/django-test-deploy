from core.erp.forms import ProveedorForm
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.urls import reverse_lazy
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import ListView, CreateView, UpdateView, DeleteView, FormView
from django.contrib.auth.mixins import LoginRequiredMixin
from core.erp.mixins import ValidatePermissionRequiredMixin, Perms_Check
from core.erp.models import Proveedor


class ProveedorListView(LoginRequiredMixin, Perms_Check, ListView):   
    model = Proveedor
    template_name = 'proveedor/list.html'
    permission_required = 'erp.view_proveedor'

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            action = request.POST['action']
            if action == 'searchdata':
                data = []
                for i in Proveedor.objects.all():
                    data.append(i.toJSON())
            else:
                data['error'] = 'Ha ocurrido un error'
        except Exception as e:
            data['error'] = str(e)
        return JsonResponse(data, safe=False)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Listado de Proveedores'
        context['create_url'] = ''#reverse_lazy('erp:category_create')
        context['list_url'] = ''#reverse_lazy('erp:category_list')
        context['entity'] = 'Proveedores'
        context['btn_name'] = 'Nuevo Proveedor'
        context['frmProvee'] = ProveedorForm()
        return context


class ProveedorCreateView(LoginRequiredMixin, CreateView):
    model = Proveedor
    form_class = ProveedorForm
    permission_required = 'erp.add_proveedor'

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        try:           
            action = request.POST['action']
            if action == 'add':
                perms = ('erp.add_proveedor',)
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
        context['entity'] = 'Proveedor'
        context['action'] = 'add'
        return context

class ProveedorUpdateView(LoginRequiredMixin, UpdateView):
    model = Proveedor
    form_class = ProveedorForm
    template_name = 'proveedor/list.html'
    permission_required = 'erp.change_proveedor'

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        self.object = self.get_object()
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            action = request.POST['action']
            if action == 'edit':
                perms = ('erp.change_proveedor',)
                if request.user.has_perms(perms):
                    form = self.get_form()
                    data = form.save()
                else:
                    data['error'] = 'No tiene permisos para realizar esta acción'                
            else:
               data['error'] = 'No ha ingresado a ninguna opción'
        except Exception as e:
            data['error'] = str(e)
        return JsonResponse(data)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['entity'] = 'Proveedor'
        context['action'] = 'edit'
        context['frmProvee'] = ProveedorForm()
        return context


class ProveedorDeleteView(LoginRequiredMixin, DeleteView):
    model = Proveedor
    form_class = ProveedorForm
    template_name = 'proveedor/list.html'
    permission_required = 'erp.delete_proveedor'

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        self.object = self.get_object()
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            perms = ('erp.delete_proveedor',)
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