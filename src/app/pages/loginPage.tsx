import { useState } from 'react';
import { carBackgroundB64, MCicon, mcqueenbg } from '../constants';
import { authApi } from '../services/api';
import {useNavigate} from "react-router";

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
        style={{ backgroundImage: `url(${mcqueenbg})` }}>
    { /* style={{ backgroundImage: `url(${carBackgroundB64})` }}*/}

      {/* Overlay escuro */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Conteúdo */}
      <div className="relative z-10 w-full max-w-md px-4">
        {/* Brand */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-primary flex items-center justify-center gap-2">
            MACHOCAR
            <img src={MCicon} alt="icon" className="w-25 h-20" />
          </h1>
          <p className="text-primary-foreground mt-2">Bem-vindo de volta</p>
        </div>

        {/* Card */}
        <div className="bg-primary rounded-2xl p-6 shadow-lg border border-primary">
          {error && (
            <div className="bg-destructive/20 text-destructive p-2 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="text-sm text-primary-foreground">Email</label>
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
              <label className="text-sm text-primary-foreground">Senha</label>
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
            <div className="flex items-center gap-2 text-primary-foreground text-sm">
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
              className="w-full bg-[var(--destructive)] hover:bg-[var(--gray)] transition rounded-lg py-2 text-white font-semibold"
            >
              {loading ? "Carregando..." : "Entrar"
              }
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