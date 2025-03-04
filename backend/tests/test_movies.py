from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from backend.app.main import app
from backend.app.database import get_db, Base
from backend.app.models.movie import Movie
import pytest

client = TestClient(app)

# Fixture para mockear la base de datos, basicamente probando con data falsa con valores ya definidos chico
@pytest.fixture(scope="module")
def test_db():
    from sqlalchemy import create_engine
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(bind=engine)
    with Session(engine) as session:
        yield session
        session.rollback()

def test_search_movies_local(test_db: Session):
    # 1 - Preparar datos de prueba
    test_movie = Movie(
        tmdbId=123,
        movieTitle="Test Movie",
        movieDescription="Una película de prueba",
        releaseDate="2024-01-01",
        tmdbRating=8.5
    )
    test_db.add(test_movie)
    test_db.commit()

    # 2 - Ejecutar busqueda
    response = client.get("/movies?query=prueba")
    
    # 3 - Verificar resultados
    assert response.status_code == 200
    results = response.json()
    assert len(results) > 0
    assert results[0]["movieTitle"] == "Test Movie"

def test_search_movies_tmdb(mocker, test_db: Session):
    # 1 - Mockear la respuesta de TMDB
    mock_response = {
        "results": [{
            "id": 456,
            "title": "TMDB Movie",
            "overview": "Descripción desde TMDB",
            "release_date": "2024-02-15",
            "poster_path": "/poster.jpg",
            "genre_ids": [18],
            "vote_average": 7.8
        }]
    }
    mocker.patch("requests.get", return_value=Mock(json=lambda: mock_response))

    # 2 - Ejecutar busqueda
    response = client.get("/movies?query=alien")

    # 3 - Verificar que se guardo en DB
    db_movie = test_db.query(Movie).filter(Movie.tmdbId == 456).first()
    assert db_movie is not None
    assert db_movie.movieTitle == "TMDB Movie"

    # 4 - Verificar respuesta HTTP
    assert response.status_code == 200
    assert response.json()[0]["tmdbId"] == 456

def test_invalid_search():
    response = client.get("/movies?query=")  # Query vacio
    assert response.status_code == 422  # Entidad no procesable

def test_get_movie_details(test_db: Session):
    # 1 - Crear película de prueba
    test_movie = Movie(movieTitle="Detalle Test", tmdbId=789)
    test_db.add(test_movie)
    test_db.commit()

    # 2 - Obtener detalles
    response = client.get(f"/movies/{test_movie.movieId}")
    assert response.status_code == 200
    assert response.json()["movieTitle"] == "Detalle Test"

def test_get_nonexistent_movie():
    response = client.get("/movies/9999")
    assert response.status_code == 404