from fastapi import FastAPI
from app.database import engine
from app.models import user as _user
from app.models import movie as _movie
from app.models import review as _review
from app.models import favorite as _favorite
from app.routes import auth, movie, review, user
from fastapi.middleware.cors import CORSMiddleware



_user.Base.metadata.create_all(bind=engine)
_movie.Base.metadata.create_all(bind=engine)
_review.Base.metadata.create_all(bind=engine)
_favorite.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Configuracion CORS, el mecanismo de seguridad que restinge las olicitudes HTTP
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir las rutas
app.include_router(auth.router)
app.include_router(movie.router)
app.include_router(review.router)
app.include_router(user.router)