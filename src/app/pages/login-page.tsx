import { useState } from 'react';
import { carBackgroundB64 } from '../constants';
import { authApi } from '../services/api';
import {useNavigate} from "react-router";

const keyIconB64 =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMjEgMmwtMiAybS03LjYxIDcuNjFBNS41IDUuNSAwIDAgMCAyLjUgMThjMCAzLjAzIDIuNDcgNS41IDUuNSA1LjVhNS41IDUuNSAwIDAgMCA1LjM5LTMuODlMMjEgOGwyLTItMi0yem0tMTIgN2EyaGFsZiAyaGFsZiAwIDAgMSAwLTVhMmhhbGYgMmhhbGYgMCAwIDEgMCA1eiIvPjwvc3ZnPg==';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authApi.login({
        email: formData.email,
        password: formData.password,
      });

      authApi.setToken(response.token);
      onLoginSuccess();
    } catch (err: any) {
      setError(err.message || 'Email ou senha inválidos.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  return (
    <div className="page-container">
      <div
        className="bg-layer"
        style={{ backgroundImage: `url(${carBackgroundB64})` }}
      />

      <div className="form-wrapper">
        <div className="brand-section">
          <div className="brand-title">
            MACHOCAR
            <span className="brand-icon">
              <img src={keyIconB64} alt="Store Icon" width="24" height="24" />
            </span>
          </div>
          <div className="brand-subtitle">Bem-vindo de volta</div>
        </div>

        <div className="form-card">
          {error && <div className="alert alert--error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group-custom">
              <label htmlFor="email" className="form-label-custom">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control-custom"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div className="form-group-custom mb-3">
              <label htmlFor="password" className="form-label-custom">Senha</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-control-custom"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="custom-checkbox">
              <label className="d-flex align-items-center mb-0">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                Lembrar de mim
              </label>
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? (
                <span className="btn-spinner" />
              ) : (
                'Entrar'
              )}
            </button>

            <div className="form-footer">
              Ainda não tem conta?{' '}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/register")
                }}
              >
                Cadastre-se
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}