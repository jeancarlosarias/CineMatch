import { Card, Rate, Button, Typography } from "antd";
import { StarFilled, StarOutlined } from "@ant-design/icons";

const MovieCard = ({ 
  movie, 
  onSelect, 
  onFavoriteToggle, 
  isFavorite 
}) => {
  return (
    <Card
      hoverable
      cover={
        <img 
          alt={movie.movietitle} 
          src={movie.posterurl} 
          style={{ height: "360px", objectFit: "cover" }}
        />
      }
      style={{ width: 240 }}
      actions={[
        <Button 
          type="primary" 
          onClick={() => onSelect(movie.movieid)}
        >
          Ver Detalles
        </Button>
      ]}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography.Text strong>{movie.movietitle}</Typography.Text>
        <Button
          type="text"
          icon={isFavorite ? <StarFilled style={{ color: "#faad14" }} /> : <StarOutlined />}
          onClick={() => onFavoriteToggle(movie.movieid)}
        />
      </div>

      <div style={{ margin: "10px 0" }}>
        <Rate 
          disabled 
          value={Math.round(movie.tmdbrating)} 
          allowHalf 
        />
        <span style={{ marginLeft: 8 }}>
          ({movie.releasedate?.split('-')[0]})
        </span>
      </div>
    </Card>
  );
};

export default MovieCard;