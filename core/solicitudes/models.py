from datetime import date, datetime
# Django
from django.db import models
from django.utils.text import capfirst
from core.erp.models import *
from core.user.models import User
from core.solicitudes.choices import *
from django.forms import model_to_dict


# Create your models here.
class SolicSoporte(models.Model):
    codigo= models.CharField(max_length=14, unique=True, blank=True, null=True, verbose_name='Código')
    usuario=models.ForeignKey(AUTH_USER_MODEL, on_delete=models.CASCADE, blank=True, null=True, related_name='solicitud_soporte_user', verbose_name='Usuario')
    estado= models.CharField(max_length=3, choices=status_choices, default='ECR', null=True, blank=True, verbose_name='Estado de la Solicitud')    
    prioridad = models.CharField(max_length=2, choices=prioridad_choices, null=True, blank=True)
    tipo_solic=models.CharField(max_length=3, choices=tipo_solic_choices, default='AST', null=True, blank=True)
    tipo_prod = models.CharField(max_length=3, choices=prod_solicitud_choices, null=True, blank=True)
    fecha = models.DateField(default=datetime.now, verbose_name='Fecha de Solicitud')
    unidad = models.ForeignKey(Unidad, on_delete=models.CASCADE, blank=True, null=True, related_name='solicitud_soporte_unidad', verbose_name='Unidad Solicitante')
    descrip=models.CharField(max_length=200, null=True, blank=True, verbose_name='Descripción')
    created=models.DateTimeField(auto_now_add=True, verbose_name='Creación')
    updated=models.DateTimeField(auto_now_add=True, verbose_name='Ultima modificación')

    def __str__(self):
        return self.codigo

    def get_full_name(self):
        return '{} - {}'.format(self.codigo, self.usuario.first_name)
    
    def toJSON(self):
        item = model_to_dict(self)
        item['unidad'] = self.unidad.toJSON()      
        item['fecha_solicitud'] = self.fecha.strftime('%Y-%m-%d')
        item['usuario'] = self.usuario.toJSON()
        item['estado'] = {'id': self.estado, 'name': self.get_estado_display()}
        item['prioridad'] = {'id': self.prioridad, 'name': self.get_prioridad_display()}
        item['tipo_solic'] = {'id': self.tipo_solic, 'name': self.get_tipo_solic_display()}
        item['tipo_prod'] = {'id': self.tipo_prod, 'name': self.get_tipo_prod_display()}
        item['det'] = [i.toJSON() for i in self.solic_soport_set.all()]
        return item

    class Meta:
        verbose_name = 'Solicitud de Servicio Técnico'
        verbose_name_plural = 'Solicitudes de Servicio Técnico'
        ordering = ['codigo']

class DetSolicSoporte(models.Model):
    solic_soport = models.ForeignKey(SolicSoporte, on_delete=models.CASCADE, blank=True, null=True, related_name='solic_soport_set', verbose_name='Código de Solicitud')
    prod = models.ForeignKey(Producto, on_delete=models.CASCADE, blank=True, null=True, related_name='prodsolic_soport_set', verbose_name='Producto')
    diagnostico = models.CharField(max_length=200, null=True, blank=True, verbose_name="Diagnóstico")

    def __str__(self):
        return self.prod.nombre

    def toJSON(self):
        item = model_to_dict(self, exclude=['solic_soport'])
        item['prod'] = self.prod.toJSON()
        return item

    class Meta:
        verbose_name = 'Detalle Solicitud de Servicio Técnico'
        verbose_name_plural = 'Detalle Solicitudes de Servicio Técnico'       
        ordering = ['id']
