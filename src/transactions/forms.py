from django import forms
from .models import Transaction

class TransactionForm(forms.ModelForm):
    class Meta:
        model = Transaction
        fields = ['description', 'amount', 'date', 'payment_method', 'transaction_type']
        widgets = {
            'date': forms.DateInput(attrs={'type': 'date'}),
        }
