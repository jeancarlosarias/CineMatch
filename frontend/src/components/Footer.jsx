import { Layout } from "antd";

const { Footer } = Layout;

const AppFooter = () => {
  return (
    <Footer style={{ textAlign: "center", backgroundColor: "#001529", color: "white", padding: "10px 0" }}>
      © {new Date().getFullYear()} Mi Aplicación. Todos los derechos reservados.
    </Footer>
  );
};

export default AppFooter;
