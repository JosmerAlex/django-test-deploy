# Generated by Django 4.1.5 on 2023-05-10 03:21

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('erp', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='trasladoproduc',
            name='usuario',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='trasprod_user_set', to=settings.AUTH_USER_MODEL, verbose_name='Usuario'),
        ),
        migrations.AddField(
            model_name='subgrupoctabienes',
            name='grupo',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='erp.grupoctabienes', verbose_name='Grupo cuenta'),
        ),
        migrations.AddField(
            model_name='salidaproduc',
            name='destino',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='salidaproduc_destino_set', to='erp.unidad', verbose_name='Destino distribución'),
        ),
        migrations.AddField(
            model_name='salidaproduc',
            name='origen',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='salidaproduc_almacen_set', to='erp.almacen', verbose_name='Origen distribución'),
        ),
        migrations.AddField(
            model_name='salidaproduc',
            name='tipo_salida',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='erp.concepmovimiento', verbose_name='Tipo de Salida'),
        ),
        migrations.AddField(
            model_name='salidaproduc',
            name='usuario',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='salidaproduc_user_set', to=settings.AUTH_USER_MODEL, verbose_name='Usuario'),
        ),
        migrations.AddField(
            model_name='salidainsumos',
            name='almacen',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='salidainsumos_almacen_set', to='erp.almacen', verbose_name='Origen distribución'),
        ),
        migrations.AddField(
            model_name='salidainsumos',
            name='destino',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='salidainsumos_destino_set', to='erp.unidad', verbose_name='Destino distribución'),
        ),
        migrations.AddField(
            model_name='salidainsumos',
            name='tipo_salida',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='salidainsumos_concepto_set', to='erp.concepmovimiento', verbose_name='Tipo de Salida'),
        ),
        migrations.AddField(
            model_name='salidainsumos',
            name='usuario',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='salidainsumos_user_set', to=settings.AUTH_USER_MODEL, verbose_name='Usuario'),
        ),
        migrations.AddField(
            model_name='producto',
            name='categorias',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='prod_categ_set', to='erp.categoria', verbose_name='Categoria'),
        ),
        migrations.AddField(
            model_name='producto',
            name='grupobien',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='erp.grupoctabienes', verbose_name='Grupo Bienes'),
        ),
        migrations.AddField(
            model_name='producto',
            name='marca',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='prod_marca_set', to='erp.marca', verbose_name='Marca'),
        ),
        migrations.AddField(
            model_name='producto',
            name='modelo',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='prod_modelo_set', to='erp.modelo', verbose_name='Modelo'),
        ),
        migrations.AddField(
            model_name='producto',
            name='moneda',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='prod_moneda_set', to='erp.moneda', verbose_name='Moneda'),
        ),
        migrations.AddField(
            model_name='producto',
            name='subgrupobien',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='erp.subgrupoctabienes', verbose_name='Cuenta Bienes'),
        ),
        migrations.AddField(
            model_name='producto',
            name='usuario',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='prod_user_set', to=settings.AUTH_USER_MODEL, verbose_name='Usuario'),
        ),
        migrations.AddField(
            model_name='modelo',
            name='marcas',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='marca_model_set', to='erp.marca', verbose_name='Marca'),
        ),
        migrations.AddField(
            model_name='inventariobienes',
            name='ant_tipo_proc',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='tipo_proc_ant_invbienes_set', to='erp.concepmovimiento', verbose_name='Tipo de entrada anterior'),
        ),
        migrations.AddField(
            model_name='inventariobienes',
            name='codbien',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='codbien_invbienes_set', to='erp.codbienes', verbose_name='Código Bien'),
        ),
        migrations.AddField(
            model_name='inventariobienes',
            name='prod',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='prod_invbienes_set', to='erp.producto', verbose_name='Producto'),
        ),
        migrations.AddField(
            model_name='inventariobienes',
            name='salida',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='invBienesSalproduc_set', to='erp.salidaproduc'),
        ),
        migrations.AddField(
            model_name='inventariobienes',
            name='tipo_proc',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='tipo_proc_invbienes_set', to='erp.concepmovimiento', verbose_name='Tipo de entrada'),
        ),
        migrations.AddField(
            model_name='inventariobienes',
            name='ubica_fisica',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='ubica_invbienes_set', to='erp.departamento', verbose_name='Ubicación del Bien'),
        ),
        migrations.AddField(
            model_name='inventariobienes',
            name='unidad',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='unida_invbienes_set', to='erp.unidad', verbose_name='Unidad'),
        ),
        migrations.AddField(
            model_name='ingresoproduc',
            name='almacen',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='ingresoproduc_almacen_set', to='erp.almacen', verbose_name='Almacen'),
        ),
        migrations.AddField(
            model_name='ingresoproduc',
            name='proveedor',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='ingresoproduc_prod_set', to='erp.proveedor', verbose_name='Proveedor'),
        ),
        migrations.AddField(
            model_name='ingresoproduc',
            name='tipo_ingreso',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='erp.concepmovimiento', verbose_name='Tipo ingreso'),
        ),
        migrations.AddField(
            model_name='ingresoproduc',
            name='usuario',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='ingresoproduc_user_set', to=settings.AUTH_USER_MODEL, verbose_name='Usuario'),
        ),
        migrations.AddField(
            model_name='dettrasladoprod',
            name='codbien',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='dettrasprod_codbien_set', to='erp.codbienes', verbose_name='Código Bien'),
        ),
        migrations.AddField(
            model_name='dettrasladoprod',
            name='codubica',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='dettras_ubicorigen_set', to='erp.departamento', verbose_name='Ubicación origen'),
        ),
        migrations.AddField(
            model_name='dettrasladoprod',
            name='prod',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='dettrasprod_prod_set', to='erp.producto', verbose_name='Producto'),
        ),
        migrations.AddField(
            model_name='dettrasladoprod',
            name='trasproduc',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='dettrasprod_traslado_set', to='erp.trasladoproduc', verbose_name='Código transferencia'),
        ),
        migrations.AddField(
            model_name='dettrasladoprod',
            name='ubica_destino',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='dettras_ubicdestino_set', to='erp.departamento', verbose_name='Ubicación destino'),
        ),
        migrations.AddField(
            model_name='detsalidaprod',
            name='codbien',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='detsalidaprod_codbien_set', to='erp.codbienes', verbose_name='Código Bien'),
        ),
        migrations.AddField(
            model_name='detsalidaprod',
            name='codubica',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='detsalidaprod_ubicafisi_set', to='erp.departamento', verbose_name='Código ubicación'),
        ),
        migrations.AddField(
            model_name='detsalidaprod',
            name='prod',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='detsalidaprod_prod_set', to='erp.producto', verbose_name='Producto'),
        ),
        migrations.AddField(
            model_name='detsalidaprod',
            name='salida',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='detsalidaprod_salida_set', to='erp.salidaproduc', verbose_name='Código distribución'),
        ),
        migrations.AddField(
            model_name='detsalidainsumos',
            name='prod',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='det_salidainsumos_prod_set', to='erp.producto', verbose_name='Producto'),
        ),
        migrations.AddField(
            model_name='detsalidainsumos',
            name='salida',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='det_salidainsumos_set', to='erp.salidainsumos', verbose_name='Código distribución'),
        ),
        migrations.AddField(
            model_name='detingresoproduc',
            name='ingresoPro',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='detingresoproduc_ingresopro_set', to='erp.ingresoproduc', verbose_name='Código distribución'),
        ),
        migrations.AddField(
            model_name='detingresoproduc',
            name='prod',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='detingresoproduc_prod_set', to='erp.producto', verbose_name='Producto'),
        ),
        migrations.AddField(
            model_name='detdesincprod',
            name='codbien',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='detdesincprod_codbien_set', to='erp.codbienes', verbose_name='Código Bien'),
        ),
        migrations.AddField(
            model_name='detdesincprod',
            name='codubica',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='detdesincprod_ubicafisi_set', to='erp.departamento', verbose_name='Código ubicación'),
        ),
        migrations.AddField(
            model_name='detdesincprod',
            name='desinc',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='detdesincprod_desinc_set', to='erp.desincproduc', verbose_name='Código desincorporación'),
        ),
        migrations.AddField(
            model_name='detdesincprod',
            name='prod',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='detdesincprod_prod_set', to='erp.producto', verbose_name='Producto'),
        ),
        migrations.AddField(
            model_name='detdesincalmacen',
            name='desincorp',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='detdesinc_almacen_set', to='erp.desincalmacen', verbose_name='Código desincorporación'),
        ),
        migrations.AddField(
            model_name='detdesincalmacen',
            name='prod',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='detdesincprod_almacen_set', to='erp.producto', verbose_name='Producto'),
        ),
        migrations.AddField(
            model_name='desincproduc',
            name='origen',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='desincproduc_unidad_set', to='erp.unidad', verbose_name='Origen desincorporación'),
        ),
        migrations.AddField(
            model_name='desincproduc',
            name='tipo_desinc',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='tipo_desincorp_set', to='erp.concepmovimiento', verbose_name='Tipo desincorporación'),
        ),
        migrations.AddField(
            model_name='desincproduc',
            name='usuario',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='desincproduc_user_set', to=settings.AUTH_USER_MODEL, verbose_name='Usuario'),
        ),
        migrations.AddField(
            model_name='desincalmacen',
            name='almacen',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='desincproduc_almacen_set', to='erp.almacen', verbose_name='Ubicación desincorporación'),
        ),
        migrations.AddField(
            model_name='desincalmacen',
            name='tipo_desinc',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='tipo_desinc_set', to='erp.concepmovimiento', verbose_name='Tipo desincorporación'),
        ),
        migrations.AddField(
            model_name='desincalmacen',
            name='usuario',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='desincalmacen_user_set', to=settings.AUTH_USER_MODEL, verbose_name='Usuario'),
        ),
        migrations.AddField(
            model_name='controlstock',
            name='almacenes',
            field=models.ForeignKey(blank=True, default=1, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='prod_almacen_set', to='erp.almacen', verbose_name='Almacen'),
        ),
        migrations.AddField(
            model_name='controlstock',
            name='productos',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='Catproducto_set', to='erp.producto'),
        ),
        migrations.AddField(
            model_name='codbienes',
            name='procedencia',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='codbienes_unidacental_set', to='erp.unidad', verbose_name='Unidad Admin. Central'),
        ),
        migrations.AddField(
            model_name='codbienes',
            name='unidad_admin',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='codbienes_unidaadmin_set', to='erp.unidad', verbose_name='Unidad Admin. Local'),
        ),
        migrations.AddField(
            model_name='almacen',
            name='unidad',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='prod_almacen_set', to='erp.unidad', verbose_name='Pertenece a:'),
        ),
    ]
