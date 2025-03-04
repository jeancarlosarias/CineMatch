from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.core.security import (create_access_token, get_password_hash, verify_password)
from pydantic import BaseModel

router = APIRouter(prefix="/auth", tags=["Authentication"])

class UserCreate(BaseModel):
    username: str
    useremail: str
    passwordhash: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str

# Registro del usuario
@router.post("/register", response_model=TokenResponse)
def register_user(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    # Verificar si el email ya existe
    existing_user = db.query(User).filter(
        User.useremail == user_data.useremail
    ).first()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email ya registrado"
        )

    # Crear un nuevo usuario
    new_user = User(
        username=user_data.username,
        useremail=user_data.useremail,
        passwordhash=get_password_hash(user_data.passwordhash),
        
    )
    
    db.add(new_user)
    db.commit()
    
    # Generar un token JWT
    return {
        "access_token": create_access_token({"sub": str(new_user.userid)}),
        "token_type": "bearer",
        "user": {
            "id": new_user.userid,
            "username": new_user.username,
            "email": new_user.useremail
    }
    }

# Login del usuario
@router.post("/login", response_model=TokenResponse)
def login_user(
    user_data: dict = Body(...),
    db: Session = Depends(get_db)
):
    useremail = user_data.get("email")
    password = user_data.get("password")

    user = db.query(User).filter(User.useremail == useremail).first()

    if not user or not verify_password(password, user.passwordhash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales invalidas"
        )

    return {
        "access_token": create_access_token({"sub": str(user.userid)}),
        "token_type": "bearer",
        "user": {
            "id": user.userid,
            "username": user.username,
            "email": user.useremail
    }
    }