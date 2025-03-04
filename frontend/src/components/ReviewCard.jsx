import { Card, Rate, Typography } from "antd";

const { Paragraph } = Typography;

const ReviewCard = ({ review }) => {
  return (
    <Card style={{ marginBottom: 10 }}>
      <Card.Meta
        title={review.username}
        description={
          review.username === "No hay reseñas" ? (
            <Paragraph type="secondary">{review.reviewcomment}</Paragraph>
          ) : (
            review.reviewcomment
          )
        }
      />
      {review.username !== "No hay reseñas" && <Rate disabled defaultValue={review.reviewrating} />}
    </Card>
  );
};

export default ReviewCard;
