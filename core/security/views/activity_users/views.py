from django.http import JsonResponse
from django.urls import reverse_lazy
from django.views.generic import FormView, DeleteView
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from core.erp.mixins import ValidatePermissionRequiredMixin, Perms_Check
from core.reportes.forms import ReportForm
from core.security.models import AccessUsers


