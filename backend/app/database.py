from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# Confi de la conexion a la base de datos
engine = create_engine(
    settings.DATABASE_URL,  # Usa la URL del .env
    pool_pre_ping=True  # Verifica conexiones inactivas
)

# sesion de base de datos para crear sesiones
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Base para modelos de sqlalchemy
Base = declarative_base()

def get_db():
    """Proveedor de dependencias para FastAPI"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()