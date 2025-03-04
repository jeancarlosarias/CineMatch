import { Form, Input, Button, Rate, Card } from "antd";

const ReviewForm = ({ onSubmit }) => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    onSubmit(values); // Llamamos a la funcion onSubmit con los valores del formulario
    form.resetFields(); // Limpiar los campos despues de enviar
  };

  return (
    <Card style={{ width: 500, margin: "auto" }}>
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item label="Comentario" name="reviewcomment" rules={[{ required: true, message: "Ingresa tu comentario" }]}>
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item label="Puntuación" name="reviewrating" rules={[{ required: true, message: "Ingresa una puntuación" }]}>
          <Rate />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Enviar Reseña
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ReviewForm;
