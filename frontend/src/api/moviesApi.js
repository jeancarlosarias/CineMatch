import axios from "axios";

// URL base del backend
const API_URL = "http://localhost:8000/movies";

// Obtener detalles de una movie por ID
export const getMovieDetails = async (movieId) => {
  try {
    const response = await axios.get(`${API_URL}/${movieId}`);
    return response.data;
  } catch (error) {
    console.error("Error obteniendo detalles de la película:", error);
    throw error;
  }
};


// Buscar una movie por nombre
export const searchMovieByName = async (name) => {
  try {
    // Codificar el nombre de la movie para evitar problemas con caracteres especiales en la URL
    const encodedName = encodeURIComponent(name);

    // Realizar la solicitud a la URL actualizada
    const response = await axios.get(`${API_URL}/movie/${encodedName}`);
    return response.data;
  } catch (error) {
    console.error("Error buscando la pelicula por nombre:", error);
    throw error;
  }
};

// Obtener reseñas de una movie por ID
export const getMovieReviews = async (movieId) => {
  try {
    const response = await axios.get(`${API_URL}/movie/${movieId}/reviews`);
    return response.data;
  } catch (error) {
    console.error("Error obteniendo reseñas de la pelicula:", error);
    throw error;
  }
};
