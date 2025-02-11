from django.urls import path
from .views import (
    TransactionView,
    TransactionCreateView,
    TransactionListView,
    TransactionContextView,
)

app_name = 'transactions'

urlpatterns = [
    path('', TransactionView.as_view(), name='transaction'),
    path('create/', TransactionCreateView.as_view(), name='transaction_create'),
    path('list/', TransactionListView.as_view(), name='transaction_list'),
    path('context/', TransactionContextView.as_view(), name='transaction_context'),
]
