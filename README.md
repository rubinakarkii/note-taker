# Project Description #

# Installation #

## Frontend Setup Instructions ##
```
brew install node
brew install yarn
yarn install
yarn dev
```

## Backend Setup Instructions ##
Clone the repository:
```
git clone https://github.com/your-username/note-taker.git
cd note-taker
```
Create and activate a virtual environment:
```
python3 -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
```
Install the dependencies:
```
pip install -r requirements.txt
```
Set up the PostgreSQL database: Make sure PostgreSQL is installed and running. Create a database for the project.

Configure environment variables:
Create a .env file in the project root directory with the following contents:
```
DB_USERNAME=
DB_PASSWORD=
DB_NAME=
DB_HOST=
DB_PORT=
MAILTRAP_API_TOKEN=
```
Run db script
```
python models.py
```

Run the Flask app:
```
python app.py
```
Run the Celery worker: Open another terminal window, activate the virtual environment, and run the Celery worker:
```
celery -A celery_worker.celery worker --loglevel=info
```
Running RabbitMQ:
Make sure RabbitMQ is running before starting Celery. You can install RabbitMQ here.
```
brew install rabbitmq  # For macOS with Homebrew
brew services start rabbitmq
```

