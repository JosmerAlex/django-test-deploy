gender_choices = (
    ('hombre','Hombre'),
    ('mujer','Mujer')
)
tipo_concepto_choice = (
    ('EN', 'Entrada'),
    ('SA', 'Salida'),
    ('TR', 'traslado'),
    ('DS', 'Desincorporación')
)

#Solicitud de Servicio Técnico
tipo_servicio_choices = (
    ('MP', 'Mantenimiento Preventivo'),
    ('MC', 'Mantenimiento Correctivo'),
    ('OT', 'Otros')
)

tipo_item_choice = (
    ('P', 'Producto'),
    ('S', 'Servicio')
)

unidamedida_choice = (
    ('unidad', 'Unidad'),
    ('pieza', 'Pieza'),
    ('equipo', 'Equipo'),
    ('caja', 'Caja'),
    ('bulto', 'Bulto'),
    ('paquete', 'Paquete'),
    ('servicio', 'Servicio'),
    ('metro', 'Metro'),
    ('centimetro', 'Centimetro'),
    ('milimetro', 'Milimetro'),
    ('pulgada', 'Pulgada'),
    ('litro', 'Litro'),
    ('mililitro', 'Mililitro'),
    ('galon', 'Galon'),
    ('gramo', 'Gramo'),
    ('kilogramo', 'Kilogramo'),
    ('tonelada', 'Tonelada'),
    ('libra', 'Libra')
)

#estado del documento solo para q el analista seleccione estas dos, bien saea ingreso ó salida de producto
estadoDocumento_choices = (
    ('DIS','En creación'),
    ('APR','Aprobado'),
    ('REC','Rechazado'),  # la distribucion esta en diseño o en proceso
)

#estado del documento con todas las opciones, bien saea ingreso ó salida de producto
# estadoDocutodos_choices = (
#     ('ANU','Anulado'), # distribucion anulada
#     ('ENT','Entregado'), # ya fue entregado
#     ('PEN','Por entregar'), # ya esta aprobado pero aun no se a entregado
#     ('PAP','Por aprobar'), # ya se envio por aprobacion pero aun no se a aprobado
#     ('DIS','En creación')  # la distribucion esta en diseño o en proceso
# )

#especialmente para las autoridades ò en cualquier otra necesidad
activo_choices = (
    ('ACT','Activo'), 
    ('INA','Inactivo')
)

#estado de aprobacion por la administracion
aprobado_choices = (
    ('APR','Aprobado'),
    ('PAP','Por aprobar'),
    ('RPR','Reprobado')
)

estadoCodigobien_choices = (
    ('ASI','Asignado'),
    ('SAS','Sin asignar'),
    ('ANU','Anulado')
)

#tipo de ingreso
condicionproducto_choices = (
    ('BNO','Bueno'),
    ('REG','Regular'),
    ('MAL','Malo'),
    ('OTR','Especificar')
)

tipocomprobante_choices = (
    ('FAC','Factura'),
    ('NTD','Nota debito'),
    ('NTE','Nota entrega'),
    ('MEM','Memorandum')
)
tipounidad_choices = (
    ('UAC','Unidad Administrativa Central'),
    ('UAL','Unidad Administrativa Local'),   
)

tipoproduc_choices = (
    ('BM','Bienes mueble de uso'),
    ('BI','Bienes inmueble'),
    ('MC','Material de consumo'),
    ('SV','Servicio')
)

#tipo de documento Idenbtificacion
tipodocuidentif_choices = (
    ('CED','Cédula'),
    ('PAS','Pasaporte'),
    ('RIF','Rif'),
    ('NIT','Nit')
)