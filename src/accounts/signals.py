# pylint: disable=unused-argument
import logging

from django.dispatch import receiver

from allauth.account.signals import email_confirmed

logger = logging.getLogger('accounts.signal')

@receiver(email_confirmed)
def set_user_verified(sender, **kwargs):
    user = kwargs['email_address'].user
    logger.debug("Email confrimed: %s", user)
    user.is_verified = True
    user.save()
