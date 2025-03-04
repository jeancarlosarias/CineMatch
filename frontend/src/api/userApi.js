import axios from "axios";

// URL base del backend para los usuarios
const API_URL = "http://localhost:8000/users/user";

// Agregar movie a favoritos
export const addUserFavorite = async (movieid) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API_URL}/${movieid}`,{},{
      headers:
      { 'Authorization': `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error("Error agregando película a favoritos:", error);
    throw error;
  }
};

// Obtener la lista de movie favoritas del usuario
export const getUserFavorites = async (token) => {
  try {
    console.log("Token authApi 555:", token);
    const response = await axios.get(`${API_URL}/favorites`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error obteniendo películas favoritas:", error);
    throw error;
  }
};

// Eliminar movie de la lista de favoritos
export const deleteUserFavorite = async (movieid, token) => {
  try {
    const response = await axios.delete(`${API_URL}/favorites/${movieid}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error eliminando película de favoritos:", error);
    throw error;
  }
};
