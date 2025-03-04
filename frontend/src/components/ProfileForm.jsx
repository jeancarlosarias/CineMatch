import { Form, Input, Button, Card } from "antd";

const ProfileForm = ({ user, onUpdate }) => {
  const onFinish = (values) => {
    onUpdate(values);
  };

  return (
    <Card title="Perfil" style={{ width: 400, margin: "auto", marginTop: "50px" }}>
      <Form layout="vertical" initialValues={user} onFinish={onFinish}>
        <Form.Item label="Usuario" name="username">
          <Input />
        </Form.Item>
        <Form.Item label="Correo" name="email">
          <Input />
        </Form.Item>
        <Button type="primary" htmlType="submit" block>Actualizar</Button>
      </Form>
    </Card>
  );
};

export default ProfileForm;
