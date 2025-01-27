import logging
from django.views.generic import TemplateView
from app.mixins import ContextMixin

logger = logging.getLogger('pages.views')


class HomePageView(ContextMixin, TemplateView):
    template_name = "pages/home.html"
    def get(self, request, *args, **kwargs):
        logger.debug(self.request.user)
        return super().get(request, *args, **kwargs)


class ColorsPageView(ContextMixin, TemplateView):

    template_name = "pages/colors.html"
