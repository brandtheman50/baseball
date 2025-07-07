from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd
import os
import sqlite3

app = Flask(__name__)
CORS(app) # Enable CORS for all routes

DB_FILE = 'data.db'
CSV_FILE = 'data.csv'
TABLE_NAME = 'data'

def create_db():
    if not os.path.exists(DB_FILE):
        print("Creating SQLite database from CSV...")
        df = pd.read_csv(CSV_FILE)
        conn = sqlite3.connect(DB_FILE)
        df.to_sql(TABLE_NAME, conn, if_exists='replace', index=False)
        conn.close()

def get_db_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/api/data')
def get_data():
    conn = get_db_connection()
    rows = conn.execute(f'SELECT * FROM {TABLE_NAME}').fetchall()
    conn.close()
    return jsonify([dict(row) for row in rows])

if __name__ == '__main__':
    create_db()
    app.run(debug=True)
