# Generated by Django 4.1.5 on 2023-06-17 20:44

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('erp', '0008_remove_solitudsoporte_unidad_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Seriales',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('serial', models.CharField(blank=True, max_length=120, null=True, verbose_name='Serial')),
                ('stock', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='stock_serial_set', to='erp.controlstock')),
            ],
            options={
                'verbose_name': 'Serial de Producto',
                'verbose_name_plural': 'Seriales de Productos',
                'ordering': ['id'],
            },
        ),
        migrations.CreateModel(
            name='Lotes',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nro_lote', models.CharField(blank=True, max_length=120, null=True, verbose_name='Número de lote')),
                ('stock', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='stock_lote_set', to='erp.controlstock')),
            ],
            options={
                'verbose_name': 'Número de Lote del Producto',
                'verbose_name_plural': 'Números de Lote de Productos',
                'ordering': ['id'],
            },
        ),
    ]
