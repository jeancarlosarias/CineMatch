import { Layout, Row, Col, Button, Carousel, Card, Typography, Input, Spin, Modal, message } from "antd";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import ReviewCard from "../components/ReviewCard";
import ReviewForm from "../components/ReviewForm";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import useMovie from "../hooks/useMovie";
import { createReview } from "../api/reviewsApi"; // Importamos la función para crear reseñas
import { addUserFavorite, getUserFavorites, deleteUserFavorite } from "../api/userApi"; // Importamos las funciones de favoritos

const { Content } = Layout;

const { Title, Paragraph } = Typography;

const HomePage = () => {
  const { movies, loading, searchMovie, fetchMovieDetails, selectedMovie } = useMovie();
  const [selectedTmdbId, setSelectedTmdbId] = useState(null);
  const [movieDetails, setMovieDetails] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [reviews, setReviews] = useState([]); // Estado para las reseñas
  const [userFavorites, setUserFavorites] = useState([]); // Estado para las movies favoritas
  const token = localStorage.getItem('token');
  

  useEffect(() => {
    
    console.log("Token guardado:", token);

    // Obtener las movies favoritas del usuario cuando el componente se monta
    if (token) {
      getUserFavorites(token)
        .then((favorites) => setUserFavorites(favorites))
        .catch((error) => console.error("Error al obtener las películas favoritas:", error));
    }
  }, []);

  // Funcion para obtener las reseñas de la movie seleccionada
  const fetchMovieReviews = async (tmdbId) => {
    try {
      const reviewsData = await fetchMovieDetails(tmdbId);
      if (reviewsData.length === 0) {
        // Si no hay reseñas, asignar un ReviewCard con un mensaje invitando a dejar reseñas
        setReviews([{ username: "No hay reseñas", reviewcomment: "Sé el primero en dejar una reseña sobre esta película.", reviewrating: 0 }]);
      } else {
        setReviews(reviewsData);
      }
    } catch (error) {
      console.error("Error fetching movie reviews:", error);
      setReviews([]);
    }
  };

  const handleSearch = (e) => {
    searchMovie(e.target.value);
  };

  const handleMovieSelect = async (tmdbId) => {
    setSelectedTmdbId(tmdbId);
    try {
      const details = await fetchMovieDetails(tmdbId);
      setMovieDetails(details);
      setIsModalVisible(true);
    } catch (error) {
      console.error("Error fetching movie details:", error);
    }
  };

  const handleReviewSelect = (tmdbId) => {
    fetchMovieReviews(tmdbId); // Llama a la funcion para obtener las reseñas
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setMovieDetails(null);
  };

  const handleReviewSubmit = async (reviewData) => {
    if (!token) {
      message.error("Por favor, inicia sesión para dejar una reseña.");
      return;
    }

    try {
      await createReview(reviewData, token);
      message.success("Reseña enviada con éxito");
      fetchMovieReviews(selectedTmdbId); // Recargar reseñas despues de enviar
    } catch (error) {
      message.error("Error al enviar la reseña");
    }
  };

  // Funcion para agregar o quitar de favoritos
  const handleFavoriteToggle = async (movieId) => {
    if (!token) {
      message.error("Por favor, inicia sesión para agregar o quitar películas de favoritos.");
      return;
    }

    if (userFavorites.some((fav) => fav.movieid === movieId)) {
      // Si la movie ya esta en favoritos, la eliminamos
      try {
        console.log("token favoritos:", token);
        await deleteUserFavorite(movieId, token);
        setUserFavorites(userFavorites.filter((fav) => fav.movieid !== movieId)); // Actualizar el estado de favoritos
        message.success("Película eliminada de favoritos");
      } catch (error) {
        message.error("Error al eliminar la película de favoritos");
      }
    } else {
      // Si no esta en favoritos, la agregamos
      try {
        console.log("token favoritos:", token);
        await addUserFavorite(movieId, token);
        setUserFavorites([...userFavorites, { movieid: movieId }]); // Actualizar el estado de favoritos
        message.success("Película agregada a favoritos");
      } catch (error) {
        message.error("Error al agregar la película a favoritos");
      }
    }
  };

  return (
    <Layout>
      <NavBar />
      <Content style={{ padding: "50px" }}>
        <Carousel autoplay>
          <div><img src="https://wallpapercat.com/w/full/1/9/1/118652-3840x2160-desktop-4k-avengers-background-image.jpg" alt="Banner 1" style={{ height: "400px", width: "auto" }} /></div>
          <div><img src="https://media.vogue.es/photos/5ff3221f2361f90ef2d5dbb5/4:3/w_3068,h_2301,c_limit/MCDBADR_EC061.jpg" alt="Banner 2" style={{ height: "400px", width: "auto" }} /></div>
        </Carousel>

        <div style={{ textAlign: "center", margin: "20px 0" }}>
          <Input placeholder="Busca una película por nombre..." onChange={handleSearch} style={{ width: 300 }} />
        </div>

        <div style={{ textAlign: "center", margin: "50px 0" }}>
          <Title level={2}>Películas Destacadas</Title>
          <Row gutter={[16, 16]} justify="center">
            {loading ? (
              <Spin size="large" />
            ) : (
              movies.map((movie) => (
                <Col key={movie.movie.tmdbid}>
                  <div style={{ border: "1px solid #ddd", padding: "20px", width: "300px", textAlign: "center" }}>
                    <div style={{ marginBottom: "10px" }}>
                      <img 
                        src={movie.movie.posterurl} 
                        alt={movie.movie.movietitle} 
                        style={{ width: "100%", height: "auto" }} 
                      />
                    </div>
                    <div>
                      <Title level={4}>{movie.movie.movietitle}</Title>
                      <Paragraph>{movie.movie.description}</Paragraph>
                      <Button type="primary" onClick={() => handleReviewSelect(movie.movie.tmdbid)}>
                        Ver Reseñas
                      </Button>
                      <Button 
                        type="default" 
                        onClick={() => handleMovieSelect(movie.movie.movieid)} 
                        style={{ marginTop: "10px" }}>
                        Ver Detalles
                      </Button>
                      <Button 
                        type="default" 
                        onClick={() => handleFavoriteToggle(movie.movie.movieid)} 
                        style={{ marginTop: "10px" }}>
                        {userFavorites.some((fav) => fav.movieid === movie.movie.movieid) ? "Quitar de Favoritos" : "Agregar a Favoritos"}
                      </Button>
                    </div>
                  </div>
                </Col>
              ))
            )}
          </Row>
        </div>

        <Modal
          title={selectedMovie?.movietitle || "Cargando..."}
          visible={isModalVisible}
          onCancel={handleCloseModal}
          footer={null}
          width={800}
        >
          {selectedMovie ? (
            <div style={{ display: "flex" }}>
              <img
                src={selectedMovie?.posterurl}
                alt={selectedMovie?.movietitle}
                style={{ width: "300px", marginRight: "20px" }}
              />
              <div>
                <Title level={3}>Descripción</Title>
                <Paragraph>{selectedMovie?.moviedescription}</Paragraph>
                <Title level={4}>Fecha de estreno</Title>
                <Paragraph>{selectedMovie?.releasedate}</Paragraph>
                <Title level={4}>Puntuación TMDB</Title>
                <Paragraph>{selectedMovie?.tmdbrating}</Paragraph>
              </div>
            </div>
          ) : (
            <Spin size="large" />
          )}
        </Modal>

        <div style={{ textAlign: "center", margin: "50px 0" }}>
          <Title level={2}>Reseñas de la Película Seleccionada</Title>
          {selectedTmdbId && reviews.length > 0 ? (
            <Row gutter={[16, 16]} justify="center">
              {reviews.map((review, index) => (
                <Col key={index}>
                  <ReviewCard review={review} />
                </Col>
              ))}
            </Row>
          ) : selectedTmdbId && reviews.length === 0 ? (
            <Row justify="center">
              <Col>
                <ReviewCard review={{ username: "No hay reseñas", reviewcomment: "Sé el primero en dejar una reseña sobre esta película." }} />
              </Col>
            </Row>
          ) : (
            <Paragraph>Selecciona una película para ver las reseñas.</Paragraph>
          )}
        </div>

        <div style={{ textAlign: "center", margin: "50px 0" }}>
          <Title level={2}>Deja tu Reseña</Title>
          {token ? (
            <ReviewForm onSubmit={handleReviewSubmit} movieid={selectedTmdbId}/>
          ) : (
            <Paragraph>Por favor, inicia sesión para dejar una reseña.</Paragraph>
          )}
        </div>
        <div style={{ textAlign: "center", margin: "50px 0" }}>
          <Link to="/register">
            <Button type="primary" size="large" style={{ marginTop: 20 }}>
              Únete a la Comunidad
            </Button>
          </Link>
        </div>
      </Content>
      <Footer />
    </Layout>
  );
};

export default HomePage;
