import logging
from django.urls import reverse_lazy
from django.contrib.auth.views import LoginView
from django.views.generic.edit import FormView
from .forms import CustomUserCreationForm

logger = logging.getLogger('account.views')


class CustomLoginView(LoginView):
    template_name = 'accounts/login.html'
    success_url = reverse_lazy('home')

class SignupView(FormView):
    form_class = CustomUserCreationForm
    success_url = reverse_lazy("login")
    template_name = "accounts/signup.html"

    def form_valid(self, form):
        user = form.save()
        logger.debug(user)
        return super().form_valid(form)
