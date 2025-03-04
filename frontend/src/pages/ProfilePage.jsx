import React, { useEffect, useState } from "react";
import { Row, Col, Layout, Modal, Spin, Button, Typography, message } from "antd";
import { StarFilled, StarOutlined } from "@ant-design/icons";
import { getUserFavorites } from "../api/userApi";
import { getUserData } from "../api/authApi"; 
import MovieCard from "../components/MovieCard";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { Content } from "antd/es/layout/layout";
import { addUserFavorite, deleteUserFavorite } from "../api/userApi";
import {getMovieDetails} from "../api/moviesApi";

const { Title, Paragraph, Text } = Typography;

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [selectedMovieDetails, setSelectedMovieDetails] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [favoritesList, setFavoritesList] = useState([]);
  const token = localStorage.getItem('token') || '';

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [userDataResponse, favoritesResponse] = await Promise.all([
          getUserData(token),
          getUserFavorites(token)
        ]);

        setUserData(userDataResponse);
        
        // Obtener detalles con validacion
        const moviesDetails = await Promise.all(
          favoritesResponse.map(async (fav) => {
            try {
              console.log("fav.movieid:", fav.movieid)
              const details = await getMovieDetails(fav.movieid);
              console.log("detalles de movie:", details)
              return details?.movieid && details.movietitle ? details : null;
            } catch (error) {
              console.error(`Error cargando ${fav.movieid}:`, error);
              return null;
            }
          })
        );
        
        // Filtrado con validacion de estructura completa
        const validMovies = moviesDetails.filter(movie => 
          movie &&
          typeof movie.movieid === 'number' &&
          movie.movietitle &&
          movie.posterurl
        );
        
        setFavoriteMovies(validMovies);
        setFavoritesList(favoritesResponse.filter(fav => 
          validMovies.some(movie => movie.movieid === fav.movieid)
        ));
      } catch (error) {
        console.error("Error al cargar datos:", error);
        message.error("Error al cargar el perfil");
      }
    };

    if (token) fetchUserData();
  }, [token, getMovieDetails]);

  const isFavorite = (movieId) => {
    return favoritesList.some(fav => fav.movieid === movieId);
  };

  const getFavoriteId = (movieId) => {
    const favorite = favoritesList.find(fav => fav.movieid === movieId);
    return favorite ? favorite.favoriteid : null;
  };

  const handleMovieSelect = async (movieid) => {
    try {
      const details = await getMovieDetails(movieid);
      if (details?.movieid) {
        setSelectedMovieDetails(details);
        
        setIsModalVisible(true);
      }
    } catch (error) {
      message.error("Error al cargar detalles de la película");
    }
  };

  const handleFavoriteToggle = async (movieid) => {
    if (!token) {
      message.error("Debes iniciar sesión para manejar favoritos");
      return;
    }

    try {
      if (isFavorite(movieid)) {
        const favoriteId = getFavoriteId(movieid);
        await deleteUserFavorite(favoriteId, token);
        
        setFavoritesList(prev => prev.filter(fav => fav.movieid !== movieid));
        setFavoriteMovies(prev => prev.filter(movie => movie?.movieid === movieid));
        message.success("Eliminada de favoritos");
      } else {
        const newFavorite = await addUserFavorite(movieid, token);
        try {
          const newMovie = await getMovieDetails(movieid);
          if (newMovie?.movieid && newMovie.movietitle) {
            setFavoritesList(prev => [...prev, newFavorite]);
            setFavoriteMovies(prev => [...prev, newMovie]);
            message.success("Agregada a favoritos");
          }
        } catch (error) {
          console.error("Error obteniendo detalles:", error);
          message.error("Error al agregar la película");
        }
      }
    } catch (error) {
      message.error("Error al actualizar favoritos");
    }
  };

  const getInitial = (name) => name?.charAt(0).toUpperCase() || '';

  return (
    <Layout>
      <NavBar />
      <Content style={{ padding: "50px" }}>
        {userData ? (
          <div>
            {/* Sección de perfil del usuario */}
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              marginBottom: "40px",
              padding: "20px",
              backgroundColor: "#f0f2f5",
              borderRadius: "8px"
            }}>
              <div 
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  backgroundColor: "#1890ff",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "40px",
                  color: "white",
                  fontWeight: "bold",
                  marginRight: "20px"
                }}
              >
                {getInitial(userData.username)}
              </div>
              <div>
                <Title level={3} style={{ marginBottom: 0 }}>{userData.username}</Title>
                <Paragraph type="secondary">{userData.useremail}</Paragraph>
              </div>
            </div>

            {/* Listado de favoritos con validacion en tiempo real */}
            <div style={{ marginTop: "30px" }}>
              <Title level={3} style={{ marginBottom: "24px" }}>Mis Favoritos</Title>
              {favoriteMovies.length > 0 ? (
                <Row gutter={[24, 24]}>
                  {favoriteMovies
                    .filter(movie => movie?.movieid && movie.movietitle)
                    .map(movie => (
                      <Col key={movie.movieid} xs={24} sm={12} md={8} lg={6}>
                        <MovieCard 
                          movie={movie}
                          onSelect={() => handleMovieSelect(movie.movieid)}
                          isFavorite={isFavorite(movie.movieid)}
                          onFavoriteToggle={() => handleFavoriteToggle(movie.movieid)}
                        />
                      </Col>
                    ))}
                </Row>
              ) : (
                <Paragraph style={{ textAlign: "center", fontSize: "16px" }}>
                  Aún no tienes películas favoritas
                </Paragraph>
              )}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", margin: "40px 0" }}>
            <Spin size="large" />
          </div>
        )}

        {/* Modal con protección de datos mejorada */}
        <Modal
          title={selectedMovieDetails?.movietitle || "Detalles de la película"}
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          width={800}
          destroyOnClose
        >
          {selectedMovieDetails?.movieid ? (
            <div style={{ display: "flex", gap: "24px", marginTop: "24px" }}>
              <img
                src={selectedMovieDetails.posterurl}
                alt={selectedMovieDetails.movietitle || "Poster de película"}
                style={{ 
                  width: "300px", 
                  height: "450px", 
                  objectFit: "cover",
                  borderRadius: "8px"
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: "16px" }}>
                  <Button
                    type={isFavorite(selectedMovieDetails.movieid) ? "primary" : "default"}
                    onClick={() => handleFavoriteToggle(selectedMovieDetails.movieid)}
                    icon={isFavorite(selectedMovieDetails.movieid) ? 
                      <StarFilled /> : <StarOutlined />}
                    style={{ marginBottom: "16px" }}
                  >
                    {isFavorite(selectedMovieDetails.movieid)
                      ? "Quitar de favoritos"
                      : "Agregar a favoritos"}
                  </Button>
                </div>
                
                <Paragraph>
                  <Text strong>Descripción: </Text>
                  {selectedMovieDetails.moviedescription || "Descripción no disponible"}
                </Paragraph>
                
                <Paragraph>
                  <Text strong>Fecha de estreno: </Text>
                  {selectedMovieDetails.releasedate || "Fecha desconocida"}
                </Paragraph>
                
                <Paragraph>
                  <Text strong>Rating TMDB: </Text>
                  {selectedMovieDetails.tmdbrating?.toFixed(1) || "N/A"}
                </Paragraph>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center", margin: "40px 0" }}>
              <Spin size="large" />
            </div>
          )}
        </Modal>
      </Content>
      <Footer />
    </Layout>
  ); 
};

export default ProfilePage;