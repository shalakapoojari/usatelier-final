from flask_mail import Message
from flask import render_template
import os

def send_email(mail, subject, recipient, template, **kwargs):
    """Base function to send an email."""
    try:
        msg = Message(
            subject,
            recipients=[recipient],
            sender=os.getenv('MAIL_DEFAULT_SENDER')
        )
        msg.html = render_template(f"emails/{template}", **kwargs)
        mail.send(msg)
        return True
    except Exception as e:
        print(f"Error sending email: {str(e)}")
        return False

def send_signup_confirmation(mail, user_email, first_name):
    return send_email(
        mail,
        "Welcome to U.S ATELIER",
        user_email,
        "welcome.html",
        first_name=first_name
    )

def send_password_change_confirmation(mail, user_email, first_name):
    return send_email(
        mail,
        "Security Alert: Password Changed",
        user_email,
        "password_changed.html",
        first_name=first_name
    )

def send_order_confirmation(mail, user_email, order_id, total, items):
    return send_email(
        mail,
        f"Order Confirmation - {order_id}",
        user_email,
        "order_confirmation.html",
        order_id=order_id,
        total=total,
        items=items
    )

def send_order_status_update(mail, user_email, order_id, status, tracking_link=None):
    subject = f"Order {order_id} Update: {status}"
    return send_email(
        mail,
        subject,
        user_email,
        "order_status_update.html",
        order_id=order_id,
        status=status,
        tracking_link=tracking_link
    )

def send_new_arrival_notification(mail, user_email, product_name, product_price, product_id):
    return send_email(
        mail,
        f"NEW ARRIVAL: {product_name}",
        user_email,
        "new_arrival.html",
        product_name=product_name,
        product_price=product_price,
        product_id=product_id
    )
