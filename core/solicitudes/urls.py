from django.urls import path
from core.solicitudes.views.servicio_tecnico.views import *

app_name = 'solicitudes'


urlpatterns = [
    # servicio técnico
    path('soporte/list/', SolicSoporteListView.as_view(), name='soporte_list'),
    path('soporte/add/', SolicSoporteCreateView.as_view(), name='soporte_create'),
    path('soporte/update/<int:pk>/', SolicSoporteUpdateView.as_view(), name='soporte_update'),

]


