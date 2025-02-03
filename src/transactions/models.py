import uuid
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.conf import settings
from django.core.validators import MinValueValidator, RegexValidator
from django.core.exceptions import ValidationError

from .managers import CurrencyManager, CategoryManager, TransactionManager


class Currency(models.Model):
    
    code = models.CharField(
        max_length=3, unique=True, verbose_name=_("Currency Code")
    )
    name = models.CharField(max_length=50, verbose_name=_("Currency Name"))
    is_active = models.BooleanField(default=True, verbose_name=_("Is Active"))

    objects = CurrencyManager()

    class Meta:
        ordering = ["code"]
        verbose_name = _("Currency")
        verbose_name_plural = _("Currencies")

    def __str__(self):
        return f"{self.code} - {self.name}"


class Category(models.Model):
    
    name = models.CharField(max_length=50, unique=True, verbose_name=_("Name"))
    is_active = models.BooleanField(default=True, verbose_name=_("Is Active"))

    objects = CategoryManager()  # Usando o custom manager
    def save(self, *args, **kwargs):
        # Normaliza o nome da categoria
        self.name = self.name.strip().lower()
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = _("Category")
        verbose_name_plural = _("Categories")

    def __str__(self):
        return str(self.name)


class CategoryUser(models.Model):
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="user_categories",
        verbose_name=_("User")
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name="category_users",
        verbose_name=_("Category"),
        validators=[
            RegexValidator(
                regex="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$",
                message="Enter a valid hexadecimal color code."
            )
        ],
    )
    is_default = models.BooleanField(
        default=False, verbose_name=_("Is Default")
    )
    color = models.CharField(
        max_length=7, default="#FFFFFF", verbose_name=_("Color")
    )
    icon = models.CharField(
        max_length=50, blank=True, null=True, verbose_name=_("Icon")
    )

    class Meta:
        verbose_name = _("User Category")
        verbose_name_plural = _("User Categories")
        unique_together = ("user", "category")
        indexes = [
            models.Index(fields=["user"]),
            models.Index(fields=["category"]),
        ]

    def __str__(self):
        return f"{self.user} - {self.category.name}"


class Transaction(models.Model):
    class PaymentMethod(models.TextChoices):
        DINHEIRO = "dinheiro", _("Cash")
        DEBITO = "debito", _("Debit")
        PIX = "pix", _("Pix")

    class TransactionType(models.TextChoices):
        INCOME = "income", _("Income")
        EXPENSE = "expense", _("Expense")
        TRANSFER = "transfer", _("Tranfer")

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="user_transactions"
    )
    description = models.TextField(verbose_name=_("Description"))
    amount = models.DecimalField(
        max_digits=10, decimal_places=2, verbose_name=_("Amount"),
        validators=[MinValueValidator(0)]
    )
    currency = models.ForeignKey(
        Currency,
        on_delete=models.PROTECT,
        verbose_name=_("Currency"),
        default=1
    )
    date = models.DateField(verbose_name=_("Date"))
    payment_method = models.CharField(
        max_length=20,
        choices=PaymentMethod.choices,
        verbose_name=_("Payment Method")
    )
    transaction_type = models.CharField(
        max_length=10,
        choices=TransactionType.choices,
        verbose_name=_("Transaction Type")
    )
    category = models.ForeignKey(
        CategoryUser,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name=_("Category")
    )
    created_at = models.DateTimeField(
        auto_now_add=True, verbose_name=_("Created at")
    )
    updated_at = models.DateTimeField(
        auto_now=True, verbose_name=_("Updated at")
    )
    is_deleted = models.BooleanField(default=False, verbose_name=_("Deleted"))

    objects = TransactionManager()
    class Meta:
        ordering = ["-date"]
        verbose_name = _("Transaction")
        verbose_name_plural = _("Transactions")
        indexes = [
            models.Index(fields=["user"]),
            models.Index(fields=["date"]),
            models.Index(fields=["payment_method"]),
            models.Index(fields=["category"]),
        ]

    def __str__(self):
        code = getattr(self.currency, "code")
        return f"({self.category}) {self.description} - {code} {self.amount}"

    def clean(self):
        """Ensure TRANSFER transactions don’t have a payment method."""
        if self.transaction_type == self.TransactionType.TRANSFER and self.payment_method:
            raise ValidationError(_("Transfers should not have a payment method."))
        elif self.transaction_type in [self.TransactionType.INCOME, self.TransactionType.EXPENSE] and not self.payment_method:
            raise ValidationError(_("Income and expense transactions must have a payment method."))
        category_user = getattr(self.category, "user")
        if self.category and category_user != self.user:
            raise ValidationError(_("Category does not belong to the user."))

    def save(self, *args, **kwargs):
        """Run model validation before saving."""
        self.clean()
        super().save(*args, **kwargs)
