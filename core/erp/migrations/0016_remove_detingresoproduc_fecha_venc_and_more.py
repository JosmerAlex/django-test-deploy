# Generated by Django 4.1.5 on 2023-06-30 16:32

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('erp', '0015_lotes_prod'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='detingresoproduc',
            name='fecha_venc',
        ),
        migrations.RemoveField(
            model_name='detingresoproduc',
            name='nro_lote',
        ),
    ]
