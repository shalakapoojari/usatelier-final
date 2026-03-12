
import pymysql
import os
from dotenv import load_dotenv

load_dotenv()

uri = os.getenv('SQLALCHEMY_DATABASE_URI')
try:
    auth, host_db = uri.split('@')
    user_pass = auth.split('//')[1]
    user, password = user_pass.split(':')
    password = password.replace('%40', '@')
    host, db_name = host_db.split('/')
    
    connection = pymysql.connect(
        host=host,
        user=user,
        password=password,
        database=db_name
    )
    
    with connection.cursor() as cursor:
        cursor.execute("DESCRIBE products;")
        columns = [c[0] for c in cursor.fetchall()]
        print(f"Columns in products: {columns}")
        
        if 'size_guide_image' not in columns:
            print("Adding size_guide_image column...")
            cursor.execute("ALTER TABLE products ADD COLUMN size_guide_image TEXT;")
            connection.commit()
            print("Column added successfully.")
        else:
            print("Column size_guide_image already exists.")
            
    connection.close()
except Exception as e:
    print(f"Error: {e}")
