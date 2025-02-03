from django.urls import path
from .views import LoginView, SignupView, PasswordChangeView, EmailView

app_name = 'accounts'

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('signup/', SignupView.as_view(), name='signup'),
    path('email/', EmailView.as_view(), name='email'),
    path('password_change/', PasswordChangeView.as_view(), name='password_change'),
]
