from flask import Flask, jsonify, request
from flask_cors import CORS
from sqlalchemy import create_engine
import pandas as pd
from sqlalchemy.orm import sessionmaker
from models import Play
from datetime import datetime
from load_data import create_db

app = Flask(__name__)
CORS(app) # Enable CORS for all routes

DB_PATH = 'sqlite:///database.db'
CSV_FILE = 'data.csv'
TABLE_NAME = 'data'

# Create engine + session
engine = create_engine(DB_PATH, echo=False)
Session = sessionmaker(bind=engine)

# For this exercise, we'll use SQLAlchemy to manage the database connection
# and session management. Since queries are simple, we won't use raw SQL 
# and protect against SQL injection by using SQLAlchemy's ORM features.
@app.route('/api/data')
def get_data():
    try:
        pitcher = request.args.get('pitcher')
        batter = request.args.get('batter')
        date = request.args.get('date')
        outcome = request.args.get('outcome')

        session = Session()
        query = session.query(Play)

        if pitcher:
            query = query.filter(Play.pitcher.ilike(f"%{pitcher}%"))
        if batter:
            query = query.filter(Play.batter.ilike(f"%{batter}%"))
        if date:
            # Validate date format
            parsed_date = datetime.strptime(date, '%Y-%m-%d').date()
            if not parsed_date:
                raise ValueError("Invalid date format. Use YYYY-MM-DD.")
            query = query.filter(Play.game_date == parsed_date)
        if outcome:
            # Validate outcome against a predefined set
            valid_outcomes = {"out", "single", "double", "triple", "homerun"}
            if outcome.lower() not in valid_outcomes:
                raise ValueError("Invalid play outcome.")
            query = query.filter(Play.play_outcome.ilike(outcome))
        
        plays = query.order_by(Play.game_date.desc()).limit(100).all()

        # Convert model objects to dicts
        result = []
        for play in plays:
            result.append({
                "id": play.id,
                "batter": play.batter,
                "pitcher": play.pitcher,
                "game_date": play.game_date.isoformat(),
                "play_outcome": play.play_outcome,
                "launch_angle": play.launch_angle,
                "exit_speed": play.exit_speed,
                "hit_distance": play.hit_distance,
            })
        return jsonify(result)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        print(e)
        return jsonify({"error": "An error occurred while processing your request."}), 500
    finally:
        session.close()

# Route to get a specific play by ID
@app.route('/api/play/<int:id>')
def get_play(id):
    try:
        session = Session()
        play = session.query(Play).filter(Play.id == id).first()

        # Return 404 if not found
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
        return jsonify(result)
    except Exception as e:
        print(e)
    finally:
        session.close()

if __name__ == '__main__':
    create_db()
    app.run(debug=True)