from django.db import models
from django.contrib.auth.models import BaseUserManager
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.contrib.auth.hashers import make_password
from django.contrib.auth.hashers import check_password
from datetime import date
from django.contrib.auth.models import User
from django.conf import settings


# 🌟 Création des rôles
class Role(models.Model):
    nom_role = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.nom_role

# 👤 Utilisateurs (Admin, RH, Employé)
class UtilisateurManager(BaseUserManager):
    def create_user(self, email, username, mot_de_passe=None, **extra_fields):
        if not email:
            raise ValueError('L\'email doit être renseigné')
        email = self.normalize_email(email)
        user = self.model(email=email, username=username, **extra_fields)
        if mot_de_passe:
            user.set_password(mot_de_passe)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, mot_de_passe=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(email, username, mot_de_passe, **extra_fields)


class Utilisateur(AbstractBaseUser, PermissionsMixin):
    STATUT_CHOICES = [
        ('en_attente', 'Pending'),  # "En attente" أصبح "Pending" بالإنجليزي
        ('accepte', 'Accepted'),   # "Accepté" أصبح "Accepted" بالإنجليزي
        ('rejete', 'Rejected'),    # "Rejeté" أصبح "Rejected" بالإنجليزي
    ]

    username = models.CharField(max_length=150, unique=True)
    nom = models.CharField(max_length=100, blank=True)
    prenom = models.CharField(max_length=100, blank=True)
    email = models.EmailField(max_length=150, unique=True)
    mot_de_passe = models.CharField(max_length=255)
    photo = models.TextField(null=True, blank=True)
    role = models.ForeignKey('Role', on_delete=models.CASCADE)
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default='en_attente')  # إضافة الحقل الجديد
    date_creation = models.DateTimeField(auto_now_add=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'  # هذا ضروري جدًا
    REQUIRED_FIELDS = ['username']  # الحقول اللي لازم تتوفر لما تعمل createsuperuser

    objects = UtilisateurManager()

    def __str__(self):
        return f'{self.nom} {self.prenom}'

    def set_password(self, raw_password):
        self.mot_de_passe = make_password(raw_password)  # 🔐 تشفير كلمة السر
        self.save()

    def check_password(self, raw_password):
        return check_password(raw_password, self.mot_de_passe)

    @property
    def is_authenticated(self):
        return True

    @property
    def full_name(self):
        return f"{self.nom} {self.prenom}".strip()


# 👨‍💼 Employés (liés aux utilisateurs)
class Employe(models.Model):
    utilisateur = models.OneToOneField(Utilisateur, on_delete=models.CASCADE)
    poste = models.CharField(max_length=100)
    departement = models.CharField(max_length=100)
    date_embauche = models.DateField()
    statut_employe = models.CharField(max_length=50, default='actif')

    def __str__(self):
        return self.utilisateur.full_name  # استخدام الحقل full_name الذي يجمع الاسم واللقب

# 📄 Contrats
class Contrat(models.Model):
    employe = models.ForeignKey('Employe', on_delete=models.CASCADE)
    type_contrat = models.CharField(max_length=100)
    date_debut = models.DateField()
    date_fin = models.DateField(null=True, blank=True)
    salaire = models.DecimalField(max_digits=10, decimal_places=2)
    statut_contrat = models.CharField(max_length=50, default='en cours')

    # ✅ تتبع التواريخ تلقائيًا
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # 🗂️ ملف العقد PDF
    document = models.FileField(upload_to='contrats/', null=True, blank=True)

    def __str__(self):
        return f'{self.employe.utilisateur.nom} - {self.type_contrat}'

    # 🔔 خاصية العقود التي قاربت على الانتهاء
    @property
    def est_pres_de_fin(self):
        return self.date_fin and (self.date_fin - date.today()).days <= 30

# 🗓️ Congés
class Conge(models.Model):
    employe = models.ForeignKey(Employe, on_delete=models.CASCADE)
    date_debut = models.DateField()
    date_fin = models.DateField()
    raison = models.TextField()
    statut = models.CharField(max_length=50, default='en attente')
    date_demande = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.employe.utilisateur.nom} - {self.statut}'

# ⭐ Évaluations
class Evaluation(models.Model):
    NOTE_CHOICES = [
        (1, '1 - Poor'),
        (2, '2 - Fair'),
        (3, '3 - Good'),
        (4, '4 - Very Good'),
        (5, '5 - Excellent'),
    ]

    CATEGORY_CHOICES = [
        ('performance', 'Performance'),
        ('leadership', 'Leadership'),
        ('communication', 'Communication'),
        ('teamwork', 'Teamwork'),
    ]

    employe = models.ForeignKey('Employe', on_delete=models.CASCADE)
    note = models.IntegerField(choices=NOTE_CHOICES)
    commentaire = models.TextField()
    date_evaluation = models.DateField(auto_now_add=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='performance')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, default=1)  # استخدم هنا قيمة افتراضية لمعرف المستخدم

    def __str__(self):
        return f'{self.employe.utilisateur.nom} - {self.category} - Note: {self.note} - By: {self.user.username}'

# 📥 Recrutement - Offres
class Recrutement(models.Model):
    poste = models.CharField(max_length=100)
    description = models.TextField()
    statut = models.CharField(max_length=50, default='ouvert')
    date_creation = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Poste: {self.poste} - Statut: {self.statut}'

# 📥 Recrutement - Candidatures
class Candidature(models.Model):
    recrutement = models.ForeignKey(Recrutement, on_delete=models.CASCADE)
    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    email = models.EmailField(max_length=150)
    cv = models.TextField()
    statut = models.CharField(max_length=50, default='en attente')

    def __str__(self):
        return f'{self.nom} {self.prenom} - Statut: {self.statut}'

# 💵 Bulletins de paie
class BulletinPaie(models.Model):
    employe = models.ForeignKey(Employe, on_delete=models.CASCADE)
    mois = models.CharField(max_length=20)
    annee = models.IntegerField()
    montant_net = models.DecimalField(max_digits=10, decimal_places=2)
    fichier_pdf = models.TextField()
    date_creation = models.DateTimeField(auto_now_add=True)
    status_pyment = models.CharField(max_length=50, default='not paid')
    def __str__(self):
        return f'{self.employe.utilisateur.nom} - {self.mois} {self.annee}'
#absence 
# 📌 Gestion des absences
class Absence(models.Model):
    employe = models.ForeignKey(Employe, on_delete=models.CASCADE)
    date_debut = models.DateField()
    date_fin = models.DateField()
    motif = models.TextField()
    justifiee = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.employe.utilisateur.nom} - Absence du {self.date_debut} au {self.date_fin}'
