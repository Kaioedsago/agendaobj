from django.contrib import admin
from django.urls import path
from agendamentos import views  # Importe as views do seu app

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.pagina_inicial, name='inicio'),  # Página inicial
    path('agendar/', views.agendar_aula, name='agendar'),  # Página de agendamento
]