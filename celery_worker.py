import os
from celery import Celery
from flask_mail import Message, Mail
from dotenv import load_dotenv

from models import app

load_dotenv()

# Flask-Mail configuration
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True

mail = Mail(app)

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
    with app.app_context():
        try:
            msg = Message(
                'Reminder Notification',
                sender='@example.com',  # Set your sender email
                recipients=[receiver_email]
            )
            msg.body = f"Here is your reminder:\n\n{reminder_content}"

            # Send the email
            mail.send(msg)
            
            return f"Reminder sent to {receiver_email}"
        except Exception as e:
            return f"Failed to send reminder: {str(e)}"
