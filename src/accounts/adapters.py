import logging

from django.contrib.auth import get_user_model

from allauth.account.adapter import DefaultAccountAdapter

logger = logging.getLogger('accounts.adapters')

User = get_user_model()

class CustomAccountAdapter(DefaultAccountAdapter):
    
    def get_email_confirmation_url(self, request, emailconfirmation):
        return super().get_email_confirmation_url(request, emailconfirmation)
