from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # DB
    DATABASE_URL: str = "postgresql://user:pass@localhost:5432/dbname"
    
    # JWT
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 60
    
    # TMDB
    TMDB_API_KEY: str
    TMDB_BASE_URL: str = "https://api.themoviedb.org/3"
    
    class Config:
        env_file = ".env"  # Lee las variables de .env
        case_sensitive = True  # Sensible a mayusculas y minusculas

settings = Settings()  # Instancia de singleton