from flask import Flask
from flask_cors import CORS
from sqlalchemy import create_engine

from sqlalchemy.orm import sessionmaker

app = Flask(__name__)
CORS(app) # Enable CORS for all routes

DB_PATH = 'sqlite:///database.db'
CSV_FILE = 'data.csv'
TABLE_NAME = 'data'

# Create engine + session
engine = create_engine(DB_PATH, echo=False)
Session = sessionmaker(bind=engine)

from app import routes