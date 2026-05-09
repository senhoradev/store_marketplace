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
    <div className="min-h-screen w-full relative flex items-center justify-center bg-black bg-no-repeat bg-cover"
         style={{ backgroundImage: `url(${carBackgroundB64})` }}
    >

      {/* Overlay escuro */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Conteúdo */}
      <div className="relative z-10 w-full max-w-md px-4">
        {/* Brand */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-red-500 flex items-center justify-center gap-2">
            MACHOCAR
            <img src={keyIconB64} alt="icon" className="w-6 h-6" />
          </h1>
          <p className="text-gray-300 mt-2">Bem-vindo de volta</p>
        </div>

        {/* Card */}
        <div className="bg-red-900/30 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-red-500/20">
          {error && (
            <div className="bg-red-500/20 text-red-300 p-2 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="text-sm text-gray-200">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                className="w-full mt-1 p-2 rounded bg-gray-200 text-black outline-none"
                required
              />
            </div>

            {/* Senha */}
            <div>
              <label className="text-sm text-gray-200">Senha</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full mt-1 p-2 rounded bg-gray-200 text-black outline-none"
                required
              />
            </div>

            {/* Checkbox */}
            <div className="flex items-center gap-2 text-gray-200 text-sm">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              Lembrar de mim
            </div>

            {/* Botão */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 transition rounded-lg py-2 text-white font-semibold"
            >
              {loading ? "Carregando..." : "Entrar"}
            </button>

            {/* Footer */}
            <p className="text-center text-sm text-gray-300">
              Ainda não tem conta?{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/register");
                }}
                className="underline"
              >
                Cadastre-se
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}