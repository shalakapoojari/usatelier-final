
import pymysql
import os
from dotenv import load_dotenv

load_dotenv()

uri = os.getenv('SQLALCHEMY_DATABASE_URI')
# mysql+pymysql://root:Shreyas%40123@localhost/ecommerce_db
# Parse URI manually for simple check
try:
    auth, host_db = uri.split('@')
    user_pass = auth.split('//')[1]
    user, password = user_pass.split(':')
    password = password.replace('%40', '@')
    host, db_name = host_db.split('/')
    
    print(f"Connecting to {host}, DB: {db_name}, User: {user}")
    
    connection = pymysql.connect(
        host=host,
        user=user,
        password=password,
        database=db_name
    )
    
    with connection.cursor() as cursor:
        cursor.execute("SHOW TABLES;")
        tables = cursor.fetchall()
        print(f"Tables in {db_name}:")
        for t in tables:
            print(f" - {t[0]}")
            
    connection.close()
except Exception as e:
    print(f"Error: {e}")
