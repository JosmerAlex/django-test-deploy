from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from core.user.models import User
from core.erp.models import *

# @receiver([post_save, post_delete])
# def log_user_activity(sender, **kwargs):  # Modificación here
#     user = kwargs['instance'].user  # Modificación here
#     action = 'Created' if created else 'Updated' if kwargs.get('updated_fields') else 'Deleted'  # Modificación here
#     object_name = sender.name
#     object_id = kwargs['instance'].id
#     ip_address = kwargs['request'].META.get('REMOTE_ADDR') if 'request' in kwargs else None  # Modificación here

#     UserActivity.objects.create(
#         user=user,
#         action=action,
#         object_name=object_name,
#         object_id=object_id,
#         ip_address=ip_address,
#     )









# @receiver(post_save)
# def audit_log(sender, instance, created, raw, update_fields, **kwargs):
#   #Lista de los modelos que se requienran que escuche
#     list_of_models = ['Categoria']
#     if sender.__name__ not in list_of_models:
#         return
#     user = get_user()
#     if created:
#         instance.save_addition(user)
#     elif not raw:
#         instance.save_edition(user)

# @receiver(post_delete)
# def audit_delete_log(sender, instance, **kwargs):
#   #Lista de los modelos que se requienran que escuche  
#     list_of_models = ['Categoria']
#     if sender.__name__ not in list_of_models:
#         return
#     user = get_user() 
#     instance.save_deletion(user)

# def get_user():
#     thread_local = RequestMiddleware.thread_local
#     if hasattr(thread_local, user):
#         user = thread_local.user
#     else:
#         user = None
#     return user