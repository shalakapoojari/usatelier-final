
import pymysql
import os
from dotenv import load_dotenv

load_dotenv()

uri = os.getenv('SQLALCHEMY_DATABASE_URI')
auth, host_db = uri.split('@')
user_pass = auth.split('//')[1]
u, p = user_pass.split(':')
p = p.replace('%40', '@')
host, db_name = host_db.split('/')

mysql_conn = pymysql.connect(host=host, user=u, password=p, database=db_name)

def migrate():
    with mysql_conn.cursor() as cursor:
        print("Checking if password_hash column exists...")
        cursor.execute("DESCRIBE users")
        columns = [row[0] for row in cursor.fetchall()]
        
        if 'password_hash' in columns and 'password' not in columns:
            print("Renaming password_hash to password...")
            cursor.execute("ALTER TABLE users CHANGE password_hash password VARCHAR(255) NOT NULL")
            print("Column renamed successfully!")
        elif 'password' in columns:
            print("Column 'password' already exists.")
        else:
            print("Could not find password_hash column to rename.")
            
    mysql_conn.commit()

if __name__ == "__main__":
    migrate()
    mysql_conn.close()
