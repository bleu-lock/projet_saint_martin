from django import forms
from .models import Benevole, Don

class BenevoleForm(forms.ModelForm):
    class Meta:
        model = Benevole
        fields = ['nom', 'prenom', 'cni', 'telephone']


class DonForm(forms.ModelForm):
    class Meta:
        model = Don
        fields = ['montant', 'anonyme', 'nom', 'prenom']

    def clean(self):
        cleaned_data = super().clean()
        if cleaned_data.get("anonyme"):
            cleaned_data["nom"] = None
            cleaned_data["prenom"] = None
        return cleaned_data
