# Generated by Django 4.1.5 on 2023-06-20 18:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('erp', '0009_seriales_lotes'),
    ]

    operations = [
        migrations.AddField(
            model_name='lotes',
            name='fecha_venc',
            field=models.DateField(blank=True, null=True, verbose_name='Fecha de vencimiento'),
        ),
    ]
