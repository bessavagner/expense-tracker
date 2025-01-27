import uuid

from django.db import models
from django.utils import timezone
from django.core.validators import EmailValidator
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import AbstractUser, PermissionsMixin

from .managers import UserManager


class User(AbstractUser, PermissionsMixin):
    """Custom user model"""

    username = None

    uuid = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        unique=True,
        editable=False
    )

    email = models.EmailField(
        _("email address"),
        unique=True,
        null=False,
        blank=False,
        validators=(
            EmailValidator(
                message=_("Please use a valid email format")
            ),
        )
    )
    is_staff = models.BooleanField(verbose_name=_('staff'), default=False)
    is_active = models.BooleanField(verbose_name=_('active'), default=True)
    date_joined = models.DateTimeField(default=timezone.now)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return f"{self.email}"
