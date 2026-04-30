import { useState } from 'react';
import { LoginPage } from './components/login-page';
import { RegisterPage } from './components/register-page';

type Page = 'login' | 'register';

export default function App() {
  const [page, setPage] = useState<Page>('login');

  return (
    <div className="dark size-full h-100">
      {page === 'login' && <LoginPage />}
      {page === 'register' && <RegisterPage />}

      {/* Dev nav */}
      <div style={{
        position: 'fixed',
        bottom: '1rem',
        right: '1rem',
        display: 'flex',
        gap: '0.5rem',
        zIndex: 9999,
      }}>
        <button onClick={() => setPage('login')}
          style={{ padding: '6px 12px', background: page === 'login' ? '#3b82f6' : '#374151', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
          Login
        </button>
        <button onClick={() => setPage('register')}
          style={{ padding: '6px 12px', background: page === 'register' ? '#3b82f6' : '#374151', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
          Register
        </button>
      </div>
    </div>
  );
}