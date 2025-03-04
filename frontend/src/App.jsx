import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import { MovieProvider } from './context/MoviesContext';
import { App } from 'antd';
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import FavoritePage from "./pages/FavoritePage";
import NotFound from "./pages/NotFound";

const MainApp = () => {
  return (
    <AuthProvider>
      <MovieProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/favorites" element={<FavoritePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
      </MovieProvider>
    </AuthProvider>
  );
};

const AppWrapper = () => {
  return (
    <App>
      <MainApp />
    </App>
  );
};

export default AppWrapper;
