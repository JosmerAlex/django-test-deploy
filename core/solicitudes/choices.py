#Servicio Técnico
prioridad_choices = (
    ('MB', 'Muy baja'),
    ('BJ', 'Baja'),
    ('NM', 'Normal'),
    ('AT', 'Alta'),
    ('MA', 'Muy alta')
)
tipo_solic_choices = (
    ('REP', 'Reparacion y mantenimiento'),
    ('AST', 'Soporte técnico'),
)
status_choices = (
    ('ECR', 'En Creación'),
    ('PEN', 'Pendiente'),
    ('REC', 'Rechazada'),
    ('RES', 'Resuelta')
)
prod_solicitud_choices = (
    ('BMU', 'Bien mueble en uso'),
    ('BMD', 'Bien en deposito'),
)