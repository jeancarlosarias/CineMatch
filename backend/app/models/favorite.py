from sqlalchemy import Column, Integer, TIMESTAMP, ForeignKey
from sqlalchemy.sql import func
from app.database import Base
from sqlalchemy.orm import relationship

class Favorite(Base):
    __tablename__ = "favorites"

    favoriteid = Column(Integer, primary_key=True, index=True, name="favoriteid")
    userid = Column(Integer, ForeignKey("users.userid"), nullable=False, name="userid")
    movieid = Column(Integer, ForeignKey("movies.movieid"), nullable=False, name="movieid")
    createddatetime = Column(TIMESTAMP, default=func.current_timestamp(), name="createddatetime")

    user = relationship("User", back_populates="favorites")
    movie = relationship("Movie")