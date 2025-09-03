from django.shortcuts import render

def pagina_inicial(request):
    """View para a página inicial do sistema"""
    return render(request, 'agendamentos/inicio.html')

def agendar_aula(request):
    """View para a página de agendamento (vamos criar depois)"""
    return render(request, 'agendamentos/agendar.html')