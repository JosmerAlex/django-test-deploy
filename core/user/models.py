from django.contrib.auth.models import AbstractUser
from django.db import models
from django.forms import model_to_dict

from crum import get_current_request

from configuracion.settings import MEDIA_URL, STATIC_URL

SEXO_CHOICES = [
        ("M", 'Masculino'),
        ("F", 'Femenino'),
        ("O", 'Otros'),
    ]

class User(AbstractUser):
    dni = models.IntegerField(verbose_name="Documento de Identidad", null=True, blank=True, unique=True)
    sexo = models.CharField(max_length=1, choices=SEXO_CHOICES, blank=True, verbose_name='Sexo')
    image = models.ImageField(upload_to='users/%Y/%m/%d', null=True, blank=True, verbose_name='Imagen')
    token = models.UUIDField(primary_key=False, editable=False, null=True, blank=True)

    def get_image(self):
        if self.image:
            return '{}{}'.format(MEDIA_URL, self.image)
        return '{}{}'.format(STATIC_URL, 'users/img/default.png')

    def toJSON(self):
        item = model_to_dict(self, exclude=['last_login'])
        if self.last_login:
            item['last_login'] = self.last_login.strftime('%Y-%m-%d')
        item['date_joined'] = self.date_joined.strftime('%Y-%m-%d')
        item['image'] = self.get_image()
        item['full_name'] = self.get_full_name()
        item['groups'] = [{'id': g.id, 'name': g.name} for g in self.groups.all()]
        item['user_permissions'] = [{'id': p.id, 'name': p.name} for p in self.user_permissions.all()]
        return item
