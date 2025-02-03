from django.test import TestCase
from django.utils import timezone
from django.contrib.auth import get_user_model
from transactions.models import Currency, Category, CategoryUser, Transaction
from transactions.managers import TransactionManager
from tests.factories import UserFactory

User = get_user_model()


class TransactionManagerTest(TestCase):
    def setUp(self):
        # Create test data
        self.user = UserFactory()
        self.currency = Currency.objects.create(code="BRL", name="Brazilian Real")
        self.category = Category.objects.create(name="alimentação")
        self.category_user = CategoryUser.objects.create(
            user=self.user,
            category=self.category,
            color="#FF5733"
        )

        # Create transactions for testing
        self.income_transaction = Transaction.objects.create(
            user=self.user,
            description="Salary",
            amount=1000.00,
            currency=self.currency,
            date=timezone.now().date(),
            payment_method="debito",
            transaction_type=Transaction.TransactionType.INCOME,
            category=self.category_user
        )
        self.expense_transaction = Transaction.objects.create(
            user=self.user,
            description="Groceries",
            amount=200.00,
            currency=self.currency,
            date=timezone.now().date(),
            payment_method="debito",
            transaction_type=Transaction.TransactionType.EXPENSE,
            category=self.category_user
        )
        self.transfer_transaction = Transaction.objects.create(
            user=self.user,
            description="Transfer to Savings",
            amount=300.00,
            currency=self.currency,
            date=timezone.now().date(),
            payment_method="",  # Transfers don't have a payment method
            transaction_type=Transaction.TransactionType.TRANSFER,
            category=self.category_user
        )

    def test_for_user(self):
        """Test filtering transactions for a specific user."""
        transactions = Transaction.objects.for_user(self.user)
        self.assertEqual(transactions.count(), 3)
        self.assertIn(self.income_transaction, transactions)
        self.assertIn(self.expense_transaction, transactions)
        self.assertIn(self.transfer_transaction, transactions)

    def test_income(self):
        """Test filtering income transactions."""
        income_transactions = Transaction.objects.income(self.user)
        self.assertEqual(income_transactions.count(), 1)
        self.assertIn(self.income_transaction, income_transactions)

    def test_expense(self):
        """Test filtering expense transactions."""
        expense_transactions = Transaction.objects.expense(self.user)
        self.assertEqual(expense_transactions.count(), 1)
        self.assertIn(self.expense_transaction, expense_transactions)

    def test_transfer(self):
        """Test filtering transfer transactions."""
        transfer_transactions = Transaction.objects.transfer(self.user)
        self.assertEqual(transfer_transactions.count(), 1)
        self.assertIn(self.transfer_transaction, transfer_transactions)

    def test_by_payment_method(self):
        """Test filtering transactions by payment method."""
        debit_transactions = Transaction.objects.by_payment_method("debito", self.user)
        self.assertEqual(debit_transactions.count(), 2)
        self.assertIn(self.income_transaction, debit_transactions)
        self.assertIn(self.expense_transaction, debit_transactions)

    def test_by_category(self):
        """Test filtering transactions by category."""
        category_transactions = Transaction.objects.by_category(self.category_user, self.user)
        self.assertEqual(category_transactions.count(), 3)
        self.assertIn(self.income_transaction, category_transactions)
        self.assertIn(self.expense_transaction, category_transactions)
        self.assertIn(self.transfer_transaction, category_transactions)

    def test_total_amount(self):
        """Test calculating the total amount of transactions."""
        total_amount = Transaction.objects.total_amount(self.user)
        self.assertEqual(total_amount, 1500.00)  # 1000 (income) + 200 (expense) + 300 (transfer)

    def test_total_income(self):
        """Test calculating the total income."""
        total_income = Transaction.objects.total_income(self.user)
        self.assertEqual(total_income, 1000.00)

    def test_total_expense(self):
        """Test calculating the total expense."""
        total_expense = Transaction.objects.total_expense(self.user)
        self.assertEqual(total_expense, 200.00)

    def test_net_balance(self):
        """Test calculating the net balance (income - expense)."""
        net_balance = Transaction.objects.net_balance(self.user)
        self.assertEqual(net_balance, 800.00)  # 1000 (income) - 200 (expense)

    def test_recent_transactions(self):
        """Test filtering recent transactions."""
        recent_transactions = Transaction.objects.recent_transactions(days=30, user=self.user)
        self.assertEqual(recent_transactions.count(), 3)
        self.assertIn(self.income_transaction, recent_transactions)
        self.assertIn(self.expense_transaction, recent_transactions)
        self.assertIn(self.transfer_transaction, recent_transactions)

    def test_deleted_transactions(self):
        """Test filtering deleted transactions."""
        self.income_transaction.is_deleted = True
        self.income_transaction.save()
        deleted_transactions = Transaction.objects.deleted_transactions(self.user)
        self.assertEqual(deleted_transactions.count(), 1)
        self.assertIn(self.income_transaction, deleted_transactions)

    def test_active_transactions(self):
        """Test filtering active (non-deleted) transactions."""
        self.income_transaction.is_deleted = True
        self.income_transaction.save()
        active_transactions = Transaction.objects.active_transactions(self.user)
        self.assertEqual(active_transactions.count(), 2)
        self.assertIn(self.expense_transaction, active_transactions)
        self.assertIn(self.transfer_transaction, active_transactions)
