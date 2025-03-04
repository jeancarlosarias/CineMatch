import React from "react";
import ReactDOM from "react-dom/client"; 
import { BrowserRouter as Router } from "react-router-dom";
import MainApp from "./App";


// Establecer un contenedor global para el tema de Ant Design
import { ConfigProvider } from "antd";

// Puedes personalizar el tema de Ant Design aqui
const theme = {
  token: {
    colorPrimary: "#1890ff", // Color principal de los componentes de Ant Design
  },
};

// Crear el "root" con `createRoot()` y luego renderizar
const root = ReactDOM.createRoot(document.getElementById("root"));  // Usar createRoot en lugar de render
root.render(
  <ConfigProvider theme={theme}>
    <Router>
      <MainApp />
    </Router>
  </ConfigProvider>
);
