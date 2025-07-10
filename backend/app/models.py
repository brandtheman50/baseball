from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Float, Date

Base = declarative_base()

class Play(Base):
    __tablename__ = "plays"

    id = Column(Integer, primary_key=True, autoincrement=True)
    batter_id = Column(Integer)
    batter = Column(String(100))
    pitcher_id = Column(Integer)
    pitcher = Column(String(100))
    game_date = Column(Date)
    launch_angle = Column(Float)
    exit_speed = Column(Float)
    exit_direction = Column(Float)
    hit_distance = Column(Float)
    hang_time = Column(Float)
    hit_spin_rate = Column(Float)
    play_outcome = Column(String)
    video_link = Column(String)