from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import JsonResponse
from django.urls import reverse_lazy
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import ListView, CreateView, UpdateView, DeleteView, FormView

from core.erp.forms import FormDepart
from core.erp.models import Departamento
from core.erp.mixins import ValidatePermissionRequiredMixin, Perms_Check

class DepartListView(LoginRequiredMixin, Perms_Check, ListView):   
    model = Departamento
    template_name = 'depart/list.html'
    permission_required = 'erp.view_departamento'

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            action = request.POST['action']
            if action == 'searchdata':
                data = []
                for i in Departamento.objects.all():
                    data.append(i.toJSON())
            
            elif action == 'add':
                perms = ('erp.add_departamento',)
                if request.user.has_perms(perms):
                    depart = Departamento()                    
                    depart.nombre = request.POST.get('nombre')
                    depart.save()                    
                else:
                    data['error'] = 'No tiene permisos para realizar esta acción'                
            
            elif action == 'edit':
                perms = ('erp.change_departamento',)
                if request.user.has_perms(perms):
                    depart = Departamento.objects.get(pk= request.POST['id'])                    
                    depart.nombre = request.POST.get('nombre')
                    depart.save()
                else:
                    data['error'] = 'No tiene permisos para realizar esta acción'

            elif action == 'delete':
                perms = ('erp.delete_departamento',)
                if request.user.has_perms(perms):
                    depart = Departamento.objects.get(pk = request.POST['id'])
                    depart.delete()
                else:
                    data['error'] = 'No tiene permisos para realizar esta acción'
            else:
                data['error'] = 'Ha ocurrido un error'
        except Exception as e:
            data['error'] = str(e)
        return JsonResponse(data, safe=False)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Listado de Departamentos'
        context['create_url'] = ''#reverse_lazy('erp:category_create')
        context['list_url'] = ''#reverse_lazy('erp:category_list')
        context['entity'] = 'Departamentos'
        context['btn_name'] = 'Nuevo Departamento'
        context['frmDepart'] = FormDepart()
        return context


# class DepartCreateView(LoginRequiredMixin, ValidatePermissionRequiredMixin, CreateView):
#     model = Departamento
#     form_class = FormDepart
#     permission_required = 'add_departamento'
#     success_url = reverse_lazy('erp:depart_list')

#     def dispatch(self, request, *args, **kwargs):
#         return super().dispatch(request, *args, **kwargs)

#     def post(self, request, *args, **kwargs):
#         data = {}
#         try:
#             action = request.POST['action']
#             if action == 'add':                
#                 form = self.get_form()
#                 data = form.save()            
#             else:
#                 data['error'] = 'No ha ingresado a ninguna opción'
#         except Exception as e:
#             data['error'] = str(e)
#         return JsonResponse(data, safe=False)

#     def get_context_data(self, **kwargs):
#         context = super().get_context_data(**kwargs)
#         context['title'] = 'Creación de un Departamento'
#         context['entity'] = 'Departamento'
#         context['list_url'] = self.success_url
#         context['action'] = 'add'
#         return context


# class DepartUpdateView(LoginRequiredMixin, ValidatePermissionRequiredMixin, UpdateView):
#     model = Departamento
#     form_class = FormDepart
#     permission_required = 'change_departamento'
#     success_url = reverse_lazy('erp:depart_list')

#     @method_decorator(csrf_exempt)
#     #@method_decorator(login_required)
#     def dispatch(self, request, *args, **kwargs):
#         self.object = self.get_object()
#         return super().dispatch(request, *args, **kwargs)

#     def post(self, request, *args, **kwargs):
#         data = {}
#         try:
#             action = request.POST['action']
#             if action == 'edit':
#                 form = self.get_form()
#                 data = form.save()
#             else:
#                 data['error'] = 'No ha ingresado a ninguna opción'
#         except Exception as e:
#             data['error'] = str(e)
#         return JsonResponse(data)

#     def get_context_data(self, **kwargs):
#         context = super().get_context_data(**kwargs)
#         context['title'] = 'Edición un Departamento'
#         context['entity'] = 'Departamento'
#         context['list_url'] = reverse_lazy('erp:depart_list')
#         context['action'] = 'edit'
#         return context


# class DepartDeleteView(LoginRequiredMixin, Perms_Check, DeleteView):
#     model = Departamento
#     form_class = FormDepart
#     template_name = 'depart/list.html'
#     permission_required = 'erp.delete_departamento'

#     @method_decorator(csrf_exempt)
#     def dispatch(self, request, *args, **kwargs):
#         self.object = self.get_object()
#         return super().dispatch(request, *args, **kwargs)

#     def post(self, request, *args, **kwargs):
#         data = {}
#         try:
#             action = request.POST['action']
#             if action == 'delete':
#                 perms = ('erp.delete_departamento',)
#                 if request.user.has_perms(perms):
#                     self.object.delete()
#             else:
#                 data['error'] = "No tienes permisos para realizar esta accion"
#         except Exception as e:
#             data['error'] = str(e)
#         return JsonResponse(data)

#     def get_context_data(self, **kwargs):
#         context = super().get_context_data(**kwargs)
#         context['title'] = 'Eliminación de un Departamento'
#         context['entity'] = 'Departamentos'
#         #context['list_url'] = reverse_lazy('erp:category_list')
#         return context