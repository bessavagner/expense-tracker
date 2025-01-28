from django.test import TestCase
from django.contrib.auth import get_user_model

User = get_user_model()


class BaseTestAccounts(TestCase):
    """Base class for reusable test setup and utility methods."""

    def create_user(self, email="test@example.com", password="mysecretpassword", **kwargs):
        """Create and return a user."""
        return User.objects.create_user(email=email, password=password, **kwargs)
