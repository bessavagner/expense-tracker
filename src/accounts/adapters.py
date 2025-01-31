import logging

from django.contrib.auth import get_user_model

from allauth.account.adapter import DefaultAccountAdapter

logger = logging.getLogger('accounts.adapters')

User = get_user_model()

class CustomAccountAdapter(DefaultAccountAdapter):
    
    def get_email_confirmation_url(self, request, emailconfirmation):
        logger.debug('get_email_confirmation_url - emailconfirmation: %s', emailconfirmation)
        logger.debug('get_email_confirmation_url - request: %s', request)
        return super().get_email_confirmation_url(request, emailconfirmation)
