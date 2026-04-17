from django.shortcuts import render, redirect
from .forms import BenevoleForm, DonForm

def home(request):
    return render(request, 'home.html')


def projets(request):
    return render(request, 'projets.html')

def ajouter_benevole(request):
    if request.method == 'POST':
        form = BenevoleForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('benevole_success')
    else:
        form = BenevoleForm()
    return render(request, 'benevole_form.html', {'form': form})


def faire_don(request):
    if request.method == 'POST':
        form = DonForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('don_success')
    else:
        form = DonForm()
    return render(request, 'don_form.html', {'form': form})


def contact(request):
    return render(request, 'contact.html')

