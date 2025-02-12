from django.shortcuts import render
from django.views import View
from django.views.generic import TemplateView
from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.mixins import UserPassesTestMixin
from .models import Transaction
from .forms import TransactionForm
from .contexts import TRANSACTION_FORM_INPUTS, TRANSACTIONS_COLUMNS


class TransactionView(LoginRequiredMixin, TemplateView):
    template_name = 'transactions/main.html'


class TransactionCreateView(LoginRequiredMixin, View):
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request):
        form = TransactionForm(request.POST)
        if form.is_valid():
            transaction = form.save(commit=False)
            transaction.user = request.user  # Associa o usuário logado
            transaction.save()
            return JsonResponse({'status': 'success', 'message': 'Transação adicionada com sucesso!'})
        else:
            return JsonResponse({'status': 'error', 'errors': form.errors}, status=400)

class TransactionListView(LoginRequiredMixin, View):
    def get(self, request):
        transactions = Transaction.objects.filter(user=request.user).order_by('-date')
        data = [
            {
                str(TRANSACTIONS_COLUMNS[0]): t.date.strftime('%Y-%m-%d'),
                str(TRANSACTIONS_COLUMNS[1]): str(t.amount),
                str(TRANSACTIONS_COLUMNS[2]): t.description,
                str(TRANSACTIONS_COLUMNS[3]): t.get_payment_method_display(),
                str(TRANSACTIONS_COLUMNS[4]): t.get_transaction_type_display(),
            }
            for t in transactions
        ]
        response = {
            "rows": data,
            "columns": TRANSACTIONS_COLUMNS
        }
        return JsonResponse(response, safe=False)


class TransactionContextView(LoginRequiredMixin, View):
    def get(self, request):
        context = {
            "inputs": {
                "transactionsForm": TRANSACTION_FORM_INPUTS
            }
        }
        return JsonResponse(context)
