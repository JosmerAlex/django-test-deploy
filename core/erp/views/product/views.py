import json
from django.conf import settings
from django.db import transaction
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import JsonResponse, response
from django.urls import reverse_lazy
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import ListView, CreateView, UpdateView, DeleteView
#from django.views.generic import TemplateView

from core.erp.forms import FormProducto, FormMarca, FormCategoria, FormModelo
from core.erp.models import Producto, Categoria, Marca, Modelo, SubGrupoCtaBienes, GrupoCtaBienes, Almacen, Moneda
from django.template.loader import get_template
from core.erp.mixins import ValidatePermissionRequiredMixin, Perms_Check
from decimal import Decimal
from django.template import Context

class ProductListView(LoginRequiredMixin, Perms_Check, ListView):
    model = Producto
    template_name = 'product/list.html'
    permission_required = 'erp.view_producto'

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            action = request.POST['action']           
            if action == 'searchdata':
                data = []
                for i in Producto.objects.all():
                    data.append(i.toJSON())
                    print(i)

            elif action == 'activar':
                with transaction.atomic():
                    perms = ('user.change_producto',)
                    if request.user.has_perms(perms):
                        status = Producto.objects.get(id=request.POST['id'])
                        status.activo = True
                        status.save()
                    else:
                        data['error'] = 'No tiene permisos para realizar esta acción'        
            
            elif action == 'inactivar':
                with transaction.atomic():
                    perms = ('user.change_producto',)
                    if request.user.has_perms(perms):
                        status = Producto.objects.get(id=request.POST['id'])
                        status.activo = False
                        status.save()
                    else:
                        data['error'] = 'No tiene permisos para realizar esta acción'

            # elif action == 'extraerdatos':
            #     produc = Producto.objects.get(pk=request.POST['id'])
            #     data = produc.toJSON()
            else:
                data['error'] = 'Ha ocurrido un error'
        except Exception as e:
            data['error'] = str(e)
        return JsonResponse(data, safe=False)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Catálogo de Productos'
        context['create_url'] = reverse_lazy('erp:product_create')
        context['list_url'] = reverse_lazy('erp:product_list')
        context['btn_name'] = 'Nuevo Producto'
        context['entity'] = 'Catálogo'
        context['frmCateg'] = FormCategoria()
        context['frmMarca'] = FormMarca()
        context['frmModelos'] = FormModelo()
        return context

class ProductCreateView(LoginRequiredMixin, Perms_Check, CreateView):
    model = Producto
    form_class = FormProducto
    template_name = 'product/product_create.html'
    success_url = reverse_lazy('erp:product_list')
    permission_required = 'erp.add_producto'
    url_redirect = success_url

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        try:
           # print(request.POST)  # de esta forma estás viendo los datos que se envían en el formulario de HTML
            action = request.POST['action']
            if action == 'search_subgrupos_id':
                data = [{'id': '', 'text': '------------'}]
                for i in SubGrupoCtaBienes.objects.filter(grupo_id=request.POST['id']):
                    data.append({'id': i.id, 'text': i.cod_grusubgrusec + '  ' + i.denominacion})
            
            elif action == 'search_modelos_id':
                data = [{'id': '', 'text': '------------'}]
                for i in Modelo.objects.filter(marcas_id=request.POST['id']):
                    data.append({'id': i.id, 'text': i.modelo})

            
            elif action == 'add':                
                with transaction.atomic():
                    produc_catalago = json.loads(request.POST['produc_catalago'])
                    prod = Producto()
                    prod.codigo = produc_catalago['codigo']
                    prod.nombre = produc_catalago['nombre']
                    prod.descripcion = produc_catalago['descripcion']
                    prod.componentes = produc_catalago['componentes']
                    prod.unida_medida = produc_catalago['unida_medida']                    
                    prod.activo = produc_catalago['activo']
                    prod.tipo_item = produc_catalago['tipo_item']
                    prod.grupobien_id = produc_catalago['grupobien']
                    prod.subgrupobien_id = produc_catalago['subgrupobien']
                    prod.imagen = produc_catalago['imagen']                    
                    prod.categorias_id = produc_catalago['categorias']
                    prod.pagaimpuesto = produc_catalago['pagaimpuesto']
                    prod.lote = produc_catalago['lote']
                    prod.serie = produc_catalago['serie']
                    prod.inventariable = produc_catalago['inventariable']
                    prod.marca_id = produc_catalago['marca']
                    prod.modelo_id = produc_catalago['modelo']
                    prod.moneda_id = produc_catalago['moneda']
                    prod.usuario = self.request.user
                    prod.save()
            
            
            # elif action == 'add':                
            #     form = self.get_form()
            #     data = form.save()

            elif action == 'create_Categoria':
                frmCateg =  FormCategoria(request.POST)
                data = frmCateg.save()

            elif action == 'create_Marca':

                frmMarca =  FormMarca(request.POST)
                data = frmMarca.save()

            elif action == 'create_Modelo':

                frmModelos =  FormModelo(request.POST)
                data = frmModelos.save()
            else:
               data['error'] = 'No ha ingresado a ninguna opción'
        except Exception as e:
            data['error'] = str(e)
        return JsonResponse(data, safe=False)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['entity'] = 'Productos'
        context['list_url'] = self.success_url
        context['action'] = 'add'
        context['title'] = 'Creación de un Producto'
        context['frmCateg'] = FormCategoria()
        context['frmMarca'] = FormMarca()
        context['frmModelos'] = FormModelo()    
        return context

