import axios from "axios";

// URL base del backend
const API_URL = "http://localhost:8000/auth";

// Funcion para registrar un nuevo usuario
export const registerUser = async (username, useremail, password) => {
  try {
    // Realizamos la solicitud POST al backend para el registro del usuario
    const response = await axios.post(`${API_URL}/register`, {
      username,
      useremail,
      passwordhash: password, 
    });

    // Retornamos la respuesta con el token y los datos del usuario
    console.log("Respuesta de registerUser:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error en el registro del usuario:", error);
    throw error;
  }
};

// Funcion para hacer login con el correo electronico y la contraseña
export const loginUser = async (email, password) => {
  try {
    // Realizamos la solicitud POST al backend para el login del usuario
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password,
    });

    // Retornamos la respuesta con el token y los datos del usuario
    console.log("Respuesta de loginUser:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error en el login del usuario:", error);
    throw error;
  }
};

// Funcion para obtener informacion del usuario actual 
export const getUserData = async (token) => {
  try {
    console.log("Token authApi 55:", token);
    const response = await axios.get("http://localhost:8000/users/user", {
      headers: {
        'Authorization': `Bearer ${token}`, // Mandamos el token
      },
    });
    console.log("Respuesta de getUserData:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error obteniendo los datos del usuario:", error);
    throw error;
  }
};
