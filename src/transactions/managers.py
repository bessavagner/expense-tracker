import logging
from django.db import models
from django.utils import timezone
from django.db.models import Sum
from django.core.exceptions import ObjectDoesNotExist

from django.apps import apps


logger = logging.getLogger('transactions.managers')


class CurrencyManager(models.Manager):
    def get_by_code(self, code):
        """Get a currency by its code."""
        try:
            return self.get(code=code)
        except ObjectDoesNotExist:
            logger.warning("Currency with code %s does not exist.", code)
            return None

    def get_all_codes(self):
        """Get all available currency codes."""
        return self.values_list('code', flat=True)

    def get_active_currencies(self):
        """Get all active currencies."""
        return self.filter(is_active=True)

class CategoryManager(models.Manager):
    def get_by_name(self, name):
        """
        Retorna uma categoria pelo nome (case-insensitive).
        """
        try:
            return self.get(name__iexact=name.strip().lower())
        except ObjectDoesNotExist:
            logger.warning("Categoria '%s' não encontrada.", name)
            return None

    def get_or_create_by_name(self, name):
        """
        Obtém ou cria uma categoria pelo nome (case-insensitive).
        """
        name = name.strip().lower()
        category, created = self.get_or_create(name=name)
        if created:
            logger.info("Categoria '%s' criada com sucesso.", name)
        return category

    def get_active_categories(self):
        """
        Retorna todas as categorias ativas
        """
        return self.filter(is_active=True)


class TransactionManager(models.Manager):
    def for_user(self, user):
        """Returns transactions for a specific user."""
        return self.filter(user=user)

    def income(self, user=None):
        """Returns income transactions (optionally for a specific user)."""
        Transaction = apps.get_model('transactions', 'Transaction')  # Lazy reference
        query = self.filter(transaction_type=Transaction.TransactionType.INCOME)
        if user:
            query = query.filter(user=user)
        return query

    def expense(self, user=None):
        """Returns expense transactions (optionally for a specific user)."""
        Transaction = apps.get_model('transactions', 'Transaction')  # Lazy reference
        query = self.filter(transaction_type=Transaction.TransactionType.EXPENSE)
        if user:
            query = query.filter(user=user)
        return query

    def transfer(self, user=None):
        """Returns transfer transactions (optionally for a specific user)."""
        Transaction = apps.get_model('transactions', 'Transaction')  # Lazy reference
        query = self.filter(transaction_type=Transaction.TransactionType.TRANSFER)
        if user:
            query = query.filter(user=user)
        return query

    def by_payment_method(self, payment_method, user=None):
        """Returns transactions by payment method (optionally for a specific user)."""
        query = self.filter(payment_method=payment_method)
        if user:
            query = query.filter(user=user)
        return query

    def by_category(self, category, user=None):
        """Returns transactions by category (optionally for a specific user)."""
        query = self.filter(category=category)
        if user:
            query = query.filter(user=user)
        return query

    def total_amount(self, user=None):
        """Returns the total amount of all transactions (optionally for a specific user)."""
        query = self.all()
        if user:
            query = query.filter(user=user)
        return query.aggregate(total_amount=Sum('amount'))['total_amount'] or 0

    def total_income(self, user=None):
        """Returns the total income amount (optionally for a specific user)."""
        return self.income(user).aggregate(total_income=Sum('amount'))['total_income'] or 0

    def total_expense(self, user=None):
        """Returns the total expense amount (optionally for a specific user)."""
        return self.expense(user).aggregate(total_expense=Sum('amount'))['total_expense'] or 0

    def net_balance(self, user=None):
        """Returns the net balance (income - expense) for a user."""
        total_income = self.total_income(user)
        total_expense = self.total_expense(user)
        return total_income - total_expense

    def recent_transactions(self, days=30, user=None):
        """Returns transactions from the last `days` days (optionally for a specific user)."""
        start_date = timezone.now() - timezone.timedelta(days=days)
        query = self.filter(date__gte=start_date)
        if user:
            query = query.filter(user=user)
        return query

    def deleted_transactions(self, user=None):
        """Returns deleted transactions (optionally for a specific user)."""
        query = self.filter(is_deleted=True)
        if user:
            query = query.filter(user=user)
        return query

    def active_transactions(self, user=None):
        """Returns non-deleted transactions (optionally for a specific user)."""
        query = self.filter(is_deleted=False)
        if user:
            query = query.filter(user=user)
        return query
