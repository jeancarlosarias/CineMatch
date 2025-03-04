import { createContext, useContext, useState, useEffect } from "react";
import { searchMovieByName, getMovieReviews, getMovieDetails } from "../api/moviesApi";

// Crear el contexto
export const MovieContext = createContext();

// Proveedor del contexto
export const MovieProvider = ({ children }) => {
  const [movies, setMovies] = useState([]); // Lista de movies
  const [selectedMovie, setSelectedMovie] = useState(null); // movie seleccionada
  const [reviews, setReviews] = useState([]); // Reseñas de la movie seleccionada
  const [loading, setLoading] = useState(false); // Estado de carga
  const [error, setError] = useState(null); // Estado de error

  // Obtener detalles de una movie por ID
  const fetchMovieDetails = async (movieId) => {
    setLoading(true);
    try {
      const movieData = await getMovieDetails(movieId);
      setSelectedMovie(movieData);
      // Verifica que los datos son los correctos
      setError(null);
    } catch (err) {
      setError("Error al obtener detalles de la película.");
    } finally {
      setLoading(false);
    }
  };
  
  // Obtener reseñas de una movie por ID
  const fetchMovieReviews = async (movieId) => {
    setLoading(true);
    try {
      const reviewsData = await getMovieReviews(movieId);
      setReviews(reviewsData);
      setError(null);
    } catch (err) {
      setError("Error al obtener reseñas de la película.");
    } finally {
      setLoading(false);
    }
  };

  // Buscar movie por nombre
  const searchMovie = async (name) => {
    setLoading(true);
    try {
      const searchResults = await searchMovieByName(name);
      setMovies(searchResults);
      setError(null);
    } catch (err) {
      setError("Error al buscar la película.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MovieContext.Provider
      value={{
        movies,
        selectedMovie,
        reviews,
        loading,
        error,
        fetchMovieDetails,
        fetchMovieReviews,
        searchMovie,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useMovie = () => {
  return useContext(MovieContext);
};
