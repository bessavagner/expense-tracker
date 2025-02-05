from django.core.management.base import BaseCommand
from django.db.utils import IntegrityError
from transactions.models import Category

class Command(BaseCommand):
    help = "Popula o banco de dados com categorias padrão."

    def handle(self, *args, **kwargs):
        # Lista de categorias padrão
        default_categories = [
            {"name": "Alimentação"},
            {"name": "Transporte"},
            {"name": "Lazer"},
            {"name": "Educação"},
            {"name": "Saúde"},
            {"name": "Moradia"},
            {"name": "Investimentos"},
            {"name": "Outros"},
        ]

        # Cria as categorias padrão
        for category_data in default_categories:
            category, created = Category.objects.get_or_create_by_name(**category_data)
            if created:
                try:
                    self.stdout.write(self.style.SUCCESS(f"Categoria '{category.name}' criada com sucesso."))
                    self.stdout.write(self.style.SUCCESS("Categorias padrão populadas com sucesso!"))
                except IntegrityError:
                    self.stdout.write(self.style.ERROR(f"Erro ao criar categoria '{category.name}'."))
            else:
                self.stdout.write(self.style.WARNING(f"Categoria '{category.name}' já existe."))

