from django.contrib import admin
from core.erp.models import *
# Register your models here.
# Modelos


# Register your models here.

class almacenProductoAdmin(admin.ModelAdmin):
    list_display = ('nombre',)
    search_fields = ('nombre',)
    readonly_fields=('created','updated')

class ProductoAdmin(admin.ModelAdmin):
    list_display = ('codigo', 'nombre', 'descripcion', 'categorias', 'marca')
    search_fields = ('codigo', 'nombre')
    list_filter = ('categorias','marca',)
    list_per_page = 5
    readonly_fields=('created','updated')

# class ClientAdmin(admin.ModelAdmin):
#     list_display = ('names', 'surnames', 'dni', 'date_birthday', 'address','gender')
#     search_fields = ('names', 'dni')
#     list_filter = ('gender',)
#     list_per_page = 10
#     readonly_fields=('created','updated')



admin.site.register(Categoria)
admin.site.register(Marca)
admin.site.register(Modelo)
admin.site.register(Moneda)
admin.site.register(Almacen, almacenProductoAdmin)
admin.site.register(Producto, ProductoAdmin)
admin.site.register(ConcepMovimiento)
admin.site.register(CodBienes)

# admin.site.register(Client)