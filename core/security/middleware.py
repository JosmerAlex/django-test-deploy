# import threading
#from core.security.models import UserActivity


# class UserActivityMiddleware:
#     def __init__(self, get_response):
#         self.get_response = get_response

#     def __call__(self, request):
#         response = self.get_response(request)
#         UserActivity.objects.create(
#             user=request.user,
#             action=request.method,
#             object_name=request.path_info,
#             object_id=None,
#             ip_address=request.META.get('REMOTE_ADDR'),
#         )
#         return response



# class RequestMiddleware(object):
#     thread_local = threading.local()
#     def __init__(self, get_response):
#         self.get_response = get_response
#     def __call__(self, request):
#         # Almacenamos en el usuario que esta en el request
#         self.thread_local.user = request.user
#         response = self.get_response(request)
#         return response 