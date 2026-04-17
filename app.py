import os
from flask import Flask, render_template, request, flash, redirect, url_for
from flask_mail import Mail, Message
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
import bcrypt
from config import Config
from models import db, Contact, Benevole, User

app = Flask(__name__)
app.config.from_object(Config)

# Initialize extensions
db.init_app(app)
mail = Mail(app)
login_manager = LoginManager(app)
login_manager.login_view = 'admin_login'

@login_manager.user_loader
def load_user(id):
    return User.query.get(int(id))

# Création de la base de données + admin par défaut si n'existe pas
with app.app_context():
    db.create_all()
    admin_email = 'admin@saintmartin.com'
    if not User.query.filter_by(username=admin_email).first():
        # hashing 'admin123@'
        hashed = bcrypt.hashpw(b'admin123@', bcrypt.gensalt()).decode('utf-8')
        admin_user = User(username=admin_email, password_hash=hashed)
        db.session.add(admin_user)
        db.session.commit()

# -------------
# ROUTES PUBLIQUES
# -------------

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/projets')
def projets():
    return render_template('projets.html')

@app.route('/don')
def don():
    return render_template('don.html')

@app.route('/benevole', methods=['GET', 'POST'])
def benevole():
    if request.method == 'POST':
        nom = request.form.get('nom')
        email = request.form.get('email')
        telephone = request.form.get('telephone')
        disponibilites = request.form.getlist('disponibilite')
        dispo_str = ', '.join(disponibilites)
        motivation = request.form.get('motivation')

        if not nom or not email or not telephone:
            flash("Veuillez remplir tous les champs obligatoires.", "error")
            return redirect(url_for('benevole'))
            
        try:
            nouveau_benevole = Benevole(
                nom=nom, email=email, telephone=telephone,
                disponibilites=dispo_str, motivation=motivation
            )
            db.session.add(nouveau_benevole)
            db.session.commit()
            
            return redirect(url_for('confirmation', typ='benevole'))
        except Exception as e:
            db.session.rollback()
            flash("Erreur lors de l'inscription. Cet email est peut-être déjà utilisé.", "error")
            
    return render_template('benevole.html')

@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        nom = request.form.get('nom')
        email = request.form.get('email')
        sujet = request.form.get('sujet')
        message = request.form.get('message')

        if not nom or not email or not message:
            flash("Veuillez remplir tous les champs obligatoires.", "error")
            return redirect(url_for('contact'))

        # Enregistrement BD
        nouveau_contact = Contact(nom=nom, email=email, sujet=sujet, message=message)
        db.session.add(nouveau_contact)
        db.session.commit()

        # Envoi Email (Tentative rapide)
        try:
            msg = Message(f"Nouveau message de {nom} : {sujet}",
                          sender=app.config['MAIL_USERNAME'],
                          recipients=['maggie.langlier@gmail.com'])
            msg.body = f"Nom: {nom}\nEmail: {email}\n\nMessage:\n{message}"
            # On envoie, mais on ne bloque pas trop longtemps si ça traîne
            mail.send(msg)
        except Exception as e:
            print(f"Erreur mail: {e}")
            
        return redirect(url_for('confirmation', typ='contact'))
        
    return render_template('contact.html')

@app.route('/confirmation/<typ>')
def confirmation(typ):
    title = "Merci pour votre message !" if typ == 'contact' else "Merci de nous rejoindre !"
    desc = "Nous vous répondrons dans les plus brefs délais." if typ == 'contact' else "Nous avons bien reçu votre candidature et vous contacterons bientôt pour une première rencontre."
    return render_template('confirmation.html', title=title, desc=desc)

# -------------
# ROUTES ADMIN
# -------------

@app.route('/admin/login', methods=['GET', 'POST'])
def admin_login():
    if current_user.is_authenticated:
        return redirect(url_for('admin_dashboard'))
        
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        user = User.query.filter_by(username=username).first()
        if user and bcrypt.checkpw(password.encode('utf-8'), user.password_hash.encode('utf-8')):
            login_user(user)
            return redirect(url_for('admin_dashboard'))
        else:
            flash('Identifiants invalides', 'error')
            
    return render_template('admin/login.html')

@app.route('/admin/logout')
@login_required
def admin_logout():
    logout_user()
    return redirect(url_for('index'))

@app.route('/admin/dashboard')
@login_required
def admin_dashboard():
    contacts = Contact.query.order_by(Contact.date.desc()).all()
    benevoles = Benevole.query.order_by(Benevole.date.desc()).all()
    return render_template('admin/dashboard.html', contacts=contacts, benevoles=benevoles)

@app.route('/admin/contact/delete/<int:id>', methods=['POST'])
@login_required
def admin_delete_contact(id):
    contact = Contact.query.get(id)
    if contact:
        db.session.delete(contact)
        db.session.commit()
        flash('Message supprimé avec succès.', 'success')
    return redirect(url_for('admin_dashboard'))

@app.route('/admin/benevole/delete/<int:id>', methods=['POST'])
@login_required
def admin_delete_benevole(id):
    benevole = Benevole.query.get(id)
    if benevole:
        db.session.delete(benevole)
        db.session.commit()
        flash('Inscription de bénévole supprimée avec succès.', 'success')
    return redirect(url_for('admin_dashboard'))

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
