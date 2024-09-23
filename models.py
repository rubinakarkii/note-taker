import os
from datetime import datetime
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

DB_USERNAME= os.getenv('DB_USERNAME')
DB_PASSWORD= os.getenv('DB_PASSWORD')
DB_NAME= os.getenv('DB_NAME')
DB_HOST= os.getenv('DB_HOST')
DB_PORT= os.getenv('DB_PORT')
app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS']= False

db = SQLAlchemy(app)

# class User(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     username = db.Column(db.String(80), unique=True, nullable=False)
#     email = db.Column(db.String(120), unique=True, nullable=True)
#     created_at = db.Column(db.DateTime, default=datetime.now(), nullable=False)
#     updated_at = db.Column(db.DateTime, default=datetime.now(), onupdate=datetime.now(), nullable=False)

#     def __repr__(self):
#         return f'User: {self.username}'


class Notes(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=True)
    content = db.Column(db.Text, nullable=True)
    task_id = db.Column(db.String, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.now(), nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.now(), onupdate=datetime.now(), nullable=False)

    # user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    # user = db.relationship('User', backref=db.backref('notes', lazy=True))

    def __repr__(self):
        return f'{self.id}=> {self.title}'


with app.app_context():
    db.create_all()
