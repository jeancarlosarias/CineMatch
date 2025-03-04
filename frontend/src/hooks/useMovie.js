import { useContext } from "react";
import { MovieContext } from "../context/MoviesContext";

const useMovie = () => {
  const context = useContext(MovieContext);

  if (!context) {
    throw new Error("useMovie no puede ser usado sin MovieProvider");
  }

  return context;
};

export default useMovie;