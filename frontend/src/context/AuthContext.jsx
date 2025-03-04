import React, { createContext, useState, useEffect, useContext } from "react";
import { registerUser, loginUser, getUserData } from "../api/authApi";
// Creamos el contexto de autenticacion
export const AuthContext = createContext();

// Componente AuthProvider que maneja el estado de autenticacion
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Estado para los datos del usuario
  const [token, setToken] = useState(localStorage.getItem("token") || ""); // Estado para el token
  const [loading, setLoading] = useState(true); // Para saber si estamos cargando
  const [error, setError] = useState(null); // Estado para manejar errores

  // Funcion para hacer login
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await loginUser(email, password);  // Consumimos el loginUser de authApi
      setUser(data.user); // Guardamos el usuario en el estado
      localStorage.setItem('token', data.access_token); // Guardamos el token en localStorage
      setToken(data.access_token); // Actualizamos el token en el estado
      setLoading(false);
    } catch (error) {
      setError(error.message); // Manejamos el error
      setLoading(false);
    }
  };

  // Funcion para registrar un usuario
  const register = async (username, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await registerUser(username, email, password); // Consumimos el registerUser de authApi
      setUser(data.user); // Guardamos el usuario en el estado
      localStorage.setItem('token', data.access_token); // Guardamos el token en localStorage
      setToken(data.access_token); // Actualizamos el token en el estado
      setLoading(false);
    } catch (error) {
      setError(error.message); // Manejamos el error
      setLoading(false);
    }
  };

  // Funcion para obtener los datos del usuario
  const fetchUserData = async (token) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUserData(token); // Pasamos el token y obtenemos los datos del usuario
      setUser(data.user); // Guardamos el usuario en el estado
      setLoading(false); // Finalizamos la carga
    } catch (error) {
      setError(error.message); // Manejamos el error
      setLoading(false); // Finalizamos la carga en caso de error
    }
  };

  // Si ya tenemos un token, intentamos obtener los datos del usuario
  useEffect(() => {
    if (token) {
      fetchUserData(token);
    } else {
      setLoading(false);
    }
  }, [token]);

  // Funcion para hacer logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token'); // Eliminamos el token de localStorage
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, error, fetchUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook para usar el contexto de autenticacion
export const useAuth = () => {
  return useContext(AuthContext);
};
