import { Layout, Menu, Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const { Header } = Layout;

const NavBar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); // Redirige al usuario a la pagina de inicio despues de cerrar sesion
  };

  return (
    <Header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#001529",
      }}
    >
      <div style={{ color: "red", fontSize: "20px", fontWeight: "bold" }}>
        <Link to="/" style={{ color: "red" }}>CineMatch</Link>
      </div>
      <Menu theme="dark" mode="horizontal">
        <Menu.Item key="1"><Link to="/">Inicio</Link></Menu.Item>
        <Menu.Item key="2"><Link to="/profile">Perfil</Link></Menu.Item>
        <Menu.Item key="3">
          <Button type="link" onClick={handleLogout}>Cerrar sesión</Button>
        </Menu.Item>
        <Menu.Item key="4"><Link to="/login">Iniciar sesión</Link></Menu.Item>
      </Menu>
    </Header>
  );
};

export default NavBar;
