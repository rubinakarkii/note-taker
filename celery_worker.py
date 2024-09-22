from celery import Celery
from models import app, Notes

def make_celery(app):
    celery = Celery(app.import_name, backend='rpc://', broker='amqp://guest:guest@localhost//')
    celery.conf.update(app.config)
    return celery

celery = make_celery(app)

@celery.task
def send_reminder():
    with app.app_context():
            pass