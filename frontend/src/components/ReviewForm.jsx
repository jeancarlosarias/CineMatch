import { Form, Input, Button, Rate, Card } from "antd";

const ReviewForm = ({ onSubmit, movieid }) => {
  const onFinish = (values) => {
    onSubmit({ ...values, movieid });
  };

  return (
    <Card title="Deja tu Reseña" style={{ width: 400, margin: "auto", marginTop: "20px" }}>
      <Form layout="vertical" onFinish={onFinish}>
        {/* Campo oculto para movieid */}
        <Form.Item name="movieid" initialValue={movieid} hidden>
          <Input />
        </Form.Item>
        
        <Form.Item
          label="Comentario"
          name="reviewcomment"
          rules={[{ required: true, message: "Escribe tu comentario" }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item
          label="Calificación"
          name="reviewrating"
          rules={[{ required: true, message: "Selecciona una calificación" }]}
        >
          <Rate />
        </Form.Item>

        <Button type="primary" htmlType="submit" block>
          Enviar Reseña
        </Button>
      </Form>
    </Card>
  );
};

export default ReviewForm;
