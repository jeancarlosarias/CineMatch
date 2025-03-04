from sqlalchemy import Column, Integer, SmallInteger, Text, TIMESTAMP, ForeignKey
from sqlalchemy.sql import func
from app.database import Base
from sqlalchemy.orm import relationship

class Review(Base):
    __tablename__ = "reviews"

    reviewid = Column(Integer, primary_key=True, index=True, name="reviewid")
    userid = Column(Integer, ForeignKey("users.userid"), nullable=False, name="userid") # Estableciendo la relacion que tiene con el user y debajo con la movie
    movieid = Column(Integer, ForeignKey("movies.movieid"), nullable=False, name="movieid")
    reviewrating = Column(SmallInteger, nullable=False, name="reviewrating")
    reviewcomment = Column(Text, name="reviewcomment")
    createddatetime = Column(TIMESTAMP, default=func.current_timestamp(), name="createddatetime")
    modifieddatetime = Column(TIMESTAMP, default=func.current_timestamp(), onupdate=func.current_timestamp(), name="modifieddatetime") # configuracion para que se actualice

    user = relationship("User", back_populates="reviews")
    movie = relationship("Movie")