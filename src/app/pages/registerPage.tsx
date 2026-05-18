import { useState } from 'react';
import { carBackgroundB64 } from '../constants';
import { authApi, type RegisterPayload } from '../services/api';
import { useNavigate } from "react-router";

const keyIconB64 =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMjEgMmwtMiAybS03LjYxIDcuNjFBNS41IDUuNSAwIDAgMCAyLjUgMThjMCAzLjAzIDIuNDcgNS41IDUuNSA1LjVhNS41IDUuNSAwIDAgMCA1LjM5LTMuODlMMjEgOGwyLTItMi0yem0tMTIgN2EyaGFsZiAyaGFsZiAwIDAgMSAwLTVhMmhhbGYgMmhhbGYgMCAwIDEgMCA1eiIvPjwvc3ZnPg==';

interface RegisterPageProps {
  onRegisterSuccess: () => void;
}

export function RegisterPage({ onRegisterSuccess }: RegisterPageProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    cpf: '',
    birthDate: '',
    telefone: '',
    wantToBeSeller: false,
    state: '',
    city: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const payload: RegisterPayload = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        cpf: formData.cpf,
        birthDate: formData.birthDate,
        telefone: formData.telefone,
        state: formData.state || undefined,
        city: formData.city || undefined,
      };

      // register retorna { message, user } — sem token
      await authApi.register(payload);

      // Login automático para obter o token
      const loginResponse = await authApi.login({
        email: formData.email,
        password: formData.password,
      });
      authApi.setToken(loginResponse.token);

      if (formData.wantToBeSeller) {
        await authApi.becomeSeller({
          state: formData.state,
          city: formData.city,
        });
      }

      setSuccessMsg('Conta criada com sucesso!');
      setTimeout(() => onRegisterSuccess(), 800);
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    setFormData({
      ...formData,
      [target.name]: value,
    });
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 9) v = v.replace(/(\d{3})(\d{3})(\d{3})(\d+)/, '$1.$2.$3-$4');
    else if (v.length > 6) v = v.replace(/(\d{3})(\d{3})(\d+)/, '$1.$2.$3');
    else if (v.length > 3) v = v.replace(/(\d{3})(\d+)/, '$1.$2');
    setFormData({ ...formData, cpf: v });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 6) v = v.replace(/(\d{2})(\d{5})(\d+)/, '($1) $2-$3');
    else if (v.length > 2) v = v.replace(/(\d{2})(\d+)/, '($1) $2');
    setFormData({ ...formData, telefone: v });
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center bg-black bg-no-repeat bg-cover"
      style={{ backgroundImage: `url(${carBackgroundB64})` }}>

      {/* Overlay escuro */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Conteúdo */}
      <div className="relative z-10 w-full max-w-lg px-4">
        {/* Brand */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-red-500 flex items-center justify-center gap-2">
            MACHOCAR
            <img src={keyIconB64} alt="icon" className="w-6 h-6" />
          </h1>
          <p className="text-gray-300 mt-2">Crie sua conta</p>
        </div>

        {/* Card */}
        <div className="bg-red-900/30 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-red-500/20">
          {error && (
            <div className="bg-red-500/20 text-red-300 p-2 rounded mb-4">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="bg-green-500/20 text-green-300 p-2 rounded mb-4">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nome */}
            <div>
              <label className="text-sm text-gray-200">Nome Completo</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Seu nome completo"
                className="w-full mt-1 p-2 rounded bg-gray-200 text-black outline-none"
                required
              />
            </div>

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

            {/* CPF + Data */}
            <div className="flex gap-3">
              <div className="w-1/2">
                <label className="text-sm text-gray-200">CPF</label>
                <input
                  type="text"
                  value={formData.cpf}
                  onChange={handleCpfChange}
                  placeholder="000.000.000-00"
                  className="w-full mt-1 p-2 rounded bg-gray-200 text-black"
                  required
                />
              </div>

              <div className="w-1/2">
                <label className="text-sm text-gray-200">Data de Nascimento</label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 rounded bg-gray-200 text-black"
                  required
                />
              </div>
            </div>

            {/* Telefone + Senha */}
            <div className="flex gap-3">
              <div className="w-1/2">
                <label className="text-sm text-gray-200">Telefone</label>
                <input
                  type="text"
                  value={formData.telefone}
                  onChange={handlePhoneChange}
                  placeholder="(00) 00000-0000"
                  className="w-full mt-1 p-2 rounded bg-gray-200 text-black"
                  required
                />
              </div>

              <div className="w-1/2">
                <label className="text-sm text-gray-200">Senha</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimo 6 caracteres"
                  className="w-full mt-1 p-2 rounded bg-gray-200 text-black"
                  required
                />
              </div>
            </div>

            {/* Checkbox vendedor */}
            <div className="bg-red-950/50 border border-red-800/30 rounded-lg p-3">
              <label className="flex items-center gap-2 text-gray-200">
                <input
                  type="checkbox"
                  name="wantToBeSeller"
                  checked={formData.wantToBeSeller}
                  onChange={handleChange}
                />
                Quero também vender veículos
              </label>
              <p className="text-xs text-gray-400 mt-1">
                Ao marcar, você será registrado como vendedor
              </p>
            </div>

            {/* Campos vendedor */}
            {formData.wantToBeSeller && (
              <div className="space-y-3">
                <p className="text-sm text-gray-300">
                  Endereço (obrigatório para vendedores)
                </p>

                <div className="flex gap-3">
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-1/2 p-2 rounded bg-gray-200 text-black"
                    required
                  >
                    <option value="">Estado</option>
                    <option value="AC">AC</option>
                    <option value="AL">AL</option>
                    <option value="AP">AP</option>
                    <option value="AM">AM</option>
                    <option value="BA">BA</option>
                    <option value="CE">CE</option>
                    <option value="DF">DF</option>
                    <option value="ES">ES</option>
                    <option value="GO">GO</option>
                    <option value="MA">MA</option>
                    <option value="MT">MT</option>
                    <option value="MS">MS</option>
                    <option value="MG">MG</option>
                    <option value="PA">PA</option>
                    <option value="PB">PB</option>
                    <option value="PR">PR</option>
                    <option value="PE">PE</option>
                    <option value="PI">PI</option>
                    <option value="RJ">RJ</option>
                    <option value="RN">RN</option>
                    <option value="RS">RS</option>
                    <option value="RO">RO</option>
                    <option value="RR">RR</option>
                    <option value="SC">SC</option>
                    <option value="SP">SP</option>
                    <option value="SE">SE</option>
                    <option value="TO">TO</option>
                    <option value="MG">MG</option>
                    <option value="RJ">RJ</option>
                    <option value="BA">BA</option>
                    <option value="DF">DF</option>
                    <option value="PA">PA</option>
                    <option value="PR">PR</option>
                    <option value="PE">PE</option>
                    <option value="RS">RS</option>
                    <option value="SC">SC</option>
                    <option value="SP">SP</option>
                    <option value="SE">SE</option>
                    <option value="TO">TO</option>
                  </select>

                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Cidade"
                    className="w-1/2 p-2 rounded bg-gray-200 text-black"
                    required
                  />
                </div>
              </div>
            )}

            {/* Botão */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 transition rounded-lg py-2 text-white font-semibold"
            >
              {loading ? "Carregando..." : "Criar Conta"}
            </button>

            {/* Footer */}
            <p className="text-center text-sm text-gray-300">
              Já tem uma conta?{" "}
              <a
                href="#"
                className="underline"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/login");
                }}>
                Entrar
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}