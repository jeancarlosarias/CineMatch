import React, { useState, useEffect } from 'react';
import { List, Button, message, Spin } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import NavBar from "../components/NavBar";

const FavoritePage = () => {
  const [favorites, setFavorites] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    axios.get('/api/favorites')
      .then(response => {
        setFavorites(response.data);
      })
      .catch(error => {
        message.error('Error al obtener las películas favoritas');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleRemoveFavorite = (movieId) => {
    setLoading(true);
    axios.delete(`/api/favorites/${movieId}`)
      .then(() => {
        setFavorites(favorites.filter(movie => movie.id !== movieId));
        message.success('Película eliminada de favoritos');
      })
      .catch(() => {
        message.error('Error al eliminar la película de favoritos');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <div>
        <Header />
        <NavBar />
      <h2>Películas Favoritas</h2>
      <List
        itemLayout="horizontal"
        dataSource={favorites}
        renderItem={movie => (
          <List.Item
            actions={[
              <Button 
                type="text" 
                icon={<DeleteOutlined />} 
                onClick={() => handleRemoveFavorite(movie.id)} 
              />
            ]}
          >
            <List.Item.Meta
              title={movie.title}
              description={movie.description}
            />
          </List.Item>
        )}
      />
      <Footer/>
    </div>
  );
};

export default FavoritePage;
