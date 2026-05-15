import { useState, useEffect } from 'react';
import {LoginPage} from './pages/loginPage';
import { RegisterPage } from './pages/registerPage';
import DetailsPage from "./pages/detailsPage";
import Home from "./pages/homePage";
import { CreateVehiclePage } from './pages/createVehiclePage';
import { authApi, type UserData } from './services/api';
import {Routes, Route, Navigate, useNavigate} from "react-router";


export default function App() {
  const [user, setUser] = useState<UserData | null>(null);
  const navigate = useNavigate();

  // Ao montar, verifica se já tem token salvo
  useEffect(() => {
    if (authApi.isLoggedIn()) {
      authApi
        .getMe()
        .then((userData) => {
          setUser(userData);
        })
        .catch(() => {
          authApi.removeToken();
        });
    }
  }, []);

  const handleLoginSuccess = () => {
    authApi
      .getMe()
      .then((userData) => {
        setUser(userData);
        navigate('/');
      })
      .catch(() => {
      });
  };

  const handleRegisterSuccess = () => {
    authApi
      .getMe()
      .then((userData) => {
        setUser(userData);
      })
      .catch(() => {
      });
  };

  const handleLogout = () => {
    authApi.removeToken();
    setUser(null);
  };

  return (
    <Routes>
      <Route path="/" element={<Home user={user} />}/>
      <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess}/>} />
      <Route path="/register" element={<RegisterPage onRegisterSuccess={handleLoginSuccess}/>} />
      <Route
        path="/anunciar"
        element={
          user ? <CreateVehiclePage user={user} /> : <Navigate to="/login" replace />
        }
      />
      <Route path="/details" element={<DetailsPage/>}/>
    </Routes>
  );
}