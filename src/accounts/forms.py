from django import forms
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.forms import UserCreationForm

from .models import User


class CustomUserCreationForm(UserCreationForm):

    class Meta(UserCreationForm):
        model = get_user_model()
        fields = ('email',)


class UserDeletionForm(forms.Form):
    
    is_active = forms.BooleanField(
        widget=forms.HiddenInput(),
        initial=False,
        required=False
    )
