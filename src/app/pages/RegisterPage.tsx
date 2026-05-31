import { useState } from 'react';
import { useNavigate } from 'react-router';
import { MCicon, mcqueenbg } from '../constants';
import { authApi, type RegisterPayload } from '../services/api';
import { SellerTermsModal } from '../components/SellerTermsModal';
import { BR_STATES } from '../constants';
import { formatCPF, formatPhone } from '../utils';

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
    state: '',
    city: '',
    wantToBeSeller: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showTerms, setShowTerms] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    // Validacao manual dos campos obrigatorios
    if (!formData.fullName.trim()) {
      setError('Nome completo e obrigatorio.');
      return;
    }
    if (!formData.email.trim()) {
      setError('E-mail e obrigatorio.');
      return;
    }
    if (!formData.cpf.trim()) {
      setError('CPF e obrigatorio.');
      return;
    }
    if (!formData.birthDate) {
      setError('Data de nascimento e obrigatoria.');
      return;
    }
    if (!formData.telefone.trim()) {
      setError('Telefone e obrigatorio.');
      return;
    }
    if (!formData.password || formData.password.length < 6) {
      setError('Senha e obrigatoria e deve ter no minimo 6 caracteres.');
      return;
    }
    if (!formData.state) {
      setError('Estado e obrigatorio.');
      return;
    }
    if (!formData.city.trim()) {
      setError('Cidade e obrigatoria.');
      return;
    }

    setLoading(true);

    try {
      const payload: RegisterPayload = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        cpf: formData.cpf,
        birthDate: formData.birthDate,
        telefone: formData.telefone,
        state: formData.state,
        city: formData.city,
      };

      await authApi.register(payload);

      // Login automatico para obter o token
      const loginResponse = await authApi.login({
        email: formData.email,
        password: formData.password,
      });
      authApi.setToken(loginResponse.token);

      if (formData.wantToBeSeller) {
        await authApi.becomeSeller({});
      }

      setSuccessMsg('Conta criada com sucesso!');
      setTimeout(() => onRegisterSuccess(), 800);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao criar conta.';
      setError(message);
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
    setFormData({ ...formData, cpf: formatCPF(e.target.value) });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, telefone: formatPhone(e.target.value) });
  };

  // Abre modal de termos quando o checkbox e marcado
  const handleSellerCheckboxClick = () => {
    if (!formData.wantToBeSeller) {
      // tentando ativar - abre os termos
      setShowTerms(true);
    } else {
      // desmarcando
      setFormData({ ...formData, wantToBeSeller: false });
    }
  };

  const handleTermsAccept = () => {
    setShowTerms(false);
    setFormData({ ...formData, wantToBeSeller: true });
  };

  return (
    <>
      {showTerms && (
        <SellerTermsModal
          onAccept={handleTermsAccept}
          onClose={() => setShowTerms(false)}
        />
      )}

      <div
        className="min-h-screen w-full relative flex items-center justify-center bg-black bg-no-repeat bg-cover"
        style={{ backgroundImage: `url(${mcqueenbg})` }}
      >
        {/* Overlay escuro */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Conteudo */}
        <div className="relative z-10 w-full max-w-lg px-4">
          {/* Brand */}
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-primary flex items-center justify-center gap-2">
              MACHOCAR
              <img src={MCicon} alt="icon" className="w-25 h-20" />
            </h1>
            <p className="text-primary-foreground mt-2">Crie sua conta</p>
          </div>

          {/* Card */}
          <div className="bg-primary rounded-2xl p-6 shadow-lg border border-primary">
            {error && (
              <div className="bg-black text-white p-2.5 rounded mb-4 text-sm font-medium">
                {error}
              </div>
            )}

            {successMsg && (
              <div className="bg-green-700 text-white p-2.5 rounded mb-4 text-sm font-medium">
                {successMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nome */}
              <div>
                <label className="text-sm text-primary-foreground">Nome Completo</label>
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

              {/* CPF + Data */}
              <div className="flex gap-3">
                <div className="w-1/2">
                  <label className="text-sm text-primary-foreground">CPF</label>
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
                  <label className="text-sm text-primary-foreground">Data de Nascimento</label>
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
                  <label className="text-sm text-primary-foreground">Telefone</label>
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
                  <label className="text-sm text-primary-foreground">Senha</label>
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

              {/* Estado + Cidade */}
              <div className="flex gap-3">
                <div className="w-1/2">
                  <label className="text-sm text-primary-foreground">Estado</label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full mt-1 p-2 rounded bg-gray-200 text-black"
                    required
                  >
                    <option value="">Selecione</option>
                    {BR_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="w-1/2">
                  <label className="text-sm text-primary-foreground">Cidade</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Sua cidade"
                    className="w-full mt-1 p-2 rounded bg-gray-200 text-black"
                    required
                  />
                </div>
              </div>

              {/* Checkbox vendedor - abre termos */}
              <div className="w-full bg-[var(--thirdary-foreground)] border border-primary rounded-lg p-3">
                <label className="flex items-center gap-2 text-primary-foreground cursor-pointer select-none">
                  <input
                    type="checkbox"
                    name="wantToBeSeller"
                    checked={formData.wantToBeSeller}
                    onChange={handleSellerCheckboxClick}
                    className="accent-red-500"
                  />
                  Quero tambem vender veiculos
                </label>
                <p className="text-xs text-gray-400 mt-1">
                  {formData.wantToBeSeller
                    ? 'Termos aceitos - voce sera registrado como vendedor.'
                    : 'Ao marcar, voce devera aceitar os Termos de Servico do Vendedor.'}
                </p>
              </div>

              {/* Botao */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[var(--destructive)] hover:bg-[var(--gray)] transition rounded-lg py-2 text-white font-semibold"
              >
                {loading ? "Carregando..." : "Criar Conta"}
              </button>

              {/* Footer */}
              <p className="text-center text-sm text-gray-300">
                Ja tem uma conta?{" "}
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
    </>
  );
}
