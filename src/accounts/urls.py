from django.urls import path
from .views import CustomLoginView, SignupView, PasswordChangeView

app_name = 'accounts'

urlpatterns = [
    path('login/', CustomLoginView.as_view(), name='login'),
    path('signup/', SignupView.as_view(), name='signup'),
    path('password_change/', PasswordChangeView.as_view(), name='password_change'),
]
