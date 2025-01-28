from django import forms
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.forms import UserCreationForm
from allauth.account.forms import SignupForm

class CustomUserCreationForm(SignupForm):

    class Meta(UserCreationForm):
        model = get_user_model()
        fields = ('email', "password1", "password2",)


class UserDeletionForm(forms.Form):
    
    is_active = forms.BooleanField(
        widget=forms.HiddenInput(),
        initial=False,
        required=False
    )