class ProductUpdateView(LoginRequiredMixin, Perms_Check, UpdateView):
    model = Producto
    form_class = FormProducto
    template_name = 'product/product_create.html'
    success_url = reverse_lazy('erp:product_list')
    permission_required = 'erp.change_producto'
    url_redirect = success_url

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        self.object = self.get_object()
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            action = request.POST['action']
            if action == 'search_subgrupos_id':
                data = [{'id': '', 'text': '------------'}]
                for i in SubGrupoCtaBienes.objects.filter(grupo_id=request.POST['id']):
                    data.append({'id': i.id, 'text': i.cod_grusubgrusec + '  ' + i.denominacion})
            
            elif action == 'search_modelos_id':
                data = [{'id': '', 'text': '------------'}]
                for i in Modelo.objects.filter(marcas_id=request.POST['id']):
                    data.append({'id': i.id, 'text': i.modelo})
                    
            elif action == 'edit':
                with transaction.atomic():
                    produc_catalago = json.loads(request.POST['produc_catalago'])
                    prod = self.get_object()
                    prod.codigo = produc_catalago['codigo']
                    prod.nombre = produc_catalago['nombre']
                    prod.descripcion = produc_catalago['descripcion']
                    prod.componentes = produc_catalago['componentes']
                    prod.unida_medida = produc_catalago['unida_medida']
                    prod.tipo_item = produc_catalago['tipo_item']
                    prod.activo = produc_catalago['activo']
                    prod.grupobien_id = produc_catalago['grupobien']
                    prod.subgrupobien_id = produc_catalago['subgrupobien']
                    prod.imagen = produc_catalago['imagen']
                    prod.categorias_id = produc_catalago['categorias']
                    prod.pagaimpuesto = produc_catalago['pagaimpuesto']
                    prod.lote = produc_catalago['lote']
                    prod.serie = produc_catalago['serie']
                    prod.inventariable = produc_catalago['inventariable']
                    prod.marca_id = produc_catalago['marca']
                    prod.moneda_id = produc_catalago['moneda']
                    prod.modelo_id = produc_catalago['modelo']
                    prod.usuario = self.request.user
                    prod.save()
            else:
                data['error'] = 'No ha ingresado a ninguna opción'
        except Exception as e:
            data['error'] = str(e)
        return JsonResponse(data, safe=False)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Edición de un Producto'
        context['entity'] = 'Productos'
        context['list_url'] = self.success_url
        context['action'] = 'edit'
        context['frmCateg'] = FormCategoria()
        context['frmMarca'] = FormMarca()
        context['frmModelos'] = FormModelo()
        return context


class ProductDeleteView(LoginRequiredMixin, DeleteView):
    model = Producto
    permission_required = 'erp.delete_producto'

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        self.object = self.get_object()
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            perms = ('erp.delete_producto',)
            if request.user.has_perms(perms):
                self.object.delete()
            else:
                data['error'] = 'No tiene permisos para realizar esta acción'
            
        except Exception as e:
            data['error'] = str(e)
        return JsonResponse(data)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Eliminación de un Producto'
        context['entity'] = 'Productos'
       # context['list_url'] = self.success_url
        return context

