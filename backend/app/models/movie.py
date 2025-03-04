from sqlalchemy import Column, Integer, String, Date, Float, TIMESTAMP, Text
from sqlalchemy.sql import func
from app.database import Base

class Movie(Base):
    __tablename__ = "movies"

    movieid = Column(Integer, primary_key=True, index=True, name="movieid")
    tmdbid = Column(Integer, unique=True, nullable=False, name="tmdbid")
    movietitle = Column(String(255), nullable=False, name="movietitle")
    moviedescription = Column(Text, name="moviedescription")
    releasedate = Column(Date, name="releasedate")
    posterurl = Column(String(512), name="posterurl")
    genres = Column(String(100), name="genres")
    tmdbrating = Column(Float, name="tmdbrating")
    createddatetime = Column(TIMESTAMP, default=func.current_timestamp(), name="createddatetime")