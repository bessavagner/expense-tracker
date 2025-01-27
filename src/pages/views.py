import logging
from django.views.generic import TemplateView
from app.mixins import ContextMixin

logger = logging.getLogger('pages.views')
logger.setLevel(logging.DEBUG)


class HomePageView(ContextMixin, TemplateView):

    template_name = "pages/home.html"


class ColorsPageView(ContextMixin, TemplateView):

    template_name = "pages/colors.html"
