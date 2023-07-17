import json
import os
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.forms import PasswordChangeForm
from django.contrib.auth.mixins import LoginRequiredMixin
from django.db import transaction
from django.contrib.auth.models import Group, Permission
from django.http import JsonResponse, HttpResponseRedirect
from django.urls import reverse_lazy
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import ListView, CreateView, UpdateView, DeleteView, View, FormView

from core.erp.mixins import ValidatePermissionRequiredMixin, Perms_Check
from core.user.forms import *
from core.user.models import User
from core.security.models import AccessUsers


class UserListView(LoginRequiredMixin, Perms_Check, ListView):   
    model = User
    template_name = 'user/list.html'
    permission_required = 'user.view_user'

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            action = request.POST['action']
            if action == 'searchdata':
                data = []
                for i in User.objects.all():
                    data.append(i.toJSON())

            elif action == 'search_access':
                data = []
                for i in AccessUsers.objects.filter(user_id=request.POST['id']):
                    data.append(i.toJSON())

            elif action == 'search_detail':
                data = []
                usuario = User.objects.all()
                position = 1
                for i in usuario.filter(id=request.POST['id']):
                    user_permissions = i.get_user_permissions()
                    group_permissions = i.get_group_permissions()
                    all_permissions = user_permissions.union(group_permissions)
                    for p in all_permissions:
                        item = {}
                        perm_object = Permission.objects.get(codename=p.split('.')[-1])
                        item['id'] = position
                        item['name'] = perm_object.name
                        data.append(item)
                        position += 1

            elif action == 'activar':
                with transaction.atomic():
                    perms = ('user.change_user',)
                    if request.user.has_perms(perms):
                        status = User.objects.get(id=request.POST['id'])
                        status.is_active = True
                        status.save()
                    else:
                        data['error'] = 'No tiene permisos para realizar esta acción'

            elif action == 'inactivar':
                with transaction.atomic():
                    perms = ('user.change_user',)
                    if request.user.has_perms(perms):
                        status = User.objects.get(id=request.POST['id'])
                        status.is_active = False
                        status.save()                              
                    else:
                        data['error'] = 'No tiene permisos para realizar esta acción'
            else:
                data['error'] = 'Ha ocurrido un error'
        except Exception as e:
            data['error'] = str(e)
        return JsonResponse(data, safe=False)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Listado de Usuarios'
        context['create_url'] = reverse_lazy('user:user_create')
        context['list_url'] = reverse_lazy('user:user_list')
        context['btn_name'] = 'Nuevo Usuario'
        context['form'] = UserForm()
        return context

class UserCreateView(LoginRequiredMixin, Perms_Check, CreateView):
    model = User
    form_class = UserForm
    template_name = 'user/create_user.html'
    success_url = reverse_lazy('user:user_list')
    permission_required = 'user.add_user'
    url_redirect = success_url

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            action = request.POST['action']
            if action == 'search_perms':               
                data = []
                ids_exclude = ['logentry', 'contenttype', 'session', 'dettrasladoprod', 'detsalidainsumos', 'detingresoproduc', 'detdesincprod', 'detdesincalmacen']
                for i in Permission.objects.exclude(content_type__model__in=ids_exclude):
                    item = {}
                    item['id'] = i.id
                    item['perms'] = i.name
                    data.append(item)

            elif action == 'add':
                with transaction.atomic():
                    users = json.loads(request.POST['data'])
                    user = User()
                    user.first_name = users['first_name']
                    user.last_name = users['last_name']
                    user.dni = users['dni']
                    user.email = users['email']
                    user.image = users['image']
                    user.username = users['username']                    
                    user.set_password(users['password'])                    
                    user.is_active = users['is_active']                                    
                    user.save()
                    
                    user.groups.clear()
                    for g in users['groups']:
                        user.groups.add(g)
                    
                    user.user_permissions.clear()
                    for p in users['user_permissions']:
                        user.user_permissions.add(p)                    
                    
            else:
                data['error'] = 'No ha ingresado a ninguna opción'
        except Exception as e:
            data['error'] = str(e)
        return JsonResponse(data, safe=False)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Creación de un Usuario'
        context['entity'] = 'Usuarios'
        context['list_url'] = self.success_url
        context['action'] = 'add'      
        return context

