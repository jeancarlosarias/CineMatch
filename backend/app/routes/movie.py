from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.movie import Movie
from app.services.tmdb import TMDBService

router = APIRouter(prefix="/movies", tags=["Movies"])  # Especificando la ruta para las movies

@router.get("/{movieid}")  # Obtener detalles de una movie por ID
def get_movie_details(movieid: int, db: Session = Depends(get_db)):
    tmdb_service = TMDBService()
    movie_data = tmdb_service.get_movie_by_id(movieid, db)
    return movie_data  # Retorna la movie y sus reseñas


@router.get("/movie/{name}")  # Buscar por nombre de la movie
def get_movie_by_name(name: str, db: Session = Depends(get_db)):
    tmdb_service = TMDBService()
    tmdb_results = tmdb_service.search_movies(name, db)

    if not tmdb_results:
        raise HTTPException(status_code=404, detail="Pelicula no encontrada en la base de datos ni en TMDB")

    # Si se encuentran varias movies devolver todas
    movie_list = []
    for movie in tmdb_results:
        reviews = tmdb_service.get_movie_with_reviews(movie.movieid)
        movie_list.append({
            "movie": movie,
            "reviews": reviews
        })

    return movie_list  # Devolver todas las movies encontradas y sus reseñas

@router.get("/{movie_id}/reviews")
def get_movie_reviews(movie_id: int):
    tmdb_service = TMDBService()
    try:
        movie_with_reviews = tmdb_service.get_movie_with_reviews(movie_id)
        return movie_with_reviews
    except HTTPException as e:
        raise e
