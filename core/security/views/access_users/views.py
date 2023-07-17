from django.http import JsonResponse
from django.urls import reverse_lazy
from django.views.generic import FormView, DeleteView
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from core.erp.mixins import ValidatePermissionRequiredMixin, Perms_Check
from core.reportes.forms import ReportForm
from core.security.models import AccessUsers


class AccessUsersListView(Perms_Check, FormView):
    form_class = ReportForm
    template_name = 'access_users/list.html'
    permission_required = 'security.view_access_users'

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            action = request.POST['action']
            if action == 'searchdata':
                data = []
                start_date = request.POST['start_date']
                end_date = request.POST['end_date']
                queryset = AccessUsers.objects.all()
                if len(start_date) and len(end_date):
                    queryset = queryset.filter(date_joined__range=[start_date, end_date])
                for i in queryset:
                    data.append(i.toJSON())
            else:
                data['error'] = 'Ha ocurrido un error'
        except Exception as e:
            data['error'] = str(e)
        return JsonResponse(data, safe=False)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Listado de Accesos de Usuarios'
        context['list_url'] = reverse_lazy('security:access_users_list')
        context['entity'] = 'Accesos de Usuarios'
        return context

class AccessUsersDeleteView(Perms_Check, DeleteView):
    model = AccessUsers
    permission_required = 'security.delete_access_users'
    
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        self.object = self.get_object()
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            perms = ('security.delete_access_users',)
            if request.user.has_perms(perms):
                self.object.delete()
            else:
                data['error'] = 'No tiene permisos para realizar esta acción'
        except Exception as e:
            data['error'] = str(e)
        return JsonResponse(data)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        return context