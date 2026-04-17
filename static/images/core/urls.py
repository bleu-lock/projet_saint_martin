from django.urls import path
from . import views


urlpatterns = [
    path('', views.home, name='home'),
    path('projets/', views.projets, name='projets'),
    path('don/', views.faire_don, name='don'),
    path('benevolat/', views.ajouter_benevole, name='benevolat'),
    path('contact/', views.contact, name='contact'),
]
