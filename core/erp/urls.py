from django.urls import path
from core.erp.views.category.views import *
from core.erp.views.marca.views import *
from core.erp.views.modelo.views import *
from core.erp.views.dashboard.views import *
from core.erp.views.product.views import *
from core.erp.views.control_stock.views import *
from core.erp.views.ingresos_prod.views import *
from core.erp.views.salidas_prod.salidas.views import *
from core.erp.views.unidad.views import *
from core.erp.views.depart.views import *
from core.erp.views.almacen.views import *
from core.erp.views.grupo.views import *
from core.erp.views.subgrupo.views import *
from core.erp.views.traslados_prod.views import *
from core.erp.views.codbienes.views import *
from core.erp.views.desincorp.views import *
from core.erp.views.desincorp.desinc.views import *
from core.erp.views.concepmov.views import *
from core.erp.views.proveedor.views import *
from core.erp.views.empresa.views import *
from core.erp.views.aprobaciones.salidas.views import *
from core.erp.views.aprobaciones.traslados.views import *
from core.erp.views.aprobaciones.desincorp.views import *
from core.erp.views.aprobaciones.desincorp.desinc_almacen.views import *
from core.erp.views.aprobaciones.ingreso.views import *
from core.erp.views.respaldo_bd.views import *
from core.erp.views.servicio_tecnico.views import *
from core.erp.views.monedas.views import *



app_name = 'erp'

