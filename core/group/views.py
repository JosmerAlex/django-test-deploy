from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, HttpResponseRedirect, HttpResponse
from django.urls import reverse_lazy
from django.shortcuts import render, redirect
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET
from django.views.generic import ListView, CreateView, UpdateView, DeleteView
from django.contrib.auth.mixins import LoginRequiredMixin
from core.erp.mixins import ValidatePermissionRequiredMixin, Perms_Check
from django.contrib.auth.models import Group, Permission, PermissionsMixin, ContentType

from django.template.loader import get_template
from core.group.forms import FormGroup


class GroupsListView(LoginRequiredMixin, Perms_Check, ListView):   
    model = Group
    template_name = 'groups/list.html'
    permission_required = 'auth.view_group'

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)
    
    def post(self, request, *args, **kwargs):
        data = {}
        try:
            action = request.POST['action']
            if action == 'searchdata':
                data = []                
                search =  Group.objects.all()
                ids_exclude = [1, 2, 4, 5, 29]
                for i in search:
                    item = {}
                    permisos = []                 
                    item['id'] = i.id
                    item['name'] = i.name
                    item['user'] = i.user_set.all().count()
                    item['permissions'] = [{'id': p.id, 'name': p.name, 'codename': p.codename} for p in i.permissions.exclude(content_type_id__in=ids_exclude)]
                    item['content_type'] = [{'id_content': c.id, 'model': c.name} for c in ContentType.objects.exclude(id__in=ids_exclude)]                    
                    data.append(item)

            elif action == 'search_perms':
                data = []                
                perms =  Group.objects.filter(id=request.POST['id'])
                #perms = Permission.objects.filter(group=grupo)                

            else:
                data['error'] = 'Ha ocurrido un error'
        except Exception as e:
            data['error'] = str(e)
        return JsonResponse(data, safe=False)
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Listado de Roles de Usuario'        
        context['create_url'] = reverse_lazy('group:group_create')
        context['list_url'] = reverse_lazy('group:group_list')      
        context['btn_name'] = 'Nuevo Registro'
        return context


class GroupsCreateView(LoginRequiredMixin, Perms_Check, CreateView):   
    model = Group
    form_class = FormGroup
    template_name = 'groups/create.html'
    success_url = reverse_lazy('group:group_list')
    permission_required = 'auth.add_group'

    
    def post(self, request, *args, **kwargs):
        form = FormGroup(request.POST)
        if form.is_valid():
            form.save()
            return HttpResponseRedirect(self.success_url)
        self.object = None
        context = self.get_context_data(**kwargs)
        context['form'] = form
        return render(request, self.template_name, context)
      

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Creación de un Rol de Usuario'       
        context['entity'] = 'Roles'        
        context['list_url'] = reverse_lazy('group:group_list')
        context['action'] = 'add'
        return context

class GroupsUpdateView(LoginRequiredMixin, Perms_Check, UpdateView):
    model = Group
    form_class = FormGroup
    template_name = 'groups/create.html'
    success_url = reverse_lazy('group:group_list')
    permission_required = 'auth.change_group'

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        self.object = self.get_object()
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        print(request.POST)
        form = self.get_form()
        data = form.save()       
          
        return HttpResponseRedirect(self.success_url)
        self.object = None
        context = self.get_context_data(**kwargs)
        context['form'] = form
        return render(request, self.template_name, context)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Edición de un Rol de usuario'
        context['entity'] = 'Roles'
        context['list_url'] = reverse_lazy('group:group_list')
        context['action'] = 'edit'
        return context


class GroupsDeleteView(LoginRequiredMixin, Perms_Check, DeleteView):
    model = Group
    template_name = 'groups/delete.html'
    success_url = reverse_lazy('group:group_list')
    permission_required = 'auth.delete_group'


    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Eliminación de un Rol de Usuario'
        context['entity'] = 'Roles'
        context['list_url'] = reverse_lazy('group:group_list')
        return context

