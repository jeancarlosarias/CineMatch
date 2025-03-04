import { Form, Input, Button, Card } from "antd";

const LoginForm = ({ onLogin }) => {
  const onFinish = (values) => {
    onLogin(values);
  };

  return (
    <Card title="Iniciar Sesión" style={{ width: 300, margin: "auto", marginTop: "50px" }}>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item label="Correo" name="email" rules={[{ required: true, message: "Ingresa tu correo" }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Contraseña" name="password" rules={[{ required: true, message: "Ingresa tu contraseña" }]}>
          <Input.Password />
        </Form.Item>
        <Button type="primary" htmlType="submit" block>Entrar</Button>
      </Form>
    </Card>
  );
};

export default LoginForm;
