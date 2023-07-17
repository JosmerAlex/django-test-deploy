from django import forms
from django.forms import ModelForm
from core.solicitudes.models import *
from datetime import datetime

class FormSolicSoporte(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
    
    class Meta:
        model = SolicSoporte
        fields = '__all__'
        widgets = {
            'codigo': forms.TextInput(attrs={
                'class': 'form-control rounded-pill',
                'placeholder': 'Codigo automatico',
                'readonly': True,
                'id': 'idcodsalida',
                'style': 'font-size: 12px; height: 28px'
            }),
            'unidad': forms.Select(attrs={
                'class': 'form-control input-flat',
                'id': 'idunidad',
                'style': 'font-size: 12px; height: 29px'
            }),            
            'prioridad': forms.Select(attrs={
                'class': 'form-control input-flat',
                'style': 'font-size: 12px; height: 29px'
            }),            
            'tipo_solic': forms.Select(attrs={
                'class': 'form-control input-flat',
                'style': 'font-size: 12px; height: 29px',
            }),
            'tipo_prod': forms.Select(attrs={
                'class': 'form-control input-flat',
                'style': 'font-size: 12px; height: 29px'
            }),
            'estado': forms.Select(attrs={
                'class': 'form-control input-flat',
                'placeholder': 'Ingrese número',
                'style': 'font-size: 12px; height: 29px'
            }),            
            'fecha': forms.DateInput(
                format='%Y-%m-%d',
                attrs={
                   'value': datetime.now().strftime('%Y-%m-%d'),
                    'autocomplete': 'off',
                    'class': 'form-control datetimepicker-input input-flat',
                    'id': 'fecha_solic',
                    'data-target': '#fecha_solic',
                    'data-toggle': 'datetimepicker',
                    'style': 'height: 29px; font-size:12px;'
                }
            ),
            'descrip': forms.Textarea(
                attrs = {
                    'placeholder': 'Ingrese una descripción',
                    'rows': '2',
                    'class': 'form-control input-flat',
                    'style': 'width: 100%; font-size: 12px',
                    'autocomplete': 'off'
            }),                    
        }
