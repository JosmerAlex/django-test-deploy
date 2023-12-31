import sys
import tempfile
import os
import json

from django.shortcuts import  redirect, HttpResponse, render
from django.views.generic import TemplateView, View
from django.http import JsonResponse
from django.contrib.auth.mixins import LoginRequiredMixin
from core.erp.mixins import Perms_Check
from django.urls import reverse_lazy
from datetime import datetime, timedelta
from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
from apscheduler.schedulers.background import BackgroundScheduler
# IMPORTACIONES PARA EJECUTAR COMANDOS SHELL DESDE LA PROGRAMACIÓN
from django.core import management
from django.core.management.commands import loaddata


class RespaldoDB(LoginRequiredMixin, Perms_Check, TemplateView):
	template_name = "respaldo_bd/respaldo_bd.html"
	permission_required = 'user.add_user'

	def post(self, request, *args, **kwargs):
		data = {}
		try:
			action = request.POST.get('action')
			
			if action == 'validar_datos_administrador':
				username = request.POST['username']
				pass_actual = request.POST['password1']
				user = authenticate(request, username=username, password=pass_actual)
				if user is not None:
					return redirect('/erp/respaldar_bd/')
				else:
					data['error'] = "CONTRASEÑA INCORRECTA" 

			elif action == 'restaurar_db':
				archivo = request.FILES['upload_db']
				username = request.POST['username']
				pass_actual = request.POST['password1']
				user = authenticate(request, username=username, password=pass_actual)

				if user is not None:

					with open('data.json', 'wb+') as file:
						for chunk in archivo.chunks():
							file.write(chunk)
							
					management.call_command('loaddata', 'data.json', verbosity=0)

					os.remove('data.json')
				else:
					data['error'] = "CONTRASEÑA INCORRECTA" 
			
			else:
				data['error'] = 'Ha ocurrido un error'           

		except Exception as e:
			data['error'] = str(e)
		return JsonResponse(data, safe=False)
	
	def get_context_data(self, **kwargs):
		context = super(RespaldoDB, self).get_context_data(**kwargs)
		context['entity'] = 'Backup' 
		context['title'] = 'Respaldo de la Base de Datos' 
		return context


class RespaldarBD(LoginRequiredMixin, Perms_Check, View):
	permission_required = 'user.add_user'

	def get(self, request, *args, **kwargs):

		sysout = sys.stdout
		fecha = datetime.today().strftime('%y_%m_%d_%H_%M')        
		response = HttpResponse(content_type='application/json')
		# response['Content-Disposition'] = "C:\\RespaldoBD\\base\\backup_"+str(fecha)+".json"
		response['Content-Disposition'] = f'attachment; filename=database[{datetime.now()}].json'
		
		sys.stdout = response
		management.call_command('dumpdata', indent=4)
		sys.stdout = sysout
		return response


	