class UserUpdateView(LoginRequiredMixin, Perms_Check, UpdateView):
    model = User
    form_class = UserForm
    template_name = 'user/create_user.html'
    success_url = reverse_lazy('user:user_list')
    permission_required = 'user.change_user'
    url_redirect = success_url

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        self.object = self.get_object()        
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            action = request.POST['action']
            if action == 'search_perms':               
                data = []
                ids_exclude = ['logentry', 'contenttype', 'session', 'dettrasladoprod', 'detsalidainsumos', 'detingresoproduc', 'detdesincprod', 'detdesincalmacen']
                for i in Permission.objects.exclude(content_type__model__in=ids_exclude):
                    item = {}
                    item['id'] = i.id
                    item['perms'] = i.name
                    data.append(item)

            elif action == 'edit':
                with transaction.atomic():
                    users = json.loads(request.POST['data'])
                    user = self.get_object()
                    user.first_name = users['first_name']
                    user.last_name = users['last_name']
                    user.dni = users['dni']
                    user.email = users['email']
                    user.image = users['image']
                    user.username = users['username']                    
                    user.is_active = users['is_active']  
                    password = users['password']   
                    if self.get_object().password != password:
                        user.set_password(password)  
                    else:
                        user.password = self.get_object().password                                    
                    
                    user.save()
                    print(password)
                    
                    user.groups.clear()
                    for g in users['groups']:
                        user.groups.add(g)
                    
                    user.user_permissions.clear()
                    for p in users['user_permissions']:
                        user.user_permissions.add(p)      
            else:
                data['error'] = 'No ha ingresado a ninguna opción'
        except Exception as e:
            data['error'] = str(e)
        return JsonResponse(data, safe=False)
    
    def get_perms_user(self):
        data = []
        try:            
            for i in User.objects.filter(id=self.get_object().id):                
                for p in i.user_permissions.all():
                    data.append(p.id)
        except:
            pass
        return data
    

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Edición de un Usuario'
        context['entity'] = 'Usuarios'
        context['list_url'] = self.success_url
        context['perms'] = json.dumps(self.get_perms_user())
        context['action'] = 'edit'
        context['id'] = self.object.id
        return context

class UserDeleteView(LoginRequiredMixin, DeleteView):
    model = User
    form_class = UserForm
    template_name = 'user/list.html' 
    permission_required = 'user.delete_user'   
    
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        self.object = self.get_object()
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            perms = ('user.delete_user',)
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

class UserProfileView(LoginRequiredMixin, UpdateView):
    model = User
    form_class = UserProfileForm
    template_name = 'user/profile2.html'
    success_url = reverse_lazy('index_app:Index')

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        self.object = self.get_object()
        return super().dispatch(request, *args, **kwargs)

    def get_object(self, queryset=None):
        return self.request.user

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            action = request.POST['action']
            if action == 'edit':
                form = self.get_form()
                data = form.save()
            else:
                data['error'] = 'No ha ingresado a ninguna opción'
        except Exception as e:
            data['error'] = str(e)
        return JsonResponse(data)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Edición de Perfil'
        context['entity'] = 'Perfil'
        context['list_url'] = self.success_url
        context['action'] = 'edit'
        return context

class UserChangePasswordView(LoginRequiredMixin, FormView):
    model = User
    form_class = PasswordChangeForm
    template_name = 'user/change_password.html'
    success_url = reverse_lazy('usuarios_app:login')

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get_form(self, form_class=None):
        form = PasswordChangeForm(user=self.request.user)
        form.fields['old_password'].widget.attrs['placeholder'] = 'Ingrese su contraseña actual'
        form.fields['new_password1'].widget.attrs['placeholder'] = 'Ingrese su nueva contraseña'
        form.fields['new_password2'].widget.attrs['placeholder'] = 'Repita su contraseña'
        return form

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            action = request.POST['action']
            if action == 'edit':
                form = PasswordChangeForm(user=request.user, data=request.POST)
                if form.is_valid():
                    form.save()
                    update_session_auth_hash(request, form.user)
                else:
                    data['error'] = form.errors
            else:
                data['error'] = 'No ha ingresado a ninguna opción'
        except Exception as e:
            data['error'] = str(e)
        return JsonResponse(data)
        

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Edición de Password'
        context['entity'] = 'Password'
        context['list_url'] = self.success_url
        context['action'] = 'edit'
        return context
