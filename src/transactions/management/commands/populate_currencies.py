from django.core.management.base import BaseCommand
from transactions.models import Currency


class Command(BaseCommand):
    help = "Populates the Currency table with default currencies"

    def handle(self, *args, **kwargs):
        currencies = [
            {"code": "BRL", "name": "Brazilian Real"},
            {"code": "USD", "name": "US Dollar"},
            {"code": "EUR", "name": "Euro"},
        ]
        
        for currency_data in currencies:
            currency, created = Currency.objects.get_or_create(
                code=currency_data["code"],
                defaults={"name": currency_data["name"]},
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f"Created {currency.code} - {currency.name}"))
            else:
                self.stdout.write(self.style.WARNING(f"{currency.code} - {currency.name} already exists"))
