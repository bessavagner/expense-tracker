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
from .contexts import TRANSACTION_FORM_INPUTS


class TransactionView(LoginRequiredMixin, TemplateView):
    template_name = 'transactions/main.html'


class TransactionCreateView(LoginRequiredMixin, UserPassesTestMixin, View):
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

class TransactionListView(LoginRequiredMixin, UserPassesTestMixin, View):
    def get(self, request):
        transactions = Transaction.objects.filter(user=request.user).order_by('-date')
        data = [
            {
                'description': t.description,
                'amount': str(t.amount),
                'date': t.date.strftime('%Y-%m-%d'),
                'payment_method': t.get_payment_method_display(),
                'transaction_type': t.get_transaction_type_display(),
            }
            for t in transactions
        ]
        return JsonResponse(data, safe=False)


class TransactionContextView(LoginRequiredMixin, UserPassesTestMixin, View):
    def get(self, request):
        context = {
            "inputs": {
                "transactionsForm": TRANSACTION_FORM_INPUTS
            }
        }
        return JsonResponse(context)
