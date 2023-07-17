from core.erp.forms import FormCodbien
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.urls import reverse_lazy
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import ListView, CreateView, UpdateView, DeleteView, FormView
from django.contrib.auth.mixins import LoginRequiredMixin
from core.erp.mixins import ValidatePermissionRequiredMixin, Perms_Check
from core.erp.models import CodBienes


class CodBienListView(LoginRequiredMixin, Perms_Check, ListView):   
    model = CodBienes
    template_name = 'codbienes/list.html'
    permission_required = 'erp.view_codbienes'

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            action = request.POST['action']
            if action == 'searchdata':
                data = []
                for i in CodBienes.objects.all():
                    data.append(i.toJSON())
            else:
                data['error'] = 'Ha ocurrido un error'
        except Exception as e:
            data['error'] = str(e)
        return JsonResponse(data, safe=False)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Listado de Codigos de Bien Nacional'
        context['create_url'] = ''#reverse_lazy('erp:category_create')
        context['list_url'] = ''#reverse_lazy('erp:category_list')
        context['entity'] = 'Codigos'
        context['btn_name'] = 'Nuevo Codigo'
        context['frmCodBien'] = FormCodbien()
        return context


class CodBienCreateView(LoginRequiredMixin, CreateView):
    model = CodBienes
    form_class = FormCodbien
    permission_required = 'erp.add_codbienes'

    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            action = request.POST['action']
            if action == 'add':
                perms = ('erp.add_codbienes',)
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


class CodBienUpdateView(LoginRequiredMixin, UpdateView):
    model = CodBienes
    form_class = FormCodbien
    template_name = 'codbienes/list.html'
    permission_required = 'erp.change_codbienes'

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
                perms = ('erp.change_codbienes',)
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
        context['list_url'] = reverse_lazy('erp:codbien_list')
        context['action'] = 'edit'
        return context


class CodBienDeleteView(LoginRequiredMixin, DeleteView):
    model = CodBienes
    permission_required = 'delete_codbienes'

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        self.object = self.get_object()
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            perms = ('erp.delete_codbienes',)
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
