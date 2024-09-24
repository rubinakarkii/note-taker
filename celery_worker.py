import os
from celery import Celery
from flask_mail import Message, Mail
from dotenv import load_dotenv
import mailtrap as mt

from models import app

load_dotenv()

MAILTRAP_API_TOKEN = os.getenv("MAILTRAP_API_TOKEN")

def make_celery(app):
    celery = Celery(app.import_name, backend='rpc://', broker='amqp://guest:guest@localhost//')
    celery.conf.update(app.config)
    return celery

celery = make_celery(app)

@celery.task
def send_reminder(reminder_content, receiver_email):
    """
    Celery task to send an email reminder to a specified email address.
    
    Args:
    - reminder_content: The content of the reminder (string).
    - receiver_email: The recipient's email address (string).
    
    Returns:
    - A message indicating success or failure.
    """

    mail = mt.Mail(
        sender=mt.Address(email="hello@demomailtrap.com", name="Mailtrap Test"),
        to=[mt.Address(email=receiver_email)],
        subject="Reminder",
        text=reminder_content,
        category="Notification Test",
    )

    client = mt.MailtrapClient(token=MAILTRAP_API_TOKEN)
    response = client.send(mail)
    return response
