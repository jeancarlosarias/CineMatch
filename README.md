# CineMatch - Plataforma de Recomendación y Reseñas de Películas

CineMatch es una plataforma full stack de recomendación y reseñas de películas, donde los usuarios pueden buscar películas, ver sus detalles, escribir reseñas y marcar películas como favoritas. La aplicación consume datos de la API de TMDB y almacena información en una base de datos local.

## Requisitos del Proyecto

### Backend
- **FastAPI** para construir la API RESTful.
- **SQLAlchemy** como ORM para la gestión de la base de datos.
- **JWT** o mecanismos alternativos para la autenticación de usuarios.
- Pruebas unitarias usando **pytest** o **unittest**.
- Documentación automática de la API con **Swagger UI**.

### Base de Datos
- **SQLite** para el desarrollo y **PostgreSQL** para producción.
- Tablas:
  - **Usuarios**: id, nombre, email, contraseña (almacenada de forma segura).
  - **Películas**: id, título, descripción, fecha de lanzamiento, imagen.
  - **Reseñas**: id, user_id (FK), movie_id (FK), puntuación, comentario, fecha.
  - **Favoritos**: id, user_id (FK), movie_id (FK).

### Frontend
- **React** (o Vanilla JS si se prefiere) para la construcción de la interfaz.
- Comunicación con el backend a través de **fetch** o **axios**.
- Búsqueda de películas en tiempo real y visualización de resultados.
- Funciones de registro, inicio de sesión, y gestión de favoritos.

## Endpoints

### Backend

- **GET /movies?query=<término>**: Busca películas en la base de datos local. Si no se encuentra, consulta a TMDB.
- **GET /movies/{id}**: Obtiene el detalle completo de una película.
- **POST /reviews**: Permite a los usuarios autenticados crear reseñas de películas.
- **GET /users/{id}/favorites**: Muestra las películas favoritas de un usuario.
- **POST /auth/register**: Registra un nuevo usuario.
- **POST /auth/login**: Inicia sesión de un usuario.

### API de TMDB
- El backend realiza consultas a la API de TMDB para obtener información de películas no disponibles en la base de datos local y almacena estos datos para futuras búsquedas.

## Instalación

### Backend

1. Clonar el repositorio:
    ```bash
    git clone https://github.com/usuario/CineMatch.git
    cd CineMatch
    ```

2. Crear un entorno virtual y activar:
    ```bash
    python3 -m venv venv
    source venv/bin/activate  # En Windows: venv\Scripts\activate
    ```

3. Instalar dependencias:
    ```bash
    pip install -r requirements.txt
    ```

4. Configurar las variables de entorno (por ejemplo, para la API de TMDB):
    - Crea un archivo `.env` en la raíz del proyecto y agrega las siguientes variables:
      ```
      TMDB_API_KEY=<tu_api_key>
      DATABASE_URL=sqlite:///./test.db  # Para desarrollo
      ```

5. Ejecutar el servidor:
    ```bash
    uvicorn main:app --reload
    ```

### Frontend

1. Navegar al directorio del frontend:
    ```bash
    cd frontend
    ```

2. Instalar dependencias:
    ```bash
    npm install
    ```

3. Ejecutar el servidor de desarrollo:
    ```bash
    npm start
    ```

4. Abrir en el navegador: [http://localhost:3000](http://localhost:3000)

## Pruebas

Para ejecutar las pruebas unitarias del backend, usa el siguiente comando:
```bash
pytest
