from django.core.management.base import BaseCommand
from transactions.models import Category

class Command(BaseCommand):
    help = "Popula o banco de dados com categorias padrão."

    def handle(self, *args, **kwargs):
        # Lista de categorias padrão
        default_categories = [
            {"name": "Alimentação", "color": "#FF5733"},
            {"name": "Transporte", "color": "#33FF57"},
            {"name": "Lazer", "color": "#3357FF"},
            {"name": "Educação", "color": "#FFC300"},
            {"name": "Saúde", "color": "#C70039"},
            {"name": "Moradia", "color": "#900C3F"},
            {"name": "Investimentos", "color": "#581845"},
            {"name": "Outros", "color": "#808080"},
        ]

        # Cria as categorias padrão
        for category_data in default_categories:
            category, created = Category.objects.get_or_create(**category_data)
            if created:
                self.stdout.write(self.style.SUCCESS(f"Categoria '{category.name}' criada com sucesso."))
            else:
                self.stdout.write(self.style.WARNING(f"Categoria '{category.name}' já existe."))

        self.stdout.write(self.style.SUCCESS("Categorias padrão populadas com sucesso!"))
