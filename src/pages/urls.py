from django.urls import path
from .views import HomePageView, ColorsPageView


urlpatterns = [
    path("", HomePageView.as_view(), name="home"),
    path("home/", HomePageView.as_view(), name="home/"),
    path("colors/", ColorsPageView.as_view(), name="colors"),
]
