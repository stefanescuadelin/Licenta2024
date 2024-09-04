from django.urls import path
from . import views

urlpatterns = [
    path('<str:led_name>/', views.control_led, name='control_led'),
    path('status', views.get_led_values, name='get_led_values')
]
