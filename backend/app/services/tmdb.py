import requests
from typing import List
from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.movie import Movie
from app.core.config import settings
from app.models.reviewTmdb import ReviewTMDB
from datetime import datetime

class TMDBService:
    def __init__(self):
        self.base_url = settings.TMDB_BASE_URL
        self.api_key = settings.TMDB_API_KEY  # Se usa en la URL en lugar de headers

    def get_movie_with_reviews(self, movie_id: int) -> List[ReviewTMDB]:
        """Obtiene las reseñas de TMDB de una película con los campos específicos."""
        try:
            response = requests.get(
                f"{self.base_url}/movie/{movie_id}/reviews?api_key={self.api_key}&language=es&page=1"
            )
            response.raise_for_status()
        except requests.RequestException:
            raise HTTPException(status_code=502, detail="Error al conectar con TMDB para obtener reseñas")
        
        reviews = response.json().get("results", [])
        
        # Mapeo de las reseñas para solo devolver los campos requeridos
        review_list = []
        for review in reviews[:20]:  # Limitar a 20 reseñas
            review_list.append(ReviewTMDB(
                author=review.get("author", "Desconocido"),
                content=review.get("content", ""),
                created_at=datetime.strptime(review.get("created_at"), "%Y-%m-%dT%H:%M:%S.%fZ") if review.get("created_at") else None,
                updated_at=datetime.strptime(review.get("updated_at"), "%Y-%m-%dT%H:%M:%S.%fZ") if review.get("updated_at") else None
            ))
        
        return review_list

    def get_movie_by_id(self, movie_id: int, db: Session) -> dict:
        """Busca una película por su ID en la base de datos y si no existe consulta TMDB y la guarda."""
        # Buscar en la base de datos por ID
        movie = db.query(Movie).filter(Movie.movieid == movie_id).first()
        if movie:
            return movie
        

        # Consultar TMDB con la URL correcta usando el ID
        try:
            response = requests.get(
                f"{self.base_url}/movie/{movie.tmdbid}?api_key={self.api_key}"  # API para obtener detalles de una movie por ID
            )
            response.raise_for_status()
        except requests.RequestException:
            raise HTTPException(status_code=502, detail="Error al conectar con TMDB")

        tmdb_result = response.json()
        if not tmdb_result:
            raise HTTPException(status_code=404, detail="Pelicula no encontrada en TMDB")

        # Guardar en la base de datos si no existe
        new_movie = Movie(
            tmdbid=tmdb_result["id"],
            movietitle=tmdb_result["title"],
            moviedescription=tmdb_result.get("overview", "Descripción no disponible"),
            releasedate=tmdb_result.get("release_date") or "1900-01-01",
            posterurl=f"https://image.tmdb.org/t/p/w500{tmdb_result.get('poster_path') or ''}",
            genres=tmdb_result.get("genre_ids", []),
            tmdbrating=tmdb_result.get("vote_average", 0.0)
        )
        db.add(new_movie)
        db.commit()

        # Obtener reseñas de TMDB
        reviews = self.get_movie_with_reviews(movie_id)

        # Devolver la movie junto con las reseñas
        return {
            "movie": new_movie,
            "reviews": reviews
        }  # Retorna tanto la movie como las reseñas de TMDB

    def search_movies(self, name: str, db: Session) -> list:
        """Busca películas en TMDB por nombre y las guarda si no están en la base de datos."""
        try:
            response = requests.get(
                f"{self.base_url}/search/movie?api_key={self.api_key}&query={name}&language=es&page=1"
            )
            response.raise_for_status()
        except requests.RequestException:
            raise HTTPException(status_code=502, detail="Error al conectar con TMDB para buscar películas")

        search_results = response.json().get("results", [])
        
        if not search_results:
            return []  # Retorna lista vacía si no hay resultados
        
        # Crear lista de movies y guardarlas si no existen en la base de datos
        tmdb_movies = []
        for tmdb_movie in search_results:
            # Verificar si la movie ya existe en la base de datos
            local_movie = db.query(Movie).filter(Movie.tmdbid == tmdb_movie["id"]).first()
            if not local_movie:
                # Guardar la movie en la base de datos
                new_movie = Movie(
                    tmdbid=tmdb_movie["id"],
                    movietitle=tmdb_movie["title"],
                    moviedescription=tmdb_movie.get("overview", "Descripción no disponible"),
                    releasedate=tmdb_movie.get("release_date") or "1900-01-01",
                    posterurl=f"https://image.tmdb.org/t/p/w500{tmdb_movie.get('poster_path') or ''}",
                    genres=tmdb_movie.get("genre_ids", []),
                    tmdbrating=tmdb_movie.get("vote_average", 0.0)
                )
                db.add(new_movie)
                db.commit()
                tmdb_movies.append(new_movie)
            else:
                tmdb_movies.append(local_movie)

        return tmdb_movies
