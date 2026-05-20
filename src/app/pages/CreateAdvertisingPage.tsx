import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Header } from '../components/header';
import { Footer } from '../components/footer';
import { vehicleApi, type CreateVehiclePayload, type UserData } from '../services/api';

type Props = {
  user: UserData | null;
};

const FUEL_OPTIONS = ['Gasolina', 'Etanol', 'Diesel', 'Flex', 'Elétrico'];
const TRANSMISSION_OPTIONS = ['Manual', 'Automático'];
const BODY_TYPES = ['Sedan', 'Hatch', 'SUV', 'Picape', 'Minivan', 'Esportivo', 'Conversível', 'Wagon', 'Van'];
const STATES_BR = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA',
  'MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN',
  'RS','RO','RR','SC','SP','SE','TO',
];

const initialForm: CreateVehiclePayload = {
  title: '',
  description: '',
  price: 0,
  brand: '',
  model: '',
  version: '',
  manufactureYear: undefined,
  modelYear: undefined,
  mileage: undefined,
  fuel: '',
  transmission: '',
  bodyType: '',
  color: '',
  doors: undefined,
  finalPlate: undefined,
  fipePrice: undefined,
  acceptsFinancing: false,
  acceptsTrade: false,
  city: '',
  state: '',
};

export function CreateAdvertisingPage({ user }: Props) {
  const navigate = useNavigate();
  const [form, setForm] = useState<CreateVehiclePayload>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? target.checked
          : type === 'number'
          ? value === '' ? undefined : Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await vehicleApi.createVehicle(form);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Erro ao criar anúncio.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans antialiased flex flex-col">
      <Header user={user} />

      <main className="flex-1 mx-auto w-full max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-bold text-foreground mb-1">Criar anúncio</h1>
        <p className="text-sm text-muted-foreground mb-8">Preencha as informações do veículo que deseja anunciar.</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-600 rounded-lg p-3 mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* --- Informações básicas --- */}
          <section className="border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Informações básicas</h2>

            <Field label="Título do anúncio *">
              <input
                id="title"
                name="title"
                type="text"
                value={form.title}
                onChange={handleChange}
                placeholder="Ex: Honda Civic EXL 2022 — Único dono"
                required
                className={inputClass}
              />
            </Field>

            <Field label="Descrição *">
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Descreva o veículo, diferenciais, estado de conservação..."
                required
                rows={4}
                className={`${inputClass} resize-none`}
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Preço (R$) *">
                <input
                  id="price"
                  name="price"
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.price || ''}
                  onChange={handleChange}
                  placeholder="Ex: 85000"
                  required
                  className={inputClass}
                />
              </Field>
              <Field label="Preço FIPE (R$)">
                <input
                  id="fipePrice"
                  name="fipePrice"
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.fipePrice ?? ''}
                  onChange={handleChange}
                  placeholder="Opcional"
                  className={inputClass}
                />
              </Field>
            </div>
          </section>

          {/* --- Dados do veículo --- */}
          <section className="border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Dados do veículo</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Marca">
                <input id="brand" name="brand" type="text" value={form.brand} onChange={handleChange} placeholder="Honda" className={inputClass} />
              </Field>
              <Field label="Modelo">
                <input id="model" name="model" type="text" value={form.model} onChange={handleChange} placeholder="Civic" className={inputClass} />
              </Field>
              <Field label="Versão">
                <input id="version" name="version" type="text" value={form.version} onChange={handleChange} placeholder="EXL" className={inputClass} />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Ano de fabricação">
                <input id="manufactureYear" name="manufactureYear" type="number" min={1900} max={2100} value={form.manufactureYear ?? ''} onChange={handleChange} placeholder="2022" className={inputClass} />
              </Field>
              <Field label="Ano do modelo">
                <input id="modelYear" name="modelYear" type="number" min={1900} max={2100} value={form.modelYear ?? ''} onChange={handleChange} placeholder="2023" className={inputClass} />
              </Field>
              <Field label="Quilometragem (km)">
                <input id="mileage" name="mileage" type="number" min={0} value={form.mileage ?? ''} onChange={handleChange} placeholder="15000" className={inputClass} />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Combustível">
                <select id="fuel" name="fuel" value={form.fuel} onChange={handleChange} className={inputClass}>
                  <option value="">Selecione</option>
                  {FUEL_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
              </Field>
              <Field label="Câmbio">
                <select id="transmission" name="transmission" value={form.transmission} onChange={handleChange} className={inputClass}>
                  <option value="">Selecione</option>
                  {TRANSMISSION_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Carroceria">
                <select id="bodyType" name="bodyType" value={form.bodyType} onChange={handleChange} className={inputClass}>
                  <option value="">Selecione</option>
                  {BODY_TYPES.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </Field>
              <Field label="Cor">
                <input id="color" name="color" type="text" value={form.color} onChange={handleChange} placeholder="Branco" className={inputClass} />
              </Field>
              <Field label="Portas">
                <input id="doors" name="doors" type="number" min={1} max={6} value={form.doors ?? ''} onChange={handleChange} placeholder="4" className={inputClass} />
              </Field>
            </div>

            <Field label="Final da placa">
              <input id="finalPlate" name="finalPlate" type="number" min={0} max={9} value={form.finalPlate ?? ''} onChange={handleChange} placeholder="0–9" className={`${inputClass} max-w-[120px]`} />
            </Field>
          </section>

          {/* --- Localização --- */}
          <section className="border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Localização</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Cidade">
                <input id="city" name="city" type="text" value={form.city} onChange={handleChange} placeholder="São Paulo" className={inputClass} />
              </Field>
              <Field label="Estado">
                <select id="state" name="state" value={form.state} onChange={handleChange} className={inputClass}>
                  <option value="">Selecione</option>
                  {STATES_BR.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
            </div>
          </section>

          {/* --- Condições --- */}
          <section className="border border-border rounded-xl p-6 space-y-3">
            <h2 className="text-lg font-semibold text-foreground">Condições</h2>
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                id="acceptsFinancing"
                name="acceptsFinancing"
                type="checkbox"
                checked={form.acceptsFinancing}
                onChange={handleChange}
                className="w-4 h-4 accent-red-600"
              />
              <span className="text-sm text-foreground">Aceita financiamento</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                id="acceptsTrade"
                name="acceptsTrade"
                type="checkbox"
                checked={form.acceptsTrade}
                onChange={handleChange}
                className="w-4 h-4 accent-red-600"
              />
              <span className="text-sm text-foreground">Aceita troca</span>
            </label>
          </section>

          {/* --- Fotos (desabilitado) --- */}
          <section className="border border-border rounded-xl p-6 space-y-3 opacity-50">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Fotos</h2>
              <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">Em breve</span>
            </div>
            <div className="border-2 border-dashed border-border rounded-lg h-32 flex flex-col items-center justify-center gap-2 cursor-not-allowed">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm text-muted-foreground">Upload de fotos indisponível no momento</p>
            </div>
          </section>

          {/* --- Ações --- */}
          <div className="flex justify-end gap-3 pb-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-5 py-2 rounded-lg border border-border text-sm text-foreground hover:bg-accent transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-colors text-white text-sm font-semibold disabled:opacity-60"
            >
              {loading ? 'Publicando...' : 'Publicar anúncio'}
            </button>
          </div>

        </form>
      </main>

      <Footer />
    </div>
  );
}

// Helper de campo de formulário
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-foreground">{label}</label>
      {children}
    </div>
  );
}

const inputClass =
  'w-full rounded-md border border-ring border-input bg-input-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition';
