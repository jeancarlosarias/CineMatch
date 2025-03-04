# CineMatch - Plataforma de Recomendación y Reseñas de Películas

CineMatch es una plataforma full stack de recomendación y reseñas de películas, donde los usuarios pueden buscar películas, ver sus detalles, escribir reseñas y marcar películas como favoritas. La aplicación consume datos de la API de TMDB y almacena información en una base de datos local.

## Requisitos del Proyecto

### Backend
- **FastAPI** para construir la API RESTful.
- **SQLAlchemy** como ORM para la gestión de la base de datos.
- **JWT** o mecanismos alternativos para la autenticación de usuarios.
- Pruebas unitarias usando **pytest**.

### Base de Datos
- **PostgreSQL**.
- Tablas:
  - **Usuarios**: userid, username, useremail, passwordhash, createddatetime, modifieddatetime.
  - **Películas**: movieid, tmdbid, movietitle, moviedescription, releasedate, posteurl, genres, tmdbrating, createddatetime.
  - **Reseñas**: reviewid, userid (FK), movieid (FK), reviewcomment, reviewrating, createddatetime, modifieddatetime.
  - **Favoritos**: favoriteid, userid (FK), movieid (FK), createddatetime.

### Frontend
- **React** para la construcción de la interfaz.
- Comunicación con el backend a través de **axios**.
- Búsqueda de películas en tiempo real y visualización de resultados.
- Funciones de registro, inicio de sesión, y gestión de favoritos.

## Endpoints

### Backend

- **GET /movies/movie?query=<name>**: Busca películas en la base de datos local. Si no se encuentra, consulta a TMDB.
- **GET /movies/{id}**: Obtiene el detalle completo de una película.
- **GET /movies/{id}/reviews**: Obtiene las reseñas de una película.
- **GET /reviews**: Obtiene las reseñas de del usuario.
- **POST /reviews**: Permite a los usuarios autenticados crear reseñas de películas.
- **DELETE /reviews/{id}**: Permite eliminar una reseña.
- **GET /users/user/favorites**: Muestra las películas favoritas de un usuario.
- **POST /users/user/{movieid}**: Permite al usuario autenticados añadir una película a favoritos.
- **DELETE /users/user/favorites/{favoriteid}**: Permite eliminar una película de favoritos.
- **GET /users/user**: Muestra los detalles del usuario.
- **POST /auth/register**: Registra un nuevo usuario.
- **POST /auth/login**: Inicia sesión de un usuario.

### API de TMDB
- El backend realiza consultas a la API de TMDB para obtener información de películas no disponibles en la base de datos local y almacena estos datos para futuras búsquedas.

## Instalación

### Backend

1. Clonar el repositorio:
    ```bash
    git clone https://github.com/jeancarlosarias/CineMatch.git
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
      DATABASE_URL=postgresql://user:passwors@server:port/db"
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

