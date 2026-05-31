/**
 * Formata um CPF para o padrao brasileiro: 000.000.000-00
 */
export function formatCPF(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length > 9) {
    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d+)/, '$1.$2.$3-$4');
  }
  if (digits.length > 6) {
    return digits.replace(/(\d{3})(\d{3})(\d+)/, '$1.$2.$3');
  }
  if (digits.length > 3) {
    return digits.replace(/(\d{3})(\d+)/, '$1.$2');
  }
  return digits;
}

/**
 * Formata um telefone para o padrao brasileiro: (00) 00000-0000
 */
export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length > 6) {
    return digits.replace(/(\d{2})(\d{5})(\d+)/, '($1) $2-$3');
  }
  if (digits.length > 2) {
    return digits.replace(/(\d{2})(\d+)/, '($1) $2');
  }
  return digits;
}

/**
 * Formata uma data ISO para o padrao brasileiro: DD/MM/YYYY
 */
export function formatDate(iso: string): string {
  if (!iso) return '-';
  const [y, m, d] = iso.split('T')[0].split('-');
  return `${d}/${m}/${y}`;
}

/**
 * Formata um valor monetario para o padrao brasileiro: R$ 0.000,00
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Formata um numero para o padrao brasileiro com separadores
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value);
}

/**
 * Traduz o role para portugues
 */
export function formatRole(role: string): string {
  const roleMap: Record<string, string> = {
    vendedor: 'Vendedor',
    admin: 'Administrador',
    comprador: 'Comprador',
  };
  return roleMap[role] || 'Comprador';
}
