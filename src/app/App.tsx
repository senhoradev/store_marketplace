import { useState, useEffect } from 'react';
import { LoginPage } from './components/login-page';
import { RegisterPage } from './components/register-page';
import { authApi, type UserData } from './services/api';

type Page = 'login' | 'register' | 'dashboard';

export default function App() {
  const [page, setPage] = useState<Page>('login');
  const [user, setUser] = useState<UserData | null>(null);

  // Ao montar, verifica se já tem token salvo
  useEffect(() => {
    if (authApi.isLoggedIn()) {
      authApi
        .getMe()
        .then((userData) => {
          setUser(userData);
          setPage('dashboard');
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
        setPage('dashboard');
      })
      .catch(() => {
        setPage('login');
      });
  };

  const handleRegisterSuccess = () => {
    authApi
      .getMe()
      .then((userData) => {
        setUser(userData);
        setPage('dashboard');
      })
      .catch(() => {
        setPage('login');
      });
  };

  const handleLogout = () => {
    authApi.removeToken();
    setUser(null);
    setPage('login');
  };

  return (
    <div className="dark size-full h-100">
      {page === 'login' && (
        <LoginPage
          onNavigateToRegister={() => setPage('register')}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
      {page === 'register' && (
        <RegisterPage
          onNavigateToLogin={() => setPage('login')}
          onRegisterSuccess={handleRegisterSuccess}
        />
      )}
      {page === 'dashboard' && user && (
        <div className="dashboard">
          <div className="dashboard__header">
            <h1 className="dashboard__brand">MACHOCAR</h1>
            <div className="dashboard__user-info">
              <span className="dashboard__greeting">
                Olá, <strong>{user.fullName.split(' ')[0]}</strong>
              </span>
              <span className="dashboard__role-badge">
                {user.roles?.some((r) => r.name === 'vendedor') ? 'Vendedor' : 'Comprador'}
              </span>
              <button className="btn-logout" onClick={handleLogout}>
                Sair
              </button>
            </div>
          </div>
          <div className="dashboard__content">
            <p style={{ color: '#aaa', textAlign: 'center', marginTop: '4rem' }}>
              Login realizado com sucesso! Dashboard em construção...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}