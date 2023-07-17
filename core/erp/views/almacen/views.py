from core.erp.forms import FormAlmacen
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.urls import reverse_lazy
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import ListView, CreateView, UpdateView, DeleteView, FormView
from django.contrib.auth.mixins import LoginRequiredMixin
from core.erp.mixins import ValidatePermissionRequiredMixin, Perms_Check
from core.erp.models import Almacen


class AlmacenListView(LoginRequiredMixin, Perms_Check, ListView):   
    model = Almacen
    template_name = 'almacen/list.html'
    permission_required = 'erp.view_almacen'

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            action = request.POST['action']
            if action == 'searchdata':
                data = []
                for i in Almacen.objects.all():
                    data.append(i.toJSON())
            else:
                data['error'] = 'Ha ocurrido un error'
        except Exception as e:
            data['error'] = str(e)
        return JsonResponse(data, safe=False)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Listado de Almacen'
        context['create_url'] = ''#reverse_lazy('erp:category_create')
        context['list_url'] = ''#reverse_lazy('erp:category_list')
        context['entity'] = 'Almacen'
        context['btn_name'] = 'Nuevo Almacen'
        context['frmAlmacen'] = FormAlmacen()
        return context


class AlmacenCreateView(LoginRequiredMixin, CreateView):
    model = Almacen
    form_class = FormAlmacen
    success_url = reverse_lazy('erp:Almacen_list')
    permission_required = 'erp.add_almacen'

    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            action = request.POST['action']
            if action == 'add':
                perms = ('erp.add_almacen',)
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
        context['title'] = 'Creación una Almacen'
        context['entity'] = 'Almacen'
        context['list_url'] = self.success_url
        context['action'] = 'add'
        return context


class AlmacenUpdateView(LoginRequiredMixin, UpdateView):
    model = Almacen
    form_class = FormAlmacen
    template_name = 'almacen/list.html'
    permission_required = 'erp.change_almacen'   

    @method_decorator(csrf_exempt)
    #@method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        self.object = self.get_object()
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            action = request.POST['action']
            if action == 'edit':
                perms = ('erp.change_almacen',)
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
        context['entity'] = 'Almacen'
        context['list_url'] = reverse_lazy('erp:almacen_list')
        context['action'] = 'edit'
        return context


class AlmacenDeleteView(LoginRequiredMixin, DeleteView):
    model = Almacen
    form_class = FormAlmacen
    template_name = 'Almacen/list.html'
    permission_required = 'erp.delete_almacen'

    @method_decorator(login_required)
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        self.object = self.get_object()
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            perms = ('erp.delete_almacen',)
            if request.user.has_perms(perms):
                self.object.delete()
            else:
                data['error'] = 'No tiene permisos para realizar esta acción'
        except Exception as e:
            data['error'] = str(e)
        return JsonResponse(data)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        #context['list_url'] = reverse_lazy('erp:category_list')
        return context
