import logging

from django.urls import reverse_lazy
from django.contrib.auth.views import LoginView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.mixins import UserPassesTestMixin
from django.contrib.auth.forms import PasswordChangeForm
from django.contrib.messages.views import SuccessMessageMixin

from django.contrib.auth import update_session_auth_hash

from allauth.account.views import SignupView as AllauthSignupView
from allauth.account.views import EmailView as AllauthEmailView
from allauth.account.views import ConfirmEmailView as AllauthConfirmEmailView
from allauth.account.views import (
    PasswordChangeView as AllauthPasswordChangeView
)

from .forms import CustomUserCreationForm

logger = logging.getLogger('account.views')


class CustomLoginView(LoginView):
    
    template_name = "account/login.html"
    success_url = reverse_lazy('home')


class SignupView(AllauthSignupView):
    
    form_class = CustomUserCreationForm
    template_name = "account/signup.html"
    success_url = reverse_lazy("login")


class CustomConfirmEmailView(AllauthConfirmEmailView):

    template_name = "account/email_confirm.html"


class EmailView(AllauthEmailView):

    template_name = "account/email.html"


class PasswordChangeView(
    LoginRequiredMixin,
    UserPassesTestMixin,
    SuccessMessageMixin,
    AllauthPasswordChangeView
):
    
    form_class = PasswordChangeForm
    template_name = "account/password_change.html"
    success_url = reverse_lazy('home')

    def form_valid(self, form):
        response = super().form_valid(form)
        update_session_auth_hash(self.request, form.user)
        return response
