from flask import Flask
from flask_cors import CORS
from sqlalchemy import create_engine
import pandas as pd
from .models import Base
import os

app = Flask(__name__)
CORS(app) # Enable CORS for all routes

DB_PATH = 'sqlite:///database.db'
CSV_FILE = 'data.csv'
TABLE_NAME = 'data'
# Create the sqlite database if it doesn't exist
def create_db():
    if not os.path.exists("database.db"):
        print("Creating SQLite database from CSV...")
        df = pd.read_csv(CSV_FILE)
        # Rename columns to match model
        df.columns = [col.lower() for col in df.columns]

        # Parse game_date
        df['game_date'] = pd.to_datetime(df['game_date']).dt.date

        engine = create_engine(DB_PATH)
        Base.metadata.drop_all(engine)
        Base.metadata.create_all(engine)
        
        df.to_sql("plays", engine, if_exists="append", index=False)