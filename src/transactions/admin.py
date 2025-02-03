from django.contrib import admin
from .models import Currency, Category, CategoryUser, Transaction

admin.site.register(Currency)
admin.site.register(Category)
admin.site.register(CategoryUser)
admin.site.register(Transaction)
