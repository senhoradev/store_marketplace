import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Header } from '../components/header';
import { Footer } from '../components/footer';
import { authApi, type UserData } from '../services/api';
import {
  User,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Pencil,
  X,
  Check,
  Lock,
  Calendar,
  CreditCard,
} from 'lucide-react';

const SELLER_TERMS = [
  {
    title: '§ 1 — Comissão sobre vendas',
    text: 'A plataforma MachoCar reterá 50% (cinquenta por cento) do valor bruto de cada veículo vendido a título de "taxa de felicidade do sistema". O vendedor receberá os 50% restantes em até 180 dias úteis, podendo ser pago em vales-presente de postos de gasolina parceiros.',
  },
  {
    title: '§ 2 — Requisito do mecânico',
    text: 'Todo veículo anunciado deverá ser revisado por um mecânico que seja, comprovadamente, sobrinho(a) do proprietário do estabelecimento. Primos de segundo grau serão aceitos apenas mediante carta notariada reconhecendo a amizade familiar.',
  },
  {
    title: '§ 3 — Fotos obrigatórias',
    text: 'Pelo menos uma foto do anúncio deve ter sido tirada na chuva para "autenticar a pintura". Fotos com arco-íris ao fundo receberão destaque premium gratuito por 3 horas.',
  },
  {
    title: '§ 4 — Uso do nome',
    text: 'A MachoCar reserva-se o direito de usar o seu primeiro nome em campanhas de marketing, slogans e tatuagens corporativas sem aviso prévio. O vendedor declara que o nome não causa vergonha alheia.',
  },
  {
    title: '§ 5 — Cheiro do veículo',
    text: 'O veículo deve cheirar a "carro novo" ou, alternativamente, a "pinheiros da floresta". Cheiro de hambúrguer resultará em suspensão temporária da conta por 7 dias. Odores não catalogados serão avaliados por nosso Comitê de Aromas, reunido nas terceiras quintas-feiras do mês.',
  },
  {
    title: '§ 6 — Negociação',
    text: 'É vedado ao vendedor aceitar qualquer proposta de valor sem antes gritar "FECHADO!" três vezes em voz alta, independentemente do local onde se encontre (reuniões de trabalho, missas, consultas médicas). O descumprimento acarreta multa de R$ 1,00.',
  },
  {
    title: '§ 7 — Suporte ao comprador',
    text: 'O vendedor compromete-se a enviar uma mensagem de "bom dia" com figurinha de café ao comprador durante os primeiros 30 dias após a venda. A ausência de figurinha implica devolução de 0,5% da comissão retida.',
  },
  {
    title: '§ 8 — Alterações nos termos',
    text: 'A MachoCar pode alterar estes termos a qualquer momento, inclusive retroativamente. As atualizações serão comunicadas via pombo-correio, ou, na sua ausência, via pressentimento.',
  },
];

