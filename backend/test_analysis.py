import requests

session = requests.Session()
# Assuming the default admin credentials or another valid superuser exists
try:
    res = session.post("http://127.0.0.1:5000/api/auth/login", json={
        "email": "admin@usatelier.com",
        "password": "admin"
    }, timeout=5)
    print("Login status:", res.status_code)
    print("Cookies:", session.cookies.get_dict())
    
    res2 = session.get("http://127.0.0.1:5000/api/admin/analysis", timeout=5)
    print("Analysis status:", res2.status_code)
    try:
        print(res2.json())
    except Exception as e:
        print("Error parsing JSON:", e)
        print("Response text:", res2.text[:500])
except Exception as e:
    print("Request failed:", e)
