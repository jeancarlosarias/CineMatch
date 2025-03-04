
import { Form, Input, Button, Card, Typography, Layout, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useAuth from '../hooks/useAuth'; 
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

const { Content } = Layout;
const { Title } = Typography;

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const { register } = useAuth(); 
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const { useremail, username, password } = values;
    setLoading(true);

    try {
      await register(username, useremail, password);  // Llamamos a la funcion del API
      message.success('Registro exitoso, inicia sesión ahora.');
      navigate('/profile');
    } catch (error) {
      message.error('Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <NavBar />
      <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <Card style={{ width: 400, padding: 20 }}>
          <Title level={3} style={{ textAlign: 'center' }}>Registrarse</Title>
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item label="Nombre de Usuario" name="username" rules={[{ required: true, message: 'Ingrese su nombre' }]}>
              <Input placeholder="Nombre de usuario" />
            </Form.Item>
            <Form.Item label="Email" name="useremail" rules={[{ required: true, message: 'Ingrese su email' }]}>
              <Input type="email" placeholder="Correo electrónico" />
            </Form.Item>
            <Form.Item label="Contraseña" name="password" rules={[{ required: true, min: 6, message: 'Debe tener al menos 6 caracteres' }]}>
              <Input.Password placeholder="Contraseña" />
            </Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>Registrarse</Button>
          </Form>
          <div style={{ textAlign: 'center', marginTop: 15 }}>
            <Link to="/login">¿Ya tienes cuenta? Inicia sesión</Link>
          </div>
        </Card>
      </Content>
      <Footer />
    </Layout>
  );
};

export default RegisterPage;
