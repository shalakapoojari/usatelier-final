
from app import app
from models_mysql import User, db_mysql
import os

with app.app_context():
    # Trigger seeding to sync admin with plain-text password
    from app import seed_database
    seed_database()
    
    # Check the admin user directly
    admin = User.query.filter_by(email="admin@atelier.com").first()
    if admin:
        print(f"Admin Email: {admin.email}")
        print(f"Admin Password in DB: {admin.password}")
        if admin.password == "admin123":
            print("Verification SUCCESS: Password is plain text.")
        else:
            print(f"Verification FAILED: Expected 'admin123', got '{admin.password}'")
    else:
        print("Admin user not found.")
