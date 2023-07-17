from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import JsonResponse, response
from django.urls import reverse_lazy
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import ListView, CreateView, UpdateView, DeleteView
from core.erp.models import Unidad
from core.erp.mixins import ValidatePermissionRequiredMixin, Perms_Check

from core.erp.forms import UnidadForm

class UnidadListView(LoginRequiredMixin, Perms_Check, ListView):
    model = Unidad
    template_name = 'unidad/list.html'
    permission_required = 'erp.view_unidad'

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            action = request.POST['action']
            if action == 'searchdata':
                data = []
                for i in Unidad.objects.all():
                    data.append(i.toJSON())

            elif action == 'extraerdatos':
                unidad = Unidad.objects.get(pk=request.POST['id'])
                data = unidad.toJSON()
            else:
                data['error'] = 'Ha ocurrido un error'
        except Exception as e:
            data['error'] = str(e)
        return JsonResponse(data, safe=False)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Listado de Unidades'
        context['create_url'] = ''#reverse_lazy('erp:unidad_create')
        context['list_url'] = reverse_lazy('erp:unidad_list')
        context['btn_name'] = 'Nueva unidad'
        context['entity'] = 'Unidades'
        context['frmUnidad'] = UnidadForm()
       
        return context

class UnidadCreateView(LoginRequiredMixin, CreateView):
    model = Unidad
    form_class = UnidadForm
    permission_required = 'erp.add_unidad'

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        try:
           # print(request.POST)  # de esta forma estás viendo los datos que se envían en el formulario de HTML
            action = request.POST['action']

            if action == 'add':
                perms = ('erp.add_unidad',)
                if request.user.has_perms(perms):
                    form = self.get_form()
                    data = form.save()
                else:
                    data['error'] = 'No tiene permisos para realizar esta acción'
            elif action == 'create_Unidad':
                frmunidad =  UnidadForm(request.POST)
                data = frmunidad.save()
            else:
               data['error'] = 'No ha ingresado a ninguna opción'
        except Exception as e:
            data['error'] = str(e)
        return JsonResponse(data, safe=False)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['action'] = 'add'
        return context

class UnidadUpdateView(LoginRequiredMixin, UpdateView):
    model = Unidad
    form_class = UnidadForm
    template_name = 'unidad/list.html'
    permission_required = 'erp.change_unidad'
    #url_redirect = success_url

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        self.object = self.get_object()
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            action = request.POST['action']
            if action == 'edit':
                perms = ('erp.change_unidad',)
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
        context['action'] = 'edit'
        context['frmUnidad'] = UnidadForm()
        return context


class UnidadDeleteView(LoginRequiredMixin, DeleteView):
    model = Unidad
    form_class = UnidadForm
    template_name = 'unidad/list.html'
    permission_required = 'erp.delete_unidad'

    @method_decorator(login_required)
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        self.object = self.get_object()
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            perms = ('erp.delete_unidad',)
            if request.user.has_perms(perms):
                self.object.delete()
            else:
                data['error'] = 'No tiene permisos para realizar esta acción'
        except Exception as e:
            data['error'] = str(e)
        return JsonResponse(data)

