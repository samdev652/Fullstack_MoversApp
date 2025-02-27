#edit at your own peril

from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime 

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
app.config['SECRET_KEY'] = 'supersecretkey'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///moving_app.db'
db = SQLAlchemy(app)

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)
    role = db.Column(db.String(50), nullable=False, default='user')  # user, driver, admin
    is_banned = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    balance = db.Column(db.Float, default=0.0)  # Wallet balance

    # Relationships
    bookings = db.relationship('Booking', backref='user', lazy=True)
    payments = db.relationship('Payment', backref='user', lazy=True)
    reviews = db.relationship('Review', backref='user', lazy=True)
    support_tickets = db.relationship('SupportTicket', backref='user', lazy=True)
    notifications = db.relationship('Notification', backref='user', lazy=True)

class Driver(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    vehicle_type = db.Column(db.String(100), nullable=False)
    license_plate = db.Column(db.String(50), nullable=False)
    is_available = db.Column(db.Boolean, default=True)
    earnings = db.Column(db.Float, default=0.0)
    ratings = db.Column(db.Float, default=0.0)
    completed_orders = db.Column(db.Integer, default=0)
    live_location = db.Column(db.String(100), nullable=True)  # Latitude, Longitude

    # Relationships
    bookings = db.relationship('Booking', backref='driver', lazy=True)
    reviews = db.relationship('Review', backref='driver', lazy=True)
    notifications = db.relationship('Notification', backref='driver', lazy=True)

class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    driver_id = db.Column(db.Integer, db.ForeignKey('driver.id'), nullable=False)
    pickup_location = db.Column(db.String(200), nullable=False)
    dropoff_location = db.Column(db.String(200), nullable=False)
    distance = db.Column(db.Float, nullable=False)  # Distance in km
    price = db.Column(db.Float, nullable=False)  # Price based on distance
    status = db.Column(db.String(50), default='pending')  # pending, accepted, completed, cancelled
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    promo_code = db.Column(db.String(50), nullable=True)  # Applied promo code

class Payment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    transaction_id = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(50), default='pending')  # pending, completed, failed
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    driver_id = db.Column(db.Integer, db.ForeignKey('driver.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)  # Rating out of 5
    comment = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class SupportTicket(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    subject = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(50), default='open')  # open, resolved
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    admin_reply = db.Column(db.Text, nullable=True)

class Notification(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    driver_id = db.Column(db.Integer, db.ForeignKey('driver.id'), nullable=True)
    message = db.Column(db.String(200), nullable=False)
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class PromoCode(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(50), unique=True, nullable=False)
    discount = db.Column(db.Float, nullable=False)  # Discount percentage
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


def validate_user(data):
    if not data.get('name') or not data.get('phone') or not data.get('email') or not data.get('password'):
        return False
    return True

#Admin User
def create_admin_user():
    admin_username = 'admin'
    admin_password = generate_password_hash('admin#cuba', method='pbkdf2:sha256')
    admin_email = 'admin@movingapp.com'

    admin = User.query.filter_by(email=admin_email).first()
    if not admin:
        admin = User(
            name='Admin',
            phone='1234567890',
            email=admin_email,
            password=admin_password,
            role='admin'
        )
        db.session.add(admin)
        db.session.commit()
        print("Admin user created successfully.")
# Routes
@app.route('/')
def landing_page():
    return jsonify({'message': 'Welcome to the Moving App API!'})

# Authentication
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    if not validate_user(data):
        return jsonify({'error': 'Name, phone, email, and password are required'}), 400

    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 400

    user = User(
        name=data['name'],
        phone=data['phone'],
        email=data['email'],
        password=generate_password_hash(data['password'], method='pbkdf2:sha256'),
        role=data.get('role', 'user')
    )
    db.session.add(user)
    db.session.commit()

    if data.get('role') == 'driver':
        driver = Driver(
            user_id=user.id,
            vehicle_type=data.get('vehicle_type', ''),
            license_plate=data.get('license_plate', '')
        )
        db.session.add(driver)
        db.session.commit()

    return jsonify({'message': 'Registration successful!', 'user_id': user.id})

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()

    if user and check_password_hash(user.password, data['password']):
        return jsonify({
            'message': 'Login successful!',
            'user_id': user.id,
            'role': user.role
        })
    return jsonify({'error': 'Invalid credentials'}), 401

if __name__="__main__":
   db.create_all()
   create_admin_user()
  app.run(debug=True)
