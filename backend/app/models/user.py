from sqlalchemy import Column, Integer, String, TIMESTAMP
from app.database import Base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

class User(Base):
    __tablename__ = "users"

    userid = Column(Integer, primary_key=True, index=True, name="userid")
    username = Column(String(100), nullable=False, name="username")
    useremail = Column(String(255), unique=True, nullable=False, name="useremail")
    passwordhash = Column(String(128), nullable=False, name="passwordhash")
    createddatetime = Column(TIMESTAMP, default=func.current_timestamp(), name="createddatetime")
    modifieddatetime = Column(TIMESTAMP, default=func.current_timestamp(), onupdate=func.current_timestamp(), name="modifieddatetime")

    # Relaciones (SQLAlchemy ORM)
    reviews = relationship("Review", back_populates="user")
    favorites = relationship("Favorite", back_populates="user")
    
    # Funciones para el generado y verificado de las contraseñas
    def set_password(self, password: str):
        """Hashea y almacena la contraseña"""
        self.password_hash = get_password_hash(password)
    
    def check_password(self, password: str) -> bool:
        """Verifica la contraseña contra el hash"""
        return verify_password(password, self.password_hash)