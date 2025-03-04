from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.favorite import Favorite
from app.models.movie import Movie
from app.core.security import get_current_user
from pydantic import BaseModel

router = APIRouter(prefix="/users", tags=["Users"])

class UserResponse(BaseModel):
    userid: int
    username: str
    useremail: str


# Obtener los detalles del usuario actual
@router.get("/user", response_model=UserResponse)
def get_current_user_details(
    request: Request,  # Para acceder a los headers de la peticion
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    print("Headers recibidos:", request.headers)
    return current_user

@router.post("/user/{movieid}")
def create_favorite(
    movieid: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)):
    
    existing_favorite = db.query(Favorite).filter(
        Favorite.userid == current_user.userid, Favorite.movieid == movieid).first()
    
    if existing_favorite:
        raise HTTPException(status_code=400, detail="La película ya es favorita.")

    # Crear el nuevo favorito
    new_favorite = Favorite(userid=current_user.userid, movieid=movieid)
    db.add(new_favorite)
    db.commit()
    db.refresh(new_favorite)
    return new_favorite

# Obtener las movies favoritas del usuario
@router.get("/user/favorites")
def get_user_favorites(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(Favorite).filter(Favorite.userid == current_user.userid).all()

# Eliminar una movie favorita del usuario
@router.delete("/user/favorites/{favoriteid}")
def delete_user_favorite(
    favoriteid: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Buscar el favorito especifico del usuario
    favorite_to_delete = db.query(Favorite).filter(
        Favorite.userid == current_user.userid, Favorite.favoriteid == favoriteid
    ).first()

    if favorite_to_delete is None:
        raise HTTPException(status_code=404, detail="Favorito no encontrado.")

    # Eliminar el favorito
    db.delete(favorite_to_delete)
    db.commit()

    return {"message": "Favorito eliminado exitosamente."}
