from celery import Celery
from models import app

def make_celery(app):
    celery = Celery(app.import_name, backend='rpc://', broker='amqp://guest:guest@localhost//')
    celery.conf.update(app.config)
    return celery

celery = make_celery(app)
