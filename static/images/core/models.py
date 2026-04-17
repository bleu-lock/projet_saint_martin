from django.db import models

class Benevole(models.Model):
    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    cni = models.CharField(max_length=20, unique=True)
    telephone = models.CharField(max_length=15)

    def __str__(self):
        return f"{self.prenom} {self.nom}"


class Don(models.Model):
    montant = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateTimeField(auto_now_add=True)
    anonyme = models.BooleanField(default=True)
    nom = models.CharField(max_length=100, blank=True, null=True)
    prenom = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        if self.anonyme:
            return f"Don anonyme de {self.montant} €"
        return f"Don de {self.prenom} {self.nom} ({self.montant} €)"
