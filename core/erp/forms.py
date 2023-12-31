from django import forms
from core.erp.models import *
from datetime import datetime


class FormProducto(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # self.fields['subgrupobien'].queryset = SubGrupoCtaBienes.objects.none()
        self.fields['nombre'].widget.attrs['autofocus'] = True

    class Meta:
        model=Producto
        fields = '__all__'
        
        widgets = {
            'codigo': forms.TextInput(
                attrs = {
                    'placeholder': 'Código se genera automaticamente',
                    'class': 'form-control rounded-pill',
                    'readonly': True,
                    'id': 'idcodigo',
                    'style': 'font-size: 12px,'

                }
            ),
            'nombre': forms.TextInput(
                attrs = {
                    'placeholder': 'Nombre del Producto...',
                    'class': 'form-control input-flat',
                    'style': 'font-size: 12px',
                    'id': 'idnombre',
                    'autocomplete': 'off'
                }
            ),
            'descripcion': forms.Textarea(
                attrs = {
                    'placeholder': 'Descripción del producto',
                    'rows': '3',
                    'class': 'form-control input-flat',
                    'style': 'font-size: 12px',
                    'autocomplete': 'off'
                }
            ),
            'componentes': forms.Textarea(
                attrs = {
                    'placeholder': 'Componentes del producto',
                    'rows': '3',
                    'class': 'form-control input-flat',
                    'style': 'font-size: 12px',
                    'autocomplete': 'off'
                }
            ),
            'unida_medida': forms.Select(
                attrs = {
                    'class': 'form-control input-flat',
                    'id': 'idunida_medida',
                    'style': 'font-size: 12px; height: 29px'
                }
            ),            
            'pagaimpuesto': forms.CheckboxInput(
                attrs = {
                    'class': 'custom-control-input custom-control-input-primary custom-control-input-outline',
                    'style': 'font-size: 9px',
                    'id': 'idpagaimpuesto'
            }),
            'lote': forms.CheckboxInput(
                attrs = {
                    'class': 'custom-control-input custom-control-input-primary custom-control-input-outline',
                    'style': 'font-size: 9px',
                    'id': 'idlote'
            }),
            'serie': forms.CheckboxInput(
                attrs = {
                    'class': 'custom-control-input custom-control-input-primary custom-control-input-outline',
                    'style': 'font-size: 9px',
                    'id': 'idserie'
            }),
            'tipo_item': forms.RadioSelect(
                attrs = {
                    'choices': tipo_item_choice,
                    'class': 'form-control',
                    'id': 'idtipo_item',
                    'style': 'font-size: 12px; height: 25px',
                    # 'data-toggl': "collapse",
                    # 'data-target': "colapsotipoitem"
             }),
            'grupobien': forms.Select(
                attrs = {
                    'class': 'form-control input-flat',
                    'id': 'idgrupbien',
                    'style': 'font-size: 12px; height: 29px'
            }),
            'subgrupobien': forms.Select(
                attrs = {
                    'class': 'form-control input-flat',
                    'id': 'idsubgrupbien',
                    'style': 'font-size: 12px; height: 29px'
            }),
           
            'categorias': forms.Select(
                attrs = {
                    'class': 'form-control input-flat select2',
                    'id': 'idcategoria',
                    'style': 'font-size: 12px;'
                }
            ),
            'marca': forms.Select(
                attrs = {
                    'class': 'form-control select2 input-flat',
                    'id': 'idmarca',
                    'style': 'font-size: 12px;'
                }
            ),
            'modelo': forms.Select(
                attrs = {
                    'class': 'form-control input-flat select2',
                    'id': 'idmodelo',
                    'style': 'font-size: 12px; height: 29px'
                }
            ),
            'moneda': forms.Select(
                attrs = {
                    'class': 'form-control input-flat',
                    'id': 'idmoneda',
                    'style': 'font-size: 12px; height: 29px'
                }
            ),            
            'activo': forms.CheckboxInput(
                attrs = {
                    'class': 'custom-control-input custom-control-input-primary custom-control-input-outline',
                    'id': 'idactivo',                    
                }
            ),
            'inventariable': forms.CheckboxInput(
                attrs = {
                    'class': 'custom-control-input custom-control-input-primary custom-control-input-outline',
                    'id': 'idinv',
                }
            ),
            'usuario': forms.Select(
                attrs = {
                    'class': 'form-control',
                    'readonly': True
                }
            ),
            'imagen': forms.FileInput(
                attrs = {
                    'placeholder': 'Seleccione Imagen ...',
                    'class': 'form-control input-flat',
                    'id': 'seleccionArchivos',
                    'style': 'font-size: 12px'

                }
            ),
        }

class FormControlStock(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['stock_min'].widget.attrs['autofocus'] = True

    class Meta:
        model=ControlStock
        fields = '__all__' 

        widgets = {            
            'almacenes': forms.Select(attrs={
                'class': 'form-control input-flat',
                'id': 'idalmacenes', 
                'style': 'height: 35px; fotn-size: 13px;'               
            }),
            
            }      

class FormAlmacen(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for form in self.visible_fields():
            form.field.widget.attrs['class'] = 'effect-2'
            form.field.widget.attrs['autocomplete'] = 'off'

    class Meta:
        model=Almacen
        fields = '__all__'
        
        widgets = {
            'codigo': forms.TextInput(
                attrs = {                    
                    'id': 'idCod',
                    'autocomplete': 'off'
                }
            ),
            'nombre': forms.TextInput(
                attrs = {                    
                    'id': 'idAlmacen',
                    'autocomplete': 'off'
                }
            ),
           'unidad': forms.Select(
                attrs = {
                    'class': 'form-control select2',
                    'id': 'idunidad'
                }
            ),
            'ced': forms.TextInput(
                attrs = {                    
                    'id': 'idCed',                    
                    'autocomplete': 'off'
                }
            ),
            'responsable': forms.TextInput(
                attrs = {                    
                    'id': 'idResp',
                    'autocomplete': 'off'
                }
            ),
            
        }
    # def get_id_formateado(self):
    #     return str(self.pk).zfill(6)
    # def save(self, **kwargs):
    #     if (self.id is None):
    #         super().save(*kwargs)
    #     code_str = str(self.__AUTOCODE__ + self.id)
    #     self.codigo = code_str
    #     super().save(*kwargs)
       
    def save(self, commit=True):
        data = {}
        form = super()
      #  __AUTOCODE__="COM"
        try:
            if form.is_valid():
                form.save()
            else:
                data['error'] = form.errors
        except Exception as e:
            data['error'] = str(e)
        return data

class FormGrupo(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['nombre'].widget.attrs['autofocus'] = True
    class Meta:
        model=GrupoCtaBienes
        fields = '__all__'
        
        widgets = {
            'cod_grupo': forms.TextInput(
                attrs = {
                    'class': 'effect-2',
                    'required': True,
                    'id': 'idCod',
                    'autocomplete': 'off'
                }
            ),
            'nombre': forms.TextInput(
                attrs = {                    
                    'class': 'effect-2',
                    'required': True,
                    'id': 'idGrupo',
                    'autocomplete': 'off'
                }
            ),            
        }
    # def get_id_formateado(self):
    #     return str(self.pk).zfill(6)
    # def save(self, **kwargs):
    #     if (self.id is None):
    #         super().save(*kwargs)
    #     code_str = str(self.__AUTOCODE__ + self.id)
    #     self.codigo = code_str
    #     super().save(*kwargs)
       
    def save(self, commit=True):
        data = {}
        form = super()
      #  __AUTOCODE__="COM"
        try:
            if form.is_valid():
                form.save()
            else:
                data['error'] = form.errors
        except Exception as e:
            data['error'] = str(e)
        return data

class FormSubGrupo(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for form in self.visible_fields():
            form.field.widget.attrs['class'] = 'effect-2'
            form.field.widget.attrs['autocomplete'] = 'off'
    class Meta:
        model=SubGrupoCtaBienes
        fields = '__all__'
        
        widgets = {            
            'denominacion': forms.TextInput(
                attrs = {                    
                    'id': 'iddenom',
                    'autofocus': True
                }
            ),                     
        }
    # def get_id_formateado(self):
    #     return str(self.pk).zfill(6)
    # def save(self, **kwargs):
    #     if (self.id is None):
    #         super().save(*kwargs)
    #     code_str = str(self.__AUTOCODE__ + self.id)
    #     self.codigo = code_str
    #     super().save(*kwargs)
       
    def save(self, commit=True):
        data = {}
        form = super()
      #  __AUTOCODE__="COM"
        try:
            if form.is_valid():
                form.save()
            else:
                data['error'] = form.errors
        except Exception as e:
            data['error'] = str(e)
        return data

class FormCodbien(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['procedencia'].queryset = Unidad.objects.filter(tipo_unidad='UAC')
        for form in self.visible_fields():
            form.field.widget.attrs['class'] = 'effect-2 form-control'
            form.field.widget.attrs['autocomplete'] = 'off'

    class Meta:
        model = CodBienes
        fields = '__all__'
        
        widgets = {
            
            'codbien': forms.TextInput(
                attrs = {                    
                    'id': 'idCod',                    
                    'autofocus': True
                }
            ),
           'procedencia': forms.Select(
                attrs = {
                    'id': 'idunidad_Cen'
                }
            ),
            'unidad_admin': forms.Select(
                attrs = {
                    'id': 'idunidad_Loc'
                }
            ),
            'estado': forms.Select(
                attrs = {
                    'id': 'idestado',
                    'class': 'search_select_box'
                }
            ),            
        }
    # def get_id_formateado(self):
    #     return str(self.pk).zfill(6)
    # def save(self, **kwargs):
    #     if (self.id is None):
    #         super().save(*kwargs)
    #     code_str = str(self.__AUTOCODE__ + self.id)
    #     self.codigo = code_str
    #     super().save(*kwargs)
       
    def save(self, commit=True):
        data = {}
        form = super()
      #  __AUTOCODE__="COM"
        try:
            if form.is_valid():
                form.save()
            else:
                data['error'] = form.errors
        except Exception as e:
            data['error'] = str(e)
        return data

class FormCategoria(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for form in self.visible_fields():
            form.field.widget.attrs['class'] = 'effect-2'
            form.field.widget.attrs['autocomplete'] = 'off'
        
    class Meta:
        model = Categoria
        fields = '__all__'

    def save(self, commit=True):
        data = {}
        form = super()
        try:
            if form.is_valid():
               instance = form.save()
               data = instance.toJSON()
            else:
                data['error'] = form.errors
        except Exception as e:
            data['error'] = str(e)
        return data   

class FormMarca(forms.ModelForm):

    class Meta:
        model = Marca
        fields = '__all__'
        widgets = {
            'marca': forms.TextInput(
                attrs = {
                    'class': 'effect-2',
                    'id': 'idmarca'
                }
            ),
        }

    def save(self, commit=True):
        data = {}
        form = super()
        try:
            if form.is_valid():
               instance = form.save()
               data = instance.toJSON()
            else:
                data['error'] = form.errors
        except Exception as e:
            data['error'] = str(e)
        return data

class FormModelo(forms.ModelForm):
    class Meta:
        model = Modelo
        fields = '__all__'
        widgets = {
            'modelo': forms.TextInput(
                attrs = {
                    'class': 'effect-2',
                    'id': 'idmodelo'
                }
            ),
            'marcas': forms.Select(
                attrs = {
                    'class': 'effect-2',
                    'id': 'idmarcas',
                    
                }
            ),
        }

    def save(self, commit=True):
        data = {}
        form = super()
        try:
            if form.is_valid():
               instance = form.save()
               data = instance.toJSON()
            else:
                data['error'] = form.errors
        except Exception as e:
            data['error'] = str(e)
        return data

class UnidadForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for form in self.visible_fields():
            form.field.widget.attrs['class'] = 'effect-2'
            form.field.widget.attrs['autocomplete'] = 'off'

    class Meta:
        model = Unidad
        fields = '__all__'
        widgets = {
            'nombre': forms.TextInput(
                attrs={                   
                    'autocomplete': 'off',
                    'id': 'idunidad'
                }
            ),
            'rif': forms.TextInput(
                attrs={                    
                    'autocomplete': 'off',
                    'id': 'idrif'
                }
            ),
            'ced_resp': forms.TextInput(
                attrs={
                    'autocomplete': 'off',
                    'id': 'idced_resp'
                }
            ),
            'nombrejefe': forms.TextInput(
                attrs={                    
                    'autocomplete': 'off',
                    'id': 'idnombrejefe'
                }
            ),
            'email': forms.TextInput(
                attrs={                    
                    'autocomplete': 'off',
                    'id': 'idemail'
                }
            ),
            'tlf': forms.TextInput(
                attrs={                    
                    'autocomplete': 'off',
                    'id': 'idtlf'
                }
            ),
            'direccion': forms.Textarea(
                attrs={                    
                    'rows': '3',                    
                    'autocomplete': 'off',
                    'id': 'iddireccion'
                }
            ),
            'tipo_unidad': forms.Select(
                attrs = {                    
                    'id': 'idunidad'
                }
            ),
        }

    def save(self, commit=True):
        data = {}
        form = super()
        try:
            if form.is_valid():
                 form.save()
            else:
                data['error'] = form.errors
        except Exception as e:
            data['error'] = str(e)
        return data

class ProveedorForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for form in self.visible_fields():
            form.field.widget.attrs['class'] = 'effect-2'
            form.field.widget.attrs['autocomplete'] = 'off'

    class Meta:
        model = Proveedor
        fields = '__all__'
        widgets = {
            'empresa': forms.TextInput(
                attrs={                    
                    'autocomplete': 'off',
                    'id': 'empresa'
                }
            ),           
            'direccion': forms.Textarea(
                attrs={
                    'rows': '2',
                }
            )
           
        }
      
    def save(self, commit=True):
        data = {}
        form = super()
        try:
            if form.is_valid():
                instance = form.save()
                data = instance.toJSON()
            else:
                data['error'] = form.errors
        except Exception as e:
            data['error'] = str(e)
        return data

class SalidasForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # forma 1
        self.fields['tipo_salida'].queryset = ConcepMovimiento.objects.filter(tipo_conc='SA').filter(estado='ACT')
        self.fields['origen'].widget.attrs['autofocus'] = True
        
    class Meta:
        model = SalidaProduc
        fields = '__all__'
        widgets = {
            'cod_salida': forms.TextInput(attrs={
                'class': 'form-control rounded-pill',
                'placeholder': 'Codigo automatico',
                'readonly': True,
                'id': 'idcodsalida',
                'style': 'font-size: 12px; height: 28px'
            }),
            'origen': forms.Select(attrs={
                'class': 'form-control input-flat',
                'id': 'idorigen',
                'style': 'font-size: 12px; height: 29px'
            }),
            'respon_origen': forms.TextInput(
                attrs = {
                    'class': 'form-control input-flat',
                    'style': 'font-size: 12px; text-transform:uppercase; width:100%; padding: 3px; height: 24px',
                    'id': 'idrespon_origen'
             }),
            'destino': forms.Select(attrs={
                'class': 'form-control input-flat',
                'name': 'destino',
                'id': 'iddestino',
                'style': 'font-size: 12px; height: 29px'
            }),
            'respon_destino': forms.TextInput(
                attrs = {
                    'class': 'form-control input-flat',
                    'style': 'font-size: 12px; text-transform:uppercase; width:100%; padding: 3px; height: 24px',
                    'id': 'idrespon_destino'
             }),
            'tipo_salida': forms.Select(attrs={
                'class': 'form-control input-flat',
                'id': 'idtipo_salida',
                'style': 'font-size: 12px; height: 29px',
            }),
            'tipo_comprob': forms.Select(attrs={
                'class': 'form-control input-flat',                
                'id': 'idtipo_comprob',
                'style': 'font-size: 11px; height: 29px'
            }),
            'num_comprob': forms.TextInput(attrs={
                'class': 'form-control input-flat',
                'placeholder': 'Ingrese número',
                'id': 'idnum_comprob',
                'style': 'font-size: 11px; height: 29px'
            }),
            'subtotal': forms.TextInput(attrs={
                'readonly': True,
                'class': 'form-control input-flat',
                'style': 'height: 27px'
            }),
            'iva': forms.TextInput(attrs={
                'class': 'form-control input-flat',
                'style': 'height: 27px'
            }),
            'total': forms.TextInput(attrs={
                'readonly': True,
                'class': 'form-control input-flat',
                'style': 'height: 27px'
            }),
            'fecha_salida': forms.DateInput(
                format='%Y-%m-%d',
                attrs={
                   'value': datetime.now().strftime('%Y-%m-%d'),
                    'autocomplete': 'off',
                    'class': 'form-control input-flat datetimepicker-input',
                    'id': 'fecha_salida',
                    'data-target': '#fecha_salida',
                    'data-toggle': 'datetimepicker',
                    'style': 'height: 28px; font-size:11px;'
                }
            ),
            'observ': forms.Textarea(
                attrs = {
                    'placeholder': 'Observación',
                    'rows': '2',
                    'class': 'form-control input-flat',
                    'style': 'width: 100%; font-size: 12px',
                    'autocomplete': 'off'
            }),
            'estado': forms.Select(
                attrs={
                    'class': 'form-control input-flat',
                    'style': 'width: 100%; font-size: 12px',
                    'id': 'idestado'
            }),            
        }

class IngresosForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
      # self.fields['proveedor'].queryset = Proveedor.objects.none()        
        # forma 1
        self.fields['tipo_ingreso'].queryset = ConcepMovimiento.objects.filter(tipo_conc='EN').filter(estado='ACT')
         
    class Meta:
        model = IngresoProduc
        fields = '__all__'
        widgets = {
            'cod_ingreso': forms.TextInput(attrs={
                'placeholder': 'Código automático',
                'class': 'form-control rounded-pill',
                'readonly': True,
                'id': 'idcodingreso',
                'style': 'font-size: 12px; height: 28px'
            }),
            'almacen': forms.Select(attrs={
                'class': 'form-control custom-select-sm input-flat',
                'id': 'idalmacen',
                'style': 'font-size: 12px; height: 29px'
            }),
            'respon_almac': forms.TextInput(
                attrs = {
                    'class': 'form-control input-flat',
                    'style': 'font-size: 12px; text-transform:uppercase; width:100%; padding: 3px; height: 25px',
                    'id': 'idrespon_almac'
             }),   
            'tipo_ingreso': forms.Select(attrs={
                'class': 'form-control custom-select-sm input-flat',
                'id': 'idtipo_ingreso',
                'style': 'font-size: 12px; height: 29px'
            }),
            'proveedor': forms.Select(attrs={
                'class': 'form-control custom-select-sm input-flat',
                'id': 'idproveedor',
                'style': 'font-size: 12px; height: 29px'

            }),
            'tipo_comprob': forms.Select(attrs={
                'class': 'form-control input-flat',
                'id': 'idtipo_comprob',
                'style': 'font-size: 12px; height: 29px '
            }),
            'num_comprob': forms.TextInput(attrs={
                'class': 'form-control input-flat',
                'placeholder': 'Ingrese número ',
                'id': 'idnum_comprob',
                'style': 'font-size: 12px; height: 29px'
            }),
            'subtotal': forms.TextInput(attrs={
                'readonly': True,
                'class': 'form-control input-flat',
                'style': 'height: 27px; font-size: 14px;'
            }),
            'iva': forms.TextInput(attrs={
                'class': 'form-control input-flat',
                'style': 'height: 24px',
                'id': 'idiva'
                
            }),
            'total': forms.TextInput(attrs={
                'readonly': True,
                'class': 'form-control input-flat',
                'style': 'height: 27px; font-size: 14px;'
            }),
            'fecha_ingreso': forms.DateInput(
                format='%Y-%m-%d',
                attrs={
                    'value': datetime.now().strftime('%Y-%m-%d'),
                    'autocomplete': 'off',
                    'class': 'form-control input-flat datetimepicker-input',
                    'id': 'fecha_ingreso',
                    'data-target': '#fecha_ingreso',
                    'data-toggle': 'datetimepicker',
                    'style': 'height: 28px; font-size:11px;'
                }
            ),
            'observ': forms.Textarea(
                attrs = {
                    'placeholder': 'Observación',
                    'rows': '2',
                    'class': 'form-control input-flat',
                    'style': 'width: 100%; font-size: 12px',
                    'autocomplete': 'off'
            }),
            'estado': forms.Select(
                attrs={
                    'class': 'form-control',
                    'style': 'width: 100%; font-size: 12px;',
                    'id': 'estatusIng'
            }),
        }        

class TrasladoProdForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # forma 1
        self.fields['tipo_traslado'].queryset = ConcepMovimiento.objects.filter(tipo_conc='TR').filter(estado='ACT')
        self.fields['origen'].widget.attrs['autofocus'] = True

    class Meta:
        model = TrasladoProduc
        fields = '__all__'
        widgets = {
            'cod_traslado': forms.TextInput(attrs={
                'class': 'form-control rounded-pill',
                'placeholder': 'Codigo automatico',
                'readonly': True,
                'id': 'idcodtraslado',
                'style': 'font-size: 11px; height: 28px'
            }),
            'origen': forms.Select(attrs={
                'class': 'form-control input-flat',
                'id': 'idorigen',
                'style': 'font-size: 11px; height: 28px'
            }),
            'respon_origen': forms.TextInput(
                attrs = {
                    'class': 'form-control input-flat',
                    'style': 'font-size: 12px; text-transform:uppercase; width:100%; padding: 3px; height: 24px',
                    'id': 'idrespon_origen'
             }),
            'destino': forms.Select(attrs={
                'class': 'form-control input-flat select2',
                'name': 'destino',
                'id': 'iddestino',
                'style': 'font-size: 12px; height: 24px'
            }),
            'respon_destino': forms.TextInput(
                attrs = {
                    'class': 'form-control input-flat',
                    'style': 'font-size: 12px; text-transform:uppercase; width:100%; padding: 3px; height: 24px',
                    'id': 'idrespon_destino'
             }),
            'tipo_traslado': forms.Select(attrs={
                'class': 'form-control input-flat',
                'id': 'idtipo_traslado',
                'style': 'font-size: 12px; height: 28px'
            }),
            'fecha_traslado': forms.DateInput(
                format='%Y-%m-%d',
                attrs={
                'value': datetime.now().strftime('%Y-%m-%d'),
                'autocomplete': 'off',
                'class': 'form-control input-flat datetimepicker-input',
                'id': 'fecha_traslado',
                'data-target': '#fecha_traslado',
                'data-toggle': 'datetimepicker',
                'style': 'font-size: 12px; height: 27px'
            }),                      
            'observ': forms.Textarea(
                attrs = {
                    'placeholder': 'Observación',
                    'rows': '2',
                    'class': 'form-control input-flat',
                    'style': 'width: 100%; font-size: 11px',
                    'autocomplete': 'off'
            }),
            'estado': forms.Select(
                attrs={
                    'class': 'form-control',
                    'style': 'width: 100%; font-size: 12px;',
                    'id': 'idestado'
            }),
            'soportedocum': forms.FileInput(
                attrs = {
                    'placeholder': 'Seleccione Soporte ...',
                    'class': 'form-control input-flat',
                    'id': 'idsoportetraslado',
                    'style': 'font-size: 12px'
           
            })

        }

class DesincProdForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # forma 1
        # iva = Empresa.objects.values('iva')
        self.fields['tipo_desinc'].queryset = ConcepMovimiento.objects.filter(tipo_conc='DS').filter(estado='ACT')
        #self.fields['iva'].queryset = Empresa.objects.values('iva')
        self.fields['origen'].widget.attrs['autofocus'] = True

    class Meta:
        model = DesincProduc
        fields = '__all__'
        widgets = {
            'cod_desinc': forms.TextInput(attrs={
                'class': 'form-control rounded-pill',
                'placeholder': 'Codigo automatico',
                'readonly': True,
                'id': 'idcoddesinc',
                'style': 'font-size: 11px; height: 26px'
            }),
            'origen': forms.Select(attrs={
                'class': 'form-control custom-select-sm input-flat',
                'id': 'idorigen',
                'style': 'font-size: 12px; height: 28px'            
            }),
            'respon_origen': forms.TextInput(
                attrs = {
                    'class': 'form-control input-flat',
                    'style': 'font-size: 12px; text-transform:uppercase; width:100%; padding: 3px; height: 27px',
                    'id': 'idrespon_origen'
             }),
            'tipo_desinc': forms.Select(attrs={
                'class': 'form-control custom-select-sm input-flat',
                'id': 'id_tipo',
                'style': 'font-size: 12px; height: 28px'
            }),
            'subtotal': forms.TextInput(attrs={
                'readonly': True,
                'class': 'form-control input-flat',
                'style': 'font-size: 12px; height: 24px'
            }),
            'iva': forms.TextInput(attrs={
                'class': 'form-control input-flat',
                'style': 'font-size: 12px; height: 24px'
            }),
            'total': forms.TextInput(attrs={
                'readonly': True,
                'class': 'form-control input-flat',
                'style': 'font-size: 12px; height: 24px'
            }),
            'fecha_desinc': forms.DateInput(attrs={
                'value': datetime.now().strftime('%Y-%m-%d'),
                'autocomplete': 'off',
                'class': 'form-control datetimepicker-input input-flat',
                'id': 'fecha_desinc',
                'data-target': '#reservationdate',
                'style': 'font-size: 12px; height: 27px'
            }),
            'observ': forms.Textarea(
                attrs = {
                    'placeholder': 'Observación',
                    'rows': '2',
                    'class': 'form-control input-flat',
                    'style': 'width: 100%; font-size: 12px',
                    'autocomplete': 'off'
            }),
            'estado': forms.Select(
                attrs={
                    'class': 'form-control',
                    'style': 'width: 100%; font-size: 12px;',
                    'id': 'idestado'
            }),
            'soportedocum': forms.FileInput(
                attrs = {
                    'placeholder': 'Seleccione Soporte ...',
                    'class': 'form-control input-flat',
                    'id': 'idsoportedesinc',
                    'style': 'font-size: 12px'
           
            }),            
        }

class DesincAlmacenForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # forma 1
        self.fields['tipo_desinc'].queryset = ConcepMovimiento.objects.filter(tipo_conc='DS').filter(estado='ACT')
        self.fields['fecha_desinc'].widget.attrs['autofocus'] = True

    class Meta:
        model = DesincAlmacen
        fields = '__all__'
        widgets = {
            'cod_desinc': forms.TextInput(attrs={
                'class': 'form-control rounded-pill',
                'placeholder': 'Codigo automatico',
                'readonly': True,
                'id': 'idcoddesinc',
                'style': 'font-size: 11px; height: 28px'
            }),
            'almacen': forms.Select(attrs={
                'class': 'form-control input-flat',
                'id': 'idalmacen',
                'style': 'font-size: 11px; height: 28px' 
            }),
            'respon_almac': forms.TextInput(
                attrs = {
                    'class': 'form-control input-flat',
                    'style': 'font-size: 12px; text-transform:uppercase; width:100%; padding: 3px; height: 28px',
                    'id': 'idrespon_almac'
             }),            
            'tipo_desinc': forms.Select(attrs={
                'class': 'form-control input-flat',
                'id': 'id_tipo',
                'style': 'font-size: 11px; height: 28px'
            }),
            'subtotal': forms.TextInput(attrs={
                'readonly': True,
                'class': 'form-control input-flat',
                'style': 'font-size: 12px; height: 27px'
            }),
            'iva': forms.TextInput(attrs={
                'class': 'form-control input-flat',
                'style': 'height: 27px'
            }),
            'total': forms.TextInput(attrs={
                'readonly': True,
                'class': 'form-control input-flat',
                'style': 'font-size: 12px; height: 27px'
            }),
            'fecha_desinc': forms.DateInput(attrs={
                'value': datetime.now().strftime('%Y-%m-%d'),
                'autocomplete': 'off',
                'class': 'form-control input-flat datetimepicker-input',
                'id': 'fecha_desinc',
                'data-target': '#reservationdate',
                'style': 'font-size: 12px; height: 28px'
            }),
            'observ': forms.Textarea(
                attrs = {
                    'placeholder': 'Observación',
                    'rows': '2',
                    'class': 'form-control input-flat',
                    'style': 'width: 100%; font-size: 12px',
                    'autocomplete': 'off'
            }),
            'estado': forms.Select(
                attrs={
                    'class': 'form-control',
                    'style': 'width: 100%; font-size: 12px;',
                    'id': 'idestado'
            }),
            'soportedocum': forms.FileInput(
                attrs = {
                    'placeholder': 'Seleccione Soporte ...',
                    'class': 'form-control input-flat',
                    'id': 'idsoportedesinc',
                    'style': 'font-size: 12px'
           
            }),
        }

class FormDepart(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['nombre'].widget.attrs['autofocus'] = True
    class Meta:
        model = Departamento
        fields = '__all__'
        widgets = {
            'nombre': forms.TextInput(
                attrs = {
                    'class': 'effect-2',
                    'id': 'iddepartamento',
                }
            ),
        }
    def save(self, commit=True):
        data = {}
        form = super()
        try:
            if form.is_valid():
               instance = form.save()
               data = instance.toJSON()
            else:
                data['error'] = form.errors
        except Exception as e:
            data['error'] = str(e)
        return data   

class FormConcepMov(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for form in self.visible_fields():
            form.field.widget.attrs['class'] = 'effect-2 form-control'
            form.field.widget.attrs['autocomplete'] = 'off'
    class Meta:
        model = ConcepMovimiento
        fields = '__all__'
        
        widgets = {
            
            'codigo': forms.TextInput(
                attrs = {                    
                    'id': 'idCod',
                    'autocomplete': 'off'
                }
            ),
           'denominacion': forms.TextInput(
                attrs = {                 
                    'id': 'idDenomin',
                    'autocomplete': 'off'
                }
            ),
            'estado': forms.Select(
                attrs = {
                    'id': 'idestado'
                }
            ),
            'tipo_conc': forms.Select(
                attrs = {
                    'id': 'idtipo_conc'
                }
            ),
        }
       
    def save(self, commit=True):
        data = {}
        form = super()
        
      #  __AUTOCODE__="COM"
        try:
            if form.is_valid():
                form.save()
            else:
                data['error'] = form.errors
        except Exception as e:
            data['error'] = str(e)
        return data

class FormMoneda(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['codigo'].widget.attrs['autofocus'] = True
    class Meta:
        model=Moneda
        fields = '__all__'
        
        widgets = {
            'codigo': forms.TextInput(
                attrs = {
                    'placeholder': 'Ingrese codigo de la moneda',
                    'class': 'form-control',
                    'id': 'idcod',
                }
            ),
            'simbolo': forms.TextInput(
                attrs = {
                    'placeholder': 'Ingrese el símbolo de la moneda',
                    'class': 'form-control',
                    'autocomplete': 'off'
                }
            ),
            'pais': forms.TextInput(
                attrs = {
                    'placeholder': 'País al que pertenece...',
                    'class': 'form-control',
                }
            ),
            'moneda': forms.TextInput(
                attrs = {
                    'placeholder': 'Ingrese el nombre',
                    'class': 'form-control',
                }
            ),  
            'status': forms.CheckboxInput(
                attrs = {
                    'class': 'custom-control-input',
                    'style': 'font-size: 9px',
                    'id': 'idstatus'
            }),                
        }
    
    def save(self, commit=True):
        data = {}
        form = super()
      #  __AUTOCODE__="COM"
        try:
            if form.is_valid():
                form.save()
            else:
                data['error'] = form.errors
        except Exception as e:
            data['error'] = str(e)
        return data

class EmpresaForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['nombre'].widget.attrs['autofocus'] = True

    class Meta:
        model = Empresa
        fields = 'nombre', 'tipo_docu','documento', 'dedicacion', 'tlflocal', 'email', 'web', 'mision', 'vision', 'logo', 'direccion', 'representante', 'ced_repre', 'nameimpuesto', 'iva',
        widgets = {
            'nombre': forms.TextInput(attrs={'placeholder': 'Ingrese un nombre'}),
            'tipo_docu': forms.Select(attrs={'class': 'form-control','id': 'iddocum'}),
            'documento': forms.TextInput(attrs={'placeholder': 'Ingrese el rif'}),
            'dedicacion': forms.TextInput(attrs={'placeholder': 'Ingrese dedicacion'}),
            'tlflocal': forms.TextInput(attrs={'placeholder': 'Ingrese un numero de teléfono'}),
            'email': forms.TextInput(attrs={'placeholder': 'Ingrese un email'}),
            'web': forms.TextInput(attrs={'placeholder': 'Ingrese una dirección web'}),
            'mision': forms.TextInput(attrs={'placeholder': 'Ingrese la misión de la institución'}),
            'vision': forms.TextInput(attrs={'placeholder': 'Ingrese la visión de la institución'}),
            'logo': forms.FileInput(attrs={'placeholder': 'Seleccione Imagen ...'}),
            'direccion': forms.TextInput(attrs={'placeholder': 'Ingrese una dirección'}),
            'representante': forms.TextInput(attrs={'placeholder': 'Ingrese un nombre'}),
            'ced_repre': forms.TextInput(attrs={'placeholder': 'Ingrese un numero de cedula'}),
            'nameimpuesto': forms.TextInput(attrs={'placeholder': 'Ingrese nombre del impuesto'}),
            'iva': forms.TextInput(attrs={'class': 'form-control', 'style': 'font-size: 12px'}),
        }
        exclude = ['cuentadante', 'ced_ctadante']
    def save(self, commit=True):
        data = {}
        form = super()
        try:
            if form.is_valid():
                form.save()
            else:
                data['error'] = form.errors
        except Exception as e:
            data['error'] = str(e)
        return data

class LoteForm(forms.ModelForm):
    class Meta:
        model = Lotes
        fields = '__all__'
        widgets = {
            'nro_lote': forms.TextInput(
                attrs = {
                    'placeholder': 'Ingrese el número del lote',
                    'class': 'form-control input-flat',
                    'style': 'height: 31px; font-size:12px;',
                    'id': 'id_nro'
                }
            ),
            'fecha_venc': forms.DateInput(
                format='%Y-%m-%d',
                attrs={                    
                    'autocomplete': 'off',
                    'class': 'form-control input-flat datetimepicker-input',
                    'data-target': '#f_venc',
                    'data-toggle': 'datetimepicker',
                    'id': 'fecha_venc',
                    'style': 'height: 31px; font-size:12px;'
                }
            ),
        }