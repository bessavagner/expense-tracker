from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from tests.base import BaseTestAccounts
from tests.factories import UserFactory
from transactions.models import Currency, Category, CategoryUser, Transaction


class CurrencyModelTest(BaseTestAccounts):
    def test_create_currency(self):
        """Testa a criação de uma moeda."""
        currency = Currency.objects.create(code="USD", name="US Dollar")
        self.assertEqual(currency.code, "USD")
        self.assertEqual(currency.name, "US Dollar")
        self.assertTrue(currency.is_active)

    def test_currency_str_representation(self):
        """Testa a representação em string da moeda."""
        currency = Currency.objects.create(code="BRL", name="Brazilian Real")
        self.assertEqual(str(currency), "BRL - Brazilian Real")

    def test_unique_code_constraint(self):
        """Testa a restrição de código único."""
        Currency.objects.create(code="EUR", name="Euro")
        with self.assertRaises(Exception):
            Currency.objects.create(code="EUR", name="Another Euro")


class CategoryModelTest(BaseTestAccounts):
    def test_create_category(self):
        """Testa a criação de uma categoria."""
        category = Category.objects.create(name="Alimentação")
        self.assertEqual(category.name, "alimentação")  # Nome normalizado para minúsculas
        self.assertTrue(category.is_active)

    def test_category_str_representation(self):
        """Testa a representação em string da categoria."""
        category = Category.objects.create(name="Transporte")
        self.assertEqual(str(category), "transporte")

    def test_name_normalization(self):
        """Testa a normalização do nome da categoria."""
        category = Category.objects.create(name="  LAZER  ")
        self.assertEqual(category.name, "lazer")

    def test_unique_name_constraint(self):
        """Testa a restrição de nome único."""
        Category.objects.create(name="Saúde")
        with self.assertRaises(Exception):
            Category.objects.create(name="saúde")  # Nomes são case-insensitive


class CategoryUserModelTest(BaseTestAccounts):
    def setUp(self):
        self.user = UserFactory()  # Usando UserFactory para criar um usuário
        self.category = Category.objects.create(name="Alimentação")

    def test_create_category_user(self):
        """Testa a criação de um vínculo entre usuário e categoria."""
        category_user = CategoryUser.objects.create(
            user=self.user,
            category=self.category,
            color="#FF5733",
            icon="fa-utensils"
        )
        self.assertEqual(category_user.user, self.user)
        self.assertEqual(category_user.category, self.category)
        self.assertEqual(category_user.color, "#FF5733")
        self.assertEqual(category_user.icon, "fa-utensils")

    def test_unique_together_constraint(self):
        """Testa a restrição de unicidade entre usuário e categoria."""
        CategoryUser.objects.create(user=self.user, category=self.category)
        with self.assertRaises(Exception):
            CategoryUser.objects.create(user=self.user, category=self.category)

    def test_invalid_color_validation(self):
        """Testa a validação de cores hexadecimais."""
        with self.assertRaises(ValidationError):
            category_user = CategoryUser(
                user=self.user,
                category=self.category,
                color="invalid_color"
            )
            category_user.full_clean()


class TransactionModelTest(BaseTestAccounts):
    def setUp(self):
        self.user = UserFactory()  # Usando UserFactory para criar um usuário
        self.currency = Currency.objects.create(code="BRL", name="Brazilian Real")
        self.category = Category.objects.create(name="Alimentação")
        self.category_user = CategoryUser.objects.create(
            user=self.user,
            category=self.category,
            color="#FF5733"
        )

    def test_create_transaction(self):
        """Testa a criação de uma transação."""
        transaction = Transaction.objects.create(
            user=self.user,
            description="Supermercado",
            amount=100.00,
            currency=self.currency,
            date="2024-03-01",
            payment_method="debito",
            transaction_type="expense",
            category=self.category_user
        )
        self.assertEqual(transaction.description, "Supermercado")
        self.assertEqual(transaction.amount, 100.00)
        self.assertEqual(transaction.currency, self.currency)
        self.assertEqual(transaction.category, self.category_user)

    def test_transaction_str_representation(self):
        """Testa a representação em string da transação."""
        transaction = Transaction.objects.create(
            user=self.user,
            description="Supermercado",
            amount=100.00,
            currency=self.currency,
            date="2024-03-01",
            payment_method="debito",
            transaction_type="expense",
            category=self.category_user
        )
        expected_str = f"({self.user.email} - {self.category.name}) {transaction.description} - {self.currency.code} {transaction.amount}"
        self.assertEqual(str(transaction), expected_str)

    def test_transfer_transaction_validation(self):
        """Testa a validação de transferências sem método de pagamento."""
        with self.assertRaises(ValidationError):
            transaction = Transaction(
                user=self.user,
                description="Transferência",
                amount=50.00,
                currency=self.currency,
                date="2024-03-01",
                payment_method="debito",  # Método de pagamento não permitido
                transaction_type="transfer"
            )
            transaction.full_clean()

    def test_income_expense_transaction_validation(self):
        """Testa a validação de transações de receita/despesa com método de pagamento."""
        with self.assertRaises(ValidationError):
            transaction = Transaction(
                user=self.user,
                description="Salário",
                amount=1000.00,
                currency=self.currency,
                date="2024-03-01",
                payment_method="",  # Método de pagamento obrigatório
                transaction_type="income"
            )
            transaction.full_clean()

    def test_category_user_validation(self):
        """Testa a validação de categoria pertencente ao usuário."""
        another_user = UserFactory()  # Usando UserFactory para criar outro usuário
        another_category_user = CategoryUser.objects.create(
            user=another_user,
            category=self.category,
            color="#33FF57"
        )
        with self.assertRaises(ValidationError):
            transaction = Transaction(
                user=self.user,
                description="Supermercado",
                amount=100.00,
                currency=self.currency,
                date="2024-03-01",
                payment_method="debito",
                transaction_type="expense",
                category=another_category_user  # Categoria de outro usuário
            )
            transaction.full_clean()
