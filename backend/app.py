from flask import Flask, jsonify, request
from flask_cors import CORS
from sqlalchemy import create_engine, text
import pandas as pd
from models import Base
from sqlalchemy.orm import sessionmaker
from models import Play
import os

app = Flask(__name__)
CORS(app) # Enable CORS for all routes

DB_PATH = 'sqlite:///database.db'
CSV_FILE = 'data.csv'
TABLE_NAME = 'data'

# Create engine + session
engine = create_engine(DB_PATH, echo=False)
Session = sessionmaker(bind=engine)

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

# def get_db_connection():
#     conn = sqlite3.connect(DB_FILE)
#     conn.row_factory = sqlite3.Row
#     return conn

# For this exercise, parameterized queries are used instead of SQLAlchemy ORM
# to prevent SQL injection and to keep the example simple.
@app.route('/api/data')
def get_data():
    pitcher = request.args.get('pitcher')
    batter = request.args.get('batter')
    date = request.args.get('date')
    outcome = request.args.get('outcome')

    session = Session()
    query = session.query(Play)

    if pitcher:
        query = query.filter(Play.pitcher.ilike(pitcher))
    if batter:
        query = query.filter(Play.batter.ilike(batter))
    if date:
        query = query.filter(Play.game_date == date)
    if outcome:
        query = query.filter(Play.play_outcome.ilike(outcome))
    
    plays = query.order_by(Play.game_date.desc()).limit(100).all()

    # Convert model objects to dicts
    result = []
    for play in plays:
        result.append({
            "id": play.id,
            "batter_id": play.batter_id,
            "batter": play.batter,
            "pitcher_id": play.pitcher_id,
            "pitcher": play.pitcher,
            "game_date": play.game_date.isoformat(),
            "play_outcome": play.play_outcome,
        })
    session.close()
    return jsonify(result)

@app.route('/api/play/<int:id>')
def get_play(id):
    session = Session()
    play = session.query(Play).filter(Play.id == id).first()
    if not play:
        return jsonify({"error": "Play not found"}), 404
    result = {
        "id": play.id,
        "batter_id": play.batter_id,
        "batter": play.batter,
        "pitcher_id": play.pitcher_id,
        "pitcher": play.pitcher,
        "game_date": play.game_date.isoformat(),
        "launch_angle": play.launch_angle,
        "exit_speed": play.exit_speed,
        "exit_direction": play.exit_direction,
        "hit_distance": play.hit_distance,
        "hang_time": play.hang_time,
        "hit_spin_rate": play.hit_spin_rate,
        "play_outcome": play.play_outcome,
        "video_link": play.video_link
    }
    session.close()
    return jsonify(result)

if __name__ == '__main__':
    create_db()
    app.run(debug=True)