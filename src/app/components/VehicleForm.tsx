import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  type CreateVehiclePayload,
  type UpdateVehiclePayload,
} from '../services/api';

type VehicleFormData =
  | CreateVehiclePayload
  | UpdateVehiclePayload;

type Props<T extends VehicleFormData> = {
  initialData: T;
  onSubmit: (data: T) => Promise<void>;
  submitText: string;
  title: string;
  description: string;
};

const FUEL_OPTIONS = ['Gasolina', 'Etanol', 'Diesel', 'Flex', 'Elétrico'];
const TRANSMISSION_OPTIONS = ['Manual', 'Automático'];
const BODY_TYPES = [
  'Sedan',
  'Hatch',
  'SUV',
  'Picape',
  'Minivan',
  'Esportivo',
  'Conversível',
  'Wagon',
  'Van',
];

const STATES_BR = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA',
  'MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN',
  'RS','RO','RR','SC','SP','SE','TO',
];

export function VehicleForm<T extends VehicleFormData>({
                              initialData,
                              onSubmit,
                              submitText,
                              title,
                              description,
                            }: Props<T>) {
  const navigate = useNavigate();
  const [form, setForm] = useState<T>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setForm(initialData);
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;

    setForm((prev) => ({
      ...prev,

      [name]:
        type === 'checkbox'
          ? target.checked
          : type === 'number'
            ? value === ''
              ? undefined
              : Number(value)
            : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onSubmit(form);
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar anúncio.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 mx-auto w-full max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold text-foreground mb-1">
        {title}
      </h1>
      <p className="text-sm text-muted-foreground mb-8">
        {description}
      </p>
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-600 rounded-lg p-3 mb-6 text-sm">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-8">

        <section className="border border-border rounded-xl p-6 space-y-4">

          <h2 className="text-lg font-semibold text-foreground">
            Informações básicas
          </h2>

          <Field label="Título do anúncio *">
            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="Ex: Honda Civic EXL 2022"
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
                required
                className={inputClass}
              />
            </Field>

            <Field label="Preço FIPE">
              <input
                id="fipePrice"
                name="fipePrice"
                type="number"
                min={0}
                step="0.01"
                value={form.fipePrice ?? ''}
                onChange={handleChange}
                className={inputClass}
              />
            </Field>

          </div>

        </section>

        {/* Dados do veículo */}
        <section className="border border-border rounded-xl p-6 space-y-4">

          <h2 className="text-lg font-semibold text-foreground">
            Dados do veículo
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            <Field label="Marca">
              <input
                id="brand"
                name="brand"
                type="text"
                value={form.brand}
                onChange={handleChange}
                className={inputClass}
              />
            </Field>

            <Field label="Modelo">
              <input
                id="model"
                name="model"
                type="text"
                value={form.model}
                onChange={handleChange}
                className={inputClass}
              />
            </Field>

            <Field label="Versão">
              <input
                id="version"
                name="version"
                type="text"
                value={form.version}
                onChange={handleChange}
                className={inputClass}
              />
            </Field>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            <Field label="Ano fabricação">
              <input
                id="manufactureYear"
                name="manufactureYear"
                type="number"
                value={form.manufactureYear ?? ''}
                onChange={handleChange}
                className={inputClass}
              />
            </Field>

            <Field label="Ano modelo">
              <input
                id="modelYear"
                name="modelYear"
                type="number"
                value={form.modelYear ?? ''}
                onChange={handleChange}
                className={inputClass}
              />
            </Field>

            <Field label="Quilometragem">
              <input
                id="mileage"
                name="mileage"
                type="number"
                value={form.mileage ?? ''}
                onChange={handleChange}
                className={inputClass}
              />
            </Field>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <Field label="Combustível">
              <select
                id="fuel"
                name="fuel"
                value={form.fuel}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Selecione</option>

                {FUEL_OPTIONS.map((fuel) => (
                  <option key={fuel} value={fuel}>
                    {fuel}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Câmbio">
              <select
                id="transmission"
                name="transmission"
                value={form.transmission}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Selecione</option>

                {TRANSMISSION_OPTIONS.map((transmission) => (
                  <option key={transmission} value={transmission}>
                    {transmission}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Carroceria">
              <select
                id="bodyType"
                name="bodyType"
                value={form.bodyType}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Selecione</option>

                {BODY_TYPES.map((body) => (
                  <option key={body} value={body}>
                    {body}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Cor">
              <input
                id="color"
                name="color"
                type="text"
                value={form.color}
                onChange={handleChange}
                className={inputClass}
              />
            </Field>

            <Field label="Portas">
              <input
                id="doors"
                name="doors"
                type="number"
                value={form.doors ?? ''}
                onChange={handleChange}
                className={inputClass}
              />
            </Field>

          </div>

        </section>

        {/* Localização */}
        <section className="border border-border rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            Localização
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Cidade">
              <input
                id="city"
                name="city"
                type="text"
                value={form.city}
                onChange={handleChange}
                className={inputClass}
              />
            </Field>

            <Field label="Estado">
              <select
                id="state"
                name="state"
                value={form.state}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Selecione</option>

                {STATES_BR.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </section>
        {/* Condições */}
        <section className="border border-border rounded-xl p-6 space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            Condições
          </h2>
          <label className="flex items-center gap-3">

            <input
              id="acceptsFinancing"
              name="acceptsFinancing"
              type="checkbox"
              checked={form.acceptsFinancing}
              onChange={handleChange}
            />

            <span>Aceita financiamento</span>

          </label>

          <label className="flex items-center gap-3">

            <input
              id="acceptsTrade"
              name="acceptsTrade"
              type="checkbox"
              checked={form.acceptsTrade}
              onChange={handleChange}
            />
            <span>Aceita troca</span>
          </label>
        </section>

        <div className="flex justify-end gap-3 pb-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-5 py-2 rounded-lg border border-border"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 rounded-lg bg-red-600 text-white"
          >
            {loading ? 'Salvando...' : submitText}
          </button>
        </div>
      </form>
    </main>
  );
}

function Field({
                 label,
                 children,
               }: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  'w-full rounded-md border border-ring border-input bg-input-background px-3 py-2 text-sm';