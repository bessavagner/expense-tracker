# Generated by Django 5.1.5 on 2025-02-03 22:56

import django.core.validators
import django.db.models.deletion
import uuid
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Category",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "name",
                    models.CharField(max_length=50, unique=True, verbose_name="Name"),
                ),
                (
                    "is_active",
                    models.BooleanField(default=True, verbose_name="Is Active"),
                ),
            ],
            options={
                "verbose_name": "Category",
                "verbose_name_plural": "Categories",
            },
        ),
        migrations.CreateModel(
            name="Currency",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "code",
                    models.CharField(
                        max_length=3, unique=True, verbose_name="Currency Code"
                    ),
                ),
                ("name", models.CharField(max_length=50, verbose_name="Currency Name")),
                (
                    "is_active",
                    models.BooleanField(default=True, verbose_name="Is Active"),
                ),
            ],
            options={
                "verbose_name": "Currency",
                "verbose_name_plural": "Currencies",
                "ordering": ["code"],
            },
        ),
        migrations.CreateModel(
            name="CategoryUser",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "is_default",
                    models.BooleanField(default=False, verbose_name="Is Default"),
                ),
                (
                    "color",
                    models.CharField(
                        default="#FFFFFF", max_length=7, verbose_name="Color"
                    ),
                ),
                (
                    "icon",
                    models.CharField(
                        blank=True, max_length=50, null=True, verbose_name="Icon"
                    ),
                ),
                (
                    "category",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="category_users",
                        to="transactions.category",
                        validators=[
                            django.core.validators.RegexValidator(
                                message="Enter a valid hexadecimal color code.",
                                regex="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$",
                            )
                        ],
                        verbose_name="Category",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="user_categories",
                        to=settings.AUTH_USER_MODEL,
                        verbose_name="User",
                    ),
                ),
            ],
            options={
                "verbose_name": "User Category",
                "verbose_name_plural": "User Categories",
            },
        ),
        migrations.CreateModel(
            name="Transaction",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                ("description", models.TextField(verbose_name="Description")),
                (
                    "amount",
                    models.DecimalField(
                        decimal_places=2,
                        max_digits=10,
                        validators=[django.core.validators.MinValueValidator(0)],
                        verbose_name="Amount",
                    ),
                ),
                ("date", models.DateField(verbose_name="Date")),
                (
                    "payment_method",
                    models.CharField(
                        choices=[
                            ("dinheiro", "Cash"),
                            ("debito", "Debit"),
                            ("pix", "Pix"),
                        ],
                        max_length=20,
                        verbose_name="Payment Method",
                    ),
                ),
                (
                    "transaction_type",
                    models.CharField(
                        choices=[
                            ("income", "Income"),
                            ("expense", "Expense"),
                            ("transfer", "Tranfer"),
                        ],
                        max_length=10,
                        verbose_name="Transaction Type",
                    ),
                ),
                (
                    "created_at",
                    models.DateTimeField(auto_now_add=True, verbose_name="Created at"),
                ),
                (
                    "updated_at",
                    models.DateTimeField(auto_now=True, verbose_name="Updated at"),
                ),
                (
                    "is_deleted",
                    models.BooleanField(default=False, verbose_name="Deleted"),
                ),
                (
                    "category",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        to="transactions.categoryuser",
                        verbose_name="Category",
                    ),
                ),
                (
                    "currency",
                    models.ForeignKey(
                        default=1,
                        on_delete=django.db.models.deletion.PROTECT,
                        to="transactions.currency",
                        verbose_name="Currency",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="user_transactions",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "verbose_name": "Transaction",
                "verbose_name_plural": "Transactions",
                "ordering": ["-date"],
            },
        ),
        migrations.AddIndex(
            model_name="categoryuser",
            index=models.Index(fields=["user"], name="transaction_user_id_337a87_idx"),
        ),
        migrations.AddIndex(
            model_name="categoryuser",
            index=models.Index(
                fields=["category"], name="transaction_categor_cdfb1a_idx"
            ),
        ),
        migrations.AlterUniqueTogether(
            name="categoryuser",
            unique_together={("user", "category")},
        ),
        migrations.AddIndex(
            model_name="transaction",
            index=models.Index(fields=["user"], name="transaction_user_id_b60ed6_idx"),
        ),
        migrations.AddIndex(
            model_name="transaction",
            index=models.Index(fields=["date"], name="transaction_date_ad8c94_idx"),
        ),
        migrations.AddIndex(
            model_name="transaction",
            index=models.Index(
                fields=["payment_method"], name="transaction_payment_77b5ab_idx"
            ),
        ),
        migrations.AddIndex(
            model_name="transaction",
            index=models.Index(
                fields=["category"], name="transaction_categor_e3f163_idx"
            ),
        ),
    ]
