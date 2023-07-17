from django.contrib import admin
from django.conf import settings   
from django.conf.urls.static import static 
from django.urls import path, include
from django.conf.urls import handler404
from core.inicio.views import page_not_found404

#from apps.usuarios.views import LoginUser, UserRegisterView

# handler404 = page_not_found404

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('core.login.urls')),
    path('inicio/', include('core.inicio.urls')),
    path('erp/', include('core.erp.urls')),
    path('reportes/', include('core.reportes.urls')),
    path('user/', include('core.user.urls')),
    path('security/', include('core.security.urls')),
    path('group/', include('core.group.urls')),
    path('solicitudes/', include('core.solicitudes.urls')),
   # path('accounts/login/', LoginUser.as_view(), name='login'),
   # path('accounts/registro/', UserRegisterView.as_view(), name='registro'),
     
     
]
#agregaros al  urlpatterns la url de las imagenes
#if settings.DEBUG:
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)