urlpatterns = [
     #path('', login_required(ProductoList.as_view()), name='producto_listar'),
     
    # product
    path('product/list/', ProductListView.as_view(), name='product_list'),
    path('product/add/', ProductCreateView.as_view(), name='product_create'),
    path('product/update/<int:pk>/', ProductUpdateView.as_view(), name='product_update'),
    path('product/delete/<int:pk>/', ProductDeleteView.as_view(), name='product_delete'),
    #path('product/ingre/', ProductListView.as_view(), name='product_list'),

    path('stock/list/', StockListView.as_view(), name='stock_list'),
    # path('product/add/', ProductCreateView.as_view(), name='product_create'),
    # path('product/update/<int:pk>/', ProductUpdateView.as_view(), name='product_update'),
    
    # category
    path('category/list/', CategoryListView.as_view(), name='category_list'),
    path('category/add/', CategoryCreateView.as_view(), name='category_create'),
    path('category/update/<int:pk>/', CategoryUpdateView.as_view(), name='category_update'),
    path('category/delete/<int:pk>/', CategoryDeleteView.as_view(), name='category_delete'),

     # marca
    path('marca/list/', MarcaListView.as_view(), name='marca_list'),
    path('marca/add/', MarcaCreateView.as_view(), name='marca_create'),
    path('marca/update/<int:pk>/', MarcaUpdateView.as_view(), name='marca_update'),
    path('marca/delete/<int:pk>/', MarcaDeleteView.as_view(), name='marca_delete'),

    # modelo
    path('modelo/list/', ModeloListView.as_view(), name='modelo_list'),
    path('modelo/add/', ModeloCreateView.as_view(), name='modelo_create'),
    path('modelo/update/<int:pk>/', ModeloUpdateView.as_view(), name='modelo_update'),
    path('modelo/delete/<int:pk>/', ModeloDeleteView.as_view(), name='modelo_delete'),

    # almacen
    path('almacen/list/', AlmacenListView.as_view(), name='almacen_list'),
    path('almacen/add/', AlmacenCreateView.as_view(), name='almacen_create'),
    path('almacen/update/<int:pk>/', AlmacenUpdateView.as_view(), name='almacen_update'),
    path('almacen/delete/<int:pk>/', AlmacenDeleteView.as_view(), name='almacen_delete'),

    # grupo
    path('grupo/list/', GrupoListView.as_view(), name='grupo_list'),
    path('grupo/add/', GrupoCreateView.as_view(), name='grupo_create'),
    path('grupo/update/<int:pk>/', GrupoUpdateView.as_view(), name='grupo_update'),
    path('grupo/delete/<int:pk>/', GrupoDeleteView.as_view(), name='grupo_delete'),

    # subgrupo
    path('subgrupo/list/', SubGrupoListView.as_view(), name='subgrupo_list'),
    path('subgrupo/add/', SubGrupoCreateView.as_view(), name='subgrupo_create'),
    path('subgrupo/update/<int:pk>/', SubGrupoUpdateView.as_view(), name='subgrupo_update'),
    path('subgrupo/delete/<int:pk>/', SubGrupoDeleteView.as_view(), name='subgrupo_delete'),

    # codigo de bienes
    path('codbien/list/', CodBienListView.as_view(), name='codbien_list'),
    path('codbien/add/', CodBienCreateView.as_view(), name='codbien_create'),
    path('codbien/update/<int:pk>/', CodBienUpdateView.as_view(), name='codbien_update'),
    path('codbien/delete/<int:pk>/', CodBienDeleteView.as_view(), name='codbien_delete'),

    # salidas de productos
    path('salida/list/', SalidaListView.as_view(), name='salida_list'),
    path('salida/add/', SalidaCreateView.as_view(), name='salida_create'),
    path('salida/delete/<int:pk>/', SalidaDeleteView.as_view(), name='salida_delete'),
    path('salida/update/<int:pk>/', SalidaUpdateView.as_view(), name='salida_update'),
    path('salida/factura/pdf/<int:pk>/', SalidaFacturaPdfView.as_view(), name='salida_factura_pdf'),

    # ingresos de productos
    path('ingreso/list/', IngresoListView.as_view(), name='ingreso_list'),
    path('ingreso/add/', IngresoCreateView.as_view(), name='ingreso_create'),
    path('ingreso/delete/<int:pk>/', IngresoDeleteView.as_view(), name='ingreso_delete'),
    path('ingreso/update/<int:pk>/', IngresoUpdateView.as_view(), name='ingreso_update'),
    path('ingreso/factura/pdf/<int:pk>/', IngresoFacturaPdfView.as_view(), name='ingreso_factura_pdf'),

    # traslados de productos
    path('traslado/list/', TrasladoListView.as_view(), name='traslado_list'),
    path('traslado/add/', TrasladoCreateView.as_view(), name='traslado_create'),
    path('traslado/delete/<int:pk>/', TrasladoDeleteView.as_view(), name='traslado_delete'),
    path('traslado/update/<int:pk>/', TrasladoUpdateView.as_view(), name='traslado_update'),
    path('traslado/factura/pdf/<int:pk>/', TrasladoFacturaPdfView.as_view(), name='traslado_factura_pdf'),

     # desicorporación de productos en unidad
    path('desinc/list/', DesincListView.as_view(), name='desinc_list'),
    path('desinc/add/', DesincCreateView.as_view(), name='desinc_create'),
    path('desinc/delete/<int:pk>/', DesincDeleteView.as_view(), name='desinc_delete'),
    path('desinc/update/<int:pk>/', DesincUpdateView.as_view(), name='desinc_update'),
    path('desinc/factura/pdf/<int:pk>/', DesincFacturaPdfView.as_view(), name='desinc_factura_pdf'),

    # desicorporación de productos en almacen
    path('desincorp/list/', DesincorpListView.as_view(), name='desincorp_list'),
    path('desincorp/add/', DesincorpCreateView.as_view(), name='desincorp_create'),
    path('desincorp/delete/<int:pk>/', DesincorpDeleteView.as_view(), name='desincorp_delete'),
    path('desincorp/update/<int:pk>/', DesincorpUpdateView.as_view(), name='desincorp_update'),
    path('desincorp/factura/pdf/<int:pk>/', DesincorpFacturaPdfView.as_view(), name='desincorp_factura_pdf'),

     # unidad  - dependencias
    path('unidad/list/', UnidadListView.as_view(), name='unidad_list'),
    path('unidad/add/', UnidadCreateView.as_view(), name='unidad_create'),
    path('unidad/delete/<int:pk>/', UnidadDeleteView.as_view(), name='unidad_delete'),
    path('unidad/update/<int:pk>/', UnidadUpdateView.as_view(), name='unidad_update'),

    # Departamento este modulo debo desarrollarlo mejor
    path('depart/list/', DepartListView.as_view(), name='depart_list'),
    # path('depart/add/', DepartCreateView.as_view(), name='depart_create'),
    # path('depart/update/<int:pk>/', DepartUpdateView.as_view(), name='depart_update'),
    # path('depart/delete/<int:pk>/', DepartDeleteView.as_view(), name='depart_delete'),

    # Proveedores
    path('proveedor/list/', ProveedorListView.as_view(), name='proveedor_list'),
    path('proveedor/add/', ProveedorCreateView.as_view(), name='proveedor_create'),
    path('proveedor/update/<int:pk>/', ProveedorUpdateView.as_view(), name='proveedor_update'),
    path('proveedor/delete/<int:pk>/', ProveedorDeleteView.as_view(), name='proveedor_delete'),

  # Conceptos
    path('concepto/list/', ConcepMovListView.as_view(), name='concepto_list'),
    path('concepto/add/', ConcepMovCreateView.as_view(), name='concepto_create'),
    path('concepto/update/<int:pk>/', ConcepMovUpdateView.as_view(), name='concepto_update'),
    path('concepto/delete/<int:pk>/', ConcepMovDeleteView.as_view(), name='concepto_delete'),
    #Empresa
    path('empresa/list/', EmpresaListView.as_view(), name='empresa_list'),
    path('empresa/update/', EmpresaUpdateView.as_view(), name='empresa_update'),

    #Aprobaciones
    path('aprobdist/list/', AprobacionDistListView.as_view(), name='aprobdist_list'),
    path('aprobtras/list/', AprobacionTrasListView.as_view(), name='aprobtras_list'),
    path('aprobdesinc/list/', AprobacionDesincListView.as_view(), name='aprobdesinc_list'),
    path('aprobdesincalm/list/', AprobacionDesincAlmListView.as_view(), name='aprobdesinc_almac_list'),
    path('aprobdingre/list/', AprobIngresoListView.as_view(), name='aprobingre_list'),

    #Respaldo bd
    path('respaldo_bd/', RespaldoDB.as_view(), name="respaldo_db"),
    path('respaldar_bd/', RespaldarBD.as_view(), name="respaldar_db"),
    

    #Servicio Tecnico bd
    path('recepcion_soporte/list/', SoporteListView.as_view(), name="soporte_list"),   
    path('recepcion_soporte/create/', SoporteCreateView.as_view(), name="soporte_create"), 

    # Monedas
    path('monedas/list/', MonedaListView.as_view(), name='monedas_list'),  
    path('monedas/add/', MonedaCreateView.as_view(), name="monedas_create"), 
    path('monedas/update/<int:pk>/', MonedaUpdateView.as_view(), name='monedas_update'),
]
 