from django.db import IntegrityError
from django.test import TestCase
from tests.factories import UserFactory


class TestUserModel(TestCase):
    def test_create_user(self):
        user = UserFactory()
        self.assertIsNotNone(user.pk)

    def test_user_fields(self):
        user = UserFactory(email="test@example.com", first_name="John", last_name="Doe")
        self.assertEqual(user.email, "test@example.com")
        self.assertEqual(user.first_name, "John")
        self.assertEqual(user.last_name, "Doe")

    def test_duplicate_email(self):
        user1 = UserFactory(email="duplicate@example.com")
        with self.assertRaises(IntegrityError):
            UserFactory(email="duplicate@example.com")

    def test_password_is_hashed(self):
        password = "mysecretpassword"
        user = UserFactory(password=password)
        self.assertTrue(user.check_password(password))
