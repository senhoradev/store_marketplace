import { useState } from 'react';
import { carBackgroundB64, MCicon, mcqueenbg } from '../constants';
import { authApi, type RegisterPayload } from '../services/api';
import { useNavigate } from "react-router";
import { X } from 'lucide-react';

interface RegisterPageProps {
  onRegisterSuccess: () => void;
}

const TERMS = [
  {
    title: '1 - Comissão sobre vendas',
    text: 'A plataforma MachoCar reterá 50% (cinquenta por cento) do valor bruto de cada veículo vendido a título de "taxa de felicidade do sistema". O vendedor receberá os 50% restantes em até 180 dias úteis, podendo ser pago em vales-presente de postos de gasolina parceiros.',
  },
  {
    title: '2 - Requisito do mecânico',
    text: 'Todo veículo anunciado deverá ser revisado por um mecânico que seja, comprovadamente, sobrinho(a) do proprietário do estabelecimento. Primos de segundo grau serão aceitos apenas mediante carta notariada reconhecendo a amizade familiar.',
  },
  {
    title: '3 - Fotos obrigatórias',
    text: 'Pelo menos uma foto do anúncio deve ter sido tirada na chuva para "autenticar a pintura". Fotos com arco-íris ao fundo receberão destaque premium gratuito por 3 horas.',
  },
  {
    title: '4 - Uso do nome',
    text: 'A MachoCar reserva-se o direito de usar o seu primeiro nome em campanhas de marketing, slogans e tatuagens corporativas sem aviso prévio. O vendedor declara que o nome não causa vergonha alheia.',
  },
  {
    title: '5 - Cheiro do veículo',
    text: 'O veículo deve cheirar a "carro novo" ou, alternativamente, a "pinheiros da floresta". Cheiro de hambúrguer resultará em suspensão temporária da conta por 7 dias. Odores não catalogados serão avaliados por nosso Comitê de Aromas, reunido nas terceiras quintas-feiras do mês.',
  },
  {
    title: '6 - Negociação',
    text: 'É vedado ao vendedor aceitar qualquer proposta de valor sem antes gritar "FECHADO!" três vezes em voz alta, independentemente do local onde se encontre (reuniões de trabalho, missas, consultas médicas). O descumprimento acarreta multa de R$ 1,00.',
  },
  {
    title: '7 - Suporte ao comprador',
    text: 'O vendedor compromete-se a enviar uma mensagem de "bom dia" com figurinha de café ao comprador durante os primeiros 30 dias após a venda. A ausência de figurinha implica devolução de 0,5% da comissão retida.',
  },
  {
    title: '8 - Alterações nos termos',
    text: 'A MachoCar pode alterar estes termos a qualquer momento, inclusive retroativamente. As atualizações serão comunicadas via pombo-correio, ou, na sua ausência, via pressentimento.',
  },
];

const BR_STATES = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA',
  'MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN',
  'RS','RO','RR','SC','SP','SE','TO',
];

function TermsModal({ onAccept, onClose }: { onAccept: () => void; onClose: () => void }) {
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />

      {/* Modal — usa as cores do tema do projeto */}
      <div className="relative z-10 rounded-2xl shadow-2xl w-full max-w-lg mx-auto flex flex-col max-h-[85vh]"
        style={{ background: 'var(--gray)', border: '1px solid var(--primary)' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(135,24,24,0.4)' }}>
          <div>
            <h2 className="text-lg font-bold text-white">Termos de Serviço do Vendedor</h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--primary-foreground)', opacity: 0.6 }}>MachoCar Ltda. — Versão 4.2.0 (definitiva)</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Terms list — scrollable */}
        <div className="overflow-y-auto flex-1 px-6 py-4 space-y-3 text-sm">
          {TERMS.map((term) => (
            <div key={term.title} className="rounded-lg p-3"
              style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(135,24,24,0.25)' }}>
              <p className="font-semibold mb-1" style={{ color: 'var(--primary-foreground)' }}>{term.title}</p>
              <p className="leading-relaxed text-gray-300">{term.text}</p>
            </div>
          ))}

          <p className="text-xs text-gray-500 text-center pt-2">
            Ao aceitar, você declara ter lido, entendido e concordado com todos os itens acima,
            incluindo os parágrafos que você pulou.
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex-shrink-0 space-y-3"
          style={{ borderTop: '1px solid rgba(135,24,24,0.4)' }}>
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="mt-0.5 w-4 h-4 flex-shrink-0 cursor-pointer"
              style={{ accentColor: 'var(--primary)' }}
            />
            <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
              Li e aceito os Termos de Serviço, inclusive as partes que não fazem o menor sentido.
            </span>
          </label>

          <button
            onClick={onAccept}
            disabled={!accepted}
            className="w-full py-2.5 rounded-lg font-semibold text-sm text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: 'var(--primary)' }}
            onMouseEnter={e => !accepted && ((e.target as HTMLElement).style.background = 'var(--primary)')}
          >
            Aceitar e me tornar vendedor
          </button>
        </div>
      </div>
    </div>
  );
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

    // Validação manual dos campos obrigatórios
    if (!formData.fullName.trim()) {
      setError('Nome completo é obrigatório.');
      return;
    }
    if (!formData.email.trim()) {
      setError('E-mail é obrigatório.');
      return;
    }
    if (!formData.cpf.trim()) {
      setError('CPF é obrigatório.');
      return;
    }
    if (!formData.birthDate) {
      setError('Data de nascimento é obrigatória.');
      return;
    }
    if (!formData.telefone.trim()) {
      setError('Telefone é obrigatório.');
      return;
    }
    if (!formData.password || formData.password.length < 6) {
      setError('Senha é obrigatória e deve ter no mínimo 6 caracteres.');
      return;
    }
    if (!formData.state) {
      setError('Estado é obrigatório.');
      return;
    }
    if (!formData.city.trim()) {
      setError('Cidade é obrigatória.');
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

      // Login automático para obter o token
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

  // Abre modal de termos quando o checkbox é marcado
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
        <TermsModal
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

        {/* Conteúdo */}
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
                ⚠ {error}
              </div>
            )}

            {successMsg && (
              <div className="bg-green-700 text-white p-2.5 rounded mb-4 text-sm font-medium">
                ✓ {successMsg}
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
                  Quero também vender veículos
                </label>
                <p className="text-xs text-gray-400 mt-1">
                  {formData.wantToBeSeller
                    ? 'Termos aceitos - você será registrado como vendedor.'
                    : 'Ao marcar, você deverá aceitar os Termos de Serviço do Vendedor.'}
                </p>
              </div>

              {/* Botão */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[var(--destructive)] hover:bg-[var(--gray)] transition rounded-lg py-2 text-white font-semibold"
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
    </>
  );
}