import logging
from django.urls import reverse_lazy
from django.contrib.auth.views import LoginView

logger = logging.getLogger('standard')


class CustomLoginView(LoginView):
    template_name = 'accounts/login.html'
    success_url = reverse_lazy('home')
