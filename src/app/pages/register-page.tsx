import { useState } from 'react';
import { carBackgroundB64 } from '../constants';
import { authApi, type RegisterPayload } from '../services/api';

const keyIconB64 =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMjEgMmwtMiAybS03LjYxIDcuNjFBNS41IDUuNSAwIDAgMCAyLjUgMThjMCAzLjAzIDIuNDcgNS41IDUuNSA1LjVhNS41IDUuNSAwIDAgMCA1LjM5LTMuODlMMjEgOGwyLTItMi0yem0tMTIgN2EyaGFsZiAyaGFsZiAwIDAgMSAwLTVhMmhhbGYgMmhhbGYgMCAwIDEgMCA1eiIvPjwvc3ZnPg==';

interface RegisterPageProps {
  onNavigateToLogin: () => void;
  onRegisterSuccess: () => void;
}

export function RegisterPage({ onNavigateToLogin, onRegisterSuccess }: RegisterPageProps) {
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
      };

      if (formData.wantToBeSeller) {
        payload.state = formData.state;
        payload.city = formData.city;
      }

      const response = await authApi.register(payload);
      authApi.setToken(response.token);

      if (formData.wantToBeSeller) {
        try {
          await authApi.becomeSeller({
            state: formData.state,
            city: formData.city,
          });
        } catch (sellerErr: any) {
          console.warn('Registered but become-seller failed:', sellerErr.message);
        }
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
    <div className="page-container">
      <div
        className="bg-layer"
        style={{ backgroundImage: `url(${carBackgroundB64})` }}
      />

      <div className="form-wrapper form-wrapper--register">
        <div className="brand-section">
          <div className="brand-title">
            MACHOCAR
            <span className="brand-icon">
              <img src={keyIconB64} alt="Store Icon" width="24" height="24" />
            </span>
          </div>
          <div className="brand-subtitle">Crie sua conta</div>
        </div>

        <div className="form-card">
          {error && <div className="alert alert--error">{error}</div>}
          {successMsg && <div className="alert alert--success">{successMsg}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group-custom">
              <label htmlFor="fullName" className="form-label-custom">Nome Completo</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="form-control-custom"
                placeholder="Seu nome completo"
                required
              />
            </div>

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

            <div className="form-row">
              <div className="form-group-custom form-group--half">
                <label htmlFor="cpf" className="form-label-custom">CPF</label>
                <input
                  type="text"
                  id="cpf"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleCpfChange}
                  className="form-control-custom"
                  placeholder="000.000.000-00"
                  required
                />
              </div>
              <div className="form-group-custom form-group--half">
                <label htmlFor="birthDate" className="form-label-custom">Data de Nascimento</label>
                <input
                  type="date"
                  id="birthDate"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className="form-control-custom"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group-custom form-group--half">
                <label htmlFor="telefone" className="form-label-custom">Telefone</label>
                <input
                  type="text"
                  id="telefone"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handlePhoneChange}
                  className="form-control-custom"
                  placeholder="(00) 00000-0000"
                  required
                />
              </div>
              <div className="form-group-custom form-group--half">
                <label htmlFor="password" className="form-label-custom">Senha</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-control-custom"
                  placeholder="Minimo 6 caracteres"
                  required
                />
              </div>
            </div>

            <div className="seller-toggle">
              <label className="seller-toggle__label">
                <input
                  type="checkbox"
                  name="wantToBeSeller"
                  checked={formData.wantToBeSeller}
                  onChange={handleChange}
                />
                <span className="seller-toggle__text">
                  Quero tambem vender veiculos
                </span>
              </label>
              <span className="seller-toggle__hint">
                Ao marcar, voce sera registrado como vendedor
              </span>
            </div>

            <div className={`seller-fields ${formData.wantToBeSeller ? 'seller-fields--open' : ''}`}>
              <div className="seller-fields__inner">
                <div className="seller-fields__header">
                  Endereco (obrigatorio para vendedores)
                </div>
                <div className="form-row">
                  <div className="form-group-custom form-group--half">
                    <label htmlFor="state" className="form-label-custom">Estado</label>
                    <select
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="form-control-custom"
                      required={formData.wantToBeSeller}
                    >
                      <option value="">Selecione...</option>
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
                    </select>
                  </div>
                  <div className="form-group-custom form-group--half">
                    <label htmlFor="city" className="form-label-custom">Cidade</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="form-control-custom"
                      placeholder="Sua cidade"
                      required={formData.wantToBeSeller}
                    />
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? (
                <span className="btn-spinner" />
              ) : (
                'Criar Conta'
              )}
            </button>

            <div className="form-footer">
              Ja tem uma conta?{' '}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateToLogin();
                }}
              >
                Entrar
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}