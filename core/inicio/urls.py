from django.urls import path
from core.inicio import views


app_name = 'index_app'
urlpatterns = [
   #path('', views.DashboardView, name="Index"),
   path('', views.IndexView.as_view(), name="Index"),



]