function SellerTermsModal({ onAccept, onClose }: { onAccept: () => void; onClose: () => void }) {
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />

      {/* Modal — usa cores do tema do projeto */}
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
          {SELLER_TERMS.map((term) => (
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
          >
            Aceitar e me tornar vendedor
          </button>
        </div>
      </div>
    </div>
  );
}

const BR_STATES = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA',
  'MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN',
  'RS','RO','RR','SC','SP','SE','TO',
];

const inputClass =
  'w-full rounded-md border border-ring border-input bg-input-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition';

const disabledInputClass =
  'w-full rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground cursor-not-allowed';

function formatCPF(cpf: string) {
  const d = cpf.replace(/\D/g, '');
  if (d.length !== 11) return cpf;
  return d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

function formatDate(iso: string) {
  if (!iso) return '—';
  const [y, m, d] = iso.split('T')[0].split('-');
  return `${d}/${m}/${y}`;
}

function rolePtBR(role: string) {
  if (role === 'vendedor') return 'Vendedor';
  if (role === 'admin') return 'Administrador';
  return 'Comprador';
}

export function ProfilePage() {
  const navigate = useNavigate();

  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSellerConfirm, setShowSellerConfirm] = useState(false);
  const [becomingSeller, setBecomingSeller] = useState(false);

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    telefone: '',
    state: '',
    city: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (!authApi.isLoggedIn()) {
      navigate('/login');
      return;
    }
    authApi
      .getMe()
      .then((data) => {
        setUser(data);
        setForm({
          fullName: data.fullName,
          email: data.email,
          telefone: data.telefone,
          state: data.state ?? '',
          city: data.city ?? '',
          password: '',
          confirmPassword: '',
        });
      })
      .catch(() => {
        authApi.removeToken();
        navigate('/login');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 6) v = v.replace(/(\d{2})(\d{5})(\d+)/, '($1) $2-$3');
    else if (v.length > 2) v = v.replace(/(\d{2})(\d+)/, '($1) $2');
    setForm({ ...form, telefone: v });
  };

  const handleCancel = () => {
    if (!user) return;
    setForm({
      fullName: user.fullName,
      email: user.email,
      telefone: user.telefone,
      state: user.state ?? '',
      city: user.city ?? '',
      password: '',
      confirmPassword: '',
    });
    setError('');
    setEditing(false);
  };

  // Passo 1: valida o form e abre o modal de confirmação
  const handleRequestSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password && form.password !== form.confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setShowConfirm(true);
  };

  // Passo 2: chamado ao confirmar no modal
  const handleConfirmSave = async () => {
    setShowConfirm(false);
    setError('');
    setSuccessMsg('');
    setSaving(true);

    try {
      const payload: Record<string, string | undefined> = {
        fullName: form.fullName,
        email: form.email,
        telefone: form.telefone,
        state: form.state || undefined,
        city: form.city || undefined,
      };
      if (form.password) payload.password = form.password;

      await authApi.updateMe(payload);

      // Re-fetch para garantir dados frescos e evitar tela em branco
      const refreshed = await authApi.getMe();
      setUser(refreshed);
      setForm({
        fullName: refreshed.fullName,
        email: refreshed.email,
        telefone: refreshed.telefone,
        state: refreshed.state ?? '',
        city: refreshed.city ?? '',
        password: '',
        confirmPassword: '',
      });

      setSuccessMsg('Perfil atualizado com sucesso!');
      setEditing(false);
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar perfil.');
    } finally {
      setSaving(false);
    }
  };

  const handleBecomeSeller = async () => {
    setBecomingSeller(true);
    setError('');
    setSuccessMsg('');
    setShowSellerConfirm(false);

    try {
      await authApi.becomeSeller(
        user?.state && user?.city
          ? { state: user.state, city: user.city }
          : {},
      );

      const refreshed = await authApi.getMe();
      setUser(refreshed);
      setSuccessMsg('Agora você é um vendedor!');
    } catch (err: any) {
      setError(err.message || 'Erro ao se tornar vendedor.');
    } finally {
      setBecomingSeller(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground animate-pulse">Carregando...</p>
      </div>
    );
  }

  if (!user) return null;

  const isSeller = user.roles?.some((r) => r === 'vendedor');

  return (
    <div className="min-h-screen bg-background font-sans antialiased flex flex-col">
      <Header user={user} />

      <main className="flex-1 mx-auto w-full max-w-2xl px-4 py-10">
        {/* Page heading */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Meu Perfil</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Visualize e edite suas informações pessoais.
            </p>
          </div>
          {!editing && (
            <button
              onClick={() => { setEditing(true); setSuccessMsg(''); setError(''); }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-colors text-white text-sm font-semibold"
            >
              <Pencil className="w-4 h-4" />
              Editar Perfil
            </button>
          )}
        </div>

        {/* Feedback */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-600 rounded-lg p-3 mb-6 text-sm">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-700 rounded-lg p-3 mb-6 text-sm">
            {successMsg}
          </div>
        )}

        {/* Avatar card */}
        <section className="border border-border rounded-xl p-6 mb-6 flex items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 flex-shrink-0">
            <User className="h-8 w-8" />
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">{user.fullName}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <div className="flex gap-2 mt-2 flex-wrap">
              {user.roles?.map((role) => (
                <span
                  key={role}
                  className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-medium border border-red-200"
                >
                  {rolePtBR(role)}
                </span>
              ))}
              {isSeller && (
                <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium border border-green-200">
                  <ShieldCheck className="w-3 h-3" />
                  Conta verificada
                </span>
              )}
            </div>
            {!isSeller && !editing && (
              <button
                onClick={() => { setError(''); setShowSellerConfirm(true); }}
                className="mt-3 text-sm text-red-600 hover:text-red-700 font-medium underline underline-offset-2 transition-colors"
              >
                Quero me tornar um vendedor
              </button>
            )}
          </div>
        </section>

        {/* ---- VIEW MODE ---- */}
        {!editing && (
          <div className="space-y-6">
            {/* Dados pessoais */}
            <section className="border border-border rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Dados pessoais</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoRow icon={<User className="w-4 h-4" />} label="Nome Completo" value={user.fullName} />
                <InfoRow icon={<Mail className="w-4 h-4" />} label="Email" value={user.email} />
                <InfoRow icon={<Phone className="w-4 h-4" />} label="Telefone" value={user.telefone} />
                <InfoRow
                  icon={<CreditCard className="w-4 h-4" />}
                  label="CPF"
                  value={formatCPF(user.cpf)}
                  locked
                />
                <InfoRow
                  icon={<Calendar className="w-4 h-4" />}
                  label="Data de Nascimento"
                  value={formatDate(user.birthDate)}
                  locked
                />
                <InfoRow
                  icon={<MapPin className="w-4 h-4" />}
                  label="Localização"
                  value={
                    user.city && user.state
                      ? `${user.city}, ${user.state}`
                      : user.state || user.city || '—'
                  }
                />
              </div>
            </section>
          </div>
        )}

        {/* ---- EDIT MODE ---- */}
        {editing && (
          <form onSubmit={handleRequestSave} className="space-y-6">

            {/* Dados editáveis */}
            <section className="border border-border rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Dados pessoais</h2>

              <Field label="Nome Completo">
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Seu nome completo"
                  required
                  className={inputClass}
                />
              </Field>

              <Field label="Email">
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="seu@email.com"
                  required
                  className={inputClass}
                />
              </Field>

              <Field label="Telefone">
                <input
                  type="text"
                  name="telefone"
                  value={form.telefone}
                  onChange={handlePhoneChange}
                  placeholder="(00) 00000-0000"
                  className={inputClass}
                />
              </Field>

              {/* Bloqueados */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="CPF" locked>
                  <input
                    type="text"
                    value={formatCPF(user.cpf)}
                    disabled
                    className={disabledInputClass}
                  />
                </Field>
                <Field label="Data de Nascimento" locked>
                  <input
                    type="text"
                    value={formatDate(user.birthDate)}
                    disabled
                    className={disabledInputClass}
                  />
                </Field>
              </div>
            </section>

            {/* Localização */}
            <section className="border border-border rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Localização</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Estado">
                  <select
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="">Selecione</option>
                    {BR_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Cidade">
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="São Paulo"
                    className={inputClass}
                  />
                </Field>
              </div>
            </section>

            {/* Alterar senha */}
            <section className="border border-border rounded-xl p-6 space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Alterar senha</h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Deixe em branco para manter a senha atual.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Nova senha">
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Mínimo 6 caracteres"
                    minLength={form.password ? 6 : undefined}
                    className={inputClass}
                  />
                </Field>
                <Field label="Confirmar nova senha">
                  <input
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repita a nova senha"
                    className={inputClass}
                  />
                </Field>
              </div>
            </section>

            {/* Ações */}
            <div className="flex justify-end gap-3 pb-4">
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center gap-2 px-5 py-2 rounded-lg border border-border text-sm text-foreground hover:bg-accent transition-colors"
              >
                <X className="w-4 h-4" />
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-colors text-white text-sm font-semibold disabled:opacity-60"
              >
                <Check className="w-4 h-4" />
                {saving ? 'Salvando...' : 'Salvar alterações'}
              </button>
            </div>
          </form>
        )}
      </main>

      <Footer />

      {/* ---- CONFIRMATION MODAL ---- */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowConfirm(false)}
          />
          {/* Dialog */}
          <div className="relative z-10 bg-background border border-border rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-foreground mb-2">Confirmar alterações</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Tem certeza que deseja salvar as alterações no seu perfil?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="flex items-center gap-2 px-5 py-2 rounded-lg border border-border text-sm text-foreground hover:bg-accent transition-colors"
              >
                <X className="w-4 h-4" />
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-colors text-white text-sm font-semibold disabled:opacity-60"
              >
                <Check className="w-4 h-4" />
                {saving ? 'Salvando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---- BECOME SELLER TERMS MODAL ---- */}
      {showSellerConfirm && (
        <SellerTermsModal
          onAccept={handleBecomeSeller}
          onClose={() => setShowSellerConfirm(false)}
        />
      )}
    </div>
  );
}

// ---- Sub-components ----

function InfoRow({
  icon,
  label,
  value,
  locked,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  locked?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
        {icon}
        {label}
        {locked && <Lock className="w-3 h-3 ml-0.5" />}
      </span>
      <span className="text-sm text-foreground">{value}</span>
    </div>
  );
}

function Field({
  label,
  children,
  locked,
}: {
  label: string;
  children: React.ReactNode;
  locked?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-foreground flex items-center gap-1">
        {label}
        {locked && <Lock className="w-3 h-3 text-muted-foreground" />}
      </label>
      {children}
    </div>
  );
}
