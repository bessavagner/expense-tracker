from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import UserChangeForm

from django.utils.translation import gettext_lazy

from .forms import CustomUserCreationForm
from .models import User

class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = UserChangeForm
    model = User
    list_display = ("email", "is_active")
    list_filter = ("email",)
    fieldsets = (
        (
            None, {
                "fields": ("email", "password")
            }
        ),
        (
            gettext_lazy("Permissions"), {
                "fields": (
                    "is_staff",
                    "is_active",
                    "groups",
                    "user_permissions"
                )
            }
        ),
    )
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": (
                "email",
                "password1",
                "password2",
                "is_active",
                "groups",
                "user_permissions"
            )}
         ),
    )
    search_fields = ("email",)
    ordering = ("email",)


admin.site.register(User, CustomUserAdmin)
