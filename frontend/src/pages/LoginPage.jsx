import { Form, Input, Button, Card, Typography, Layout, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useAuth from '../hooks/useAuth';  // Importamos el hook de autenticación
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

const { Content } = Layout;
const { Title } = Typography;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const { login, token } = useAuth();  // Usamos el hook
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const { email, password } = values;
    setLoading(true);

    try {
      // Llamamos a la funcion de login
      await login(email, password); 
      console.log("Token guardado:", localStorage.getItem("token"));
      
      // Redirigimos a la pagina de perfil después de un login exitoso
      navigate('/profile'); 
    } catch (error) {
      console.error('Error en el login:', error);
      message.error('Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <NavBar />
      <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <Card style={{ width: 400, padding: 20 }}>
          <Title level={3} style={{ textAlign: 'center' }}>Iniciar Sesión</Title>
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Ingrese su email' }]}>
              <Input type="email" placeholder="Correo electrónico" />
            </Form.Item>
            <Form.Item label="Contraseña" name="password" rules={[{ required: true, message: 'Ingrese su contraseña' }]}>
              <Input.Password placeholder="Contraseña" />
            </Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>Ingresar</Button>
          </Form>
          <div style={{ textAlign: 'center', marginTop: 15 }}>
            <Link to="/register">¿No tienes cuenta? Regístrate aquí</Link>
          </div>
        </Card>
      </Content>
      <Footer />
    </Layout>
  );
};

export default LoginPage;
