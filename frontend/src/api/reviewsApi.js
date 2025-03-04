import axios from "axios";

// URL base del backend para las reseñas
const API_URL = "http://localhost:8000/reviews";

// Obtener todas las reseñas del usuario actual
export const getUserReviews = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/`, {
      headers: { 'Authorization': `Bearer ${token}` }, // Enviar token para autenticacion
    });
    return response.data;
  } catch (error) {
    console.error("Error obteniendo reseñas del usuario:", error);
    throw error;
  }
};

// Crear una nueva reseña
export const createReview = async (reviewData, token) => {
  try {
    const response = await axios.post(`${API_URL}/`, reviewData, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error creando reseña:", error);
    throw error;
  }
};

// Eliminar una reseña por ID
export const deleteReview = async (reviewId, token) => {
  try {
    const response = await axios.delete(`${API_URL}/${reviewId}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error eliminando reseña:", error);
    throw error;
  }
};
