from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.review import Review
from app.core.security import get_current_user
from pydantic import BaseModel
from app.models.user import User

router = APIRouter(prefix="/reviews", tags=["Reviews"])


class ReviewCreate(BaseModel): # creando el modelo para el filtrado de la review
    movieid: int
    reviewrating: int
    reviewcomment: str


@router.get("/") 
def get_reviews_by_user(
    current_user: User = Depends(get_current_user),  # Obtiene el usuario de la sesion actual
    db: Session = Depends(get_db)
):
    """ Metodo buscador de reviews para el usuario actual """
    
    # Buscar todas las reseñas para el usuario actual
    reviews = db.query(Review).filter(Review.userid == current_user.userid).all()
    
    # Si no hay reseñas, devolveremos un error 404
    if not reviews:
        raise HTTPException(status_code=404, detail="No se encontraron reseñas para este usuario.")
    
    return reviews

@router.post("/")
def create_review(
    review_data: ReviewCreate, 
    current_user: User = Depends(get_current_user),  # Obtiene el usuario del token
    db: Session = Depends(get_db)
):
    """ Metodo creador de reseñas para el usuario actual """
    
    # Crear la reseña utilizando los datos proporcionados y el userid del usuario autenticado
    new_review = Review(
        movieid=review_data.movieid,
        userid=current_user.userid,  # Usamos el userid del usuario autenticado
        reviewrating=review_data.reviewrating,
        reviewcomment=review_data.reviewcomment
    )
    
    # Añadir la reseña a la base de datos
    db.add(new_review)
    db.commit()
    
    return {"mensaje": "Reseña creada exitosamente"}

# Eliminar una reseña
@router.delete("/{reviewid}")
def delete_review(
    reviewid: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Buscar la reseña por reviewid y userid
    review_to_delete = db.query(Review).filter(
        Review.reviewid == reviewid, Review.userid == current_user.userid
    ).first()

    if review_to_delete is None:
        raise HTTPException(status_code=404, detail="Reseña no encontrada.")

    # Eliminar la reseña
    db.delete(review_to_delete)
    db.commit()

    return {"message": "Reseña eliminada exitosamente."}