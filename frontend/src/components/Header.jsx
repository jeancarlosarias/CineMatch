import { Layout, Menu } from "antd";

const { Header } = Layout;

const AppHeader = () => {
  return (
    <Header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#001529" }}>
      <div style={{ color: "white", fontSize: "20px", fontWeight: "bold" }}>Mi Aplicación</div>
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
        <Menu.Item key="1">Inicio</Menu.Item>
        <Menu.Item key="3">Contacto</Menu.Item>
      </Menu>
    </Header>
  );
};

export default AppHeader;
