import { Copy, Check } from 'lucide-react';
import { cn } from '../ui/utils';
import { useCopyToClipboard } from '../../hooks';

interface CouponCardProps {
  code: string;
  label: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  colorScheme: 'amber' | 'emerald';
}

const colorSchemes = {
  amber: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
    icon: 'text-amber-600',
    button: 'bg-amber-600 hover:bg-amber-700',
  },
  emerald: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    icon: 'text-emerald-600',
    button: 'bg-emerald-600 hover:bg-emerald-700',
  },
};

/**
 * Card de cupom de desconto com botao de copiar
 */
export function CouponCard({
  code,
  label,
  title,
  description,
  icon,
  colorScheme,
}: CouponCardProps) {
  const { copied, copy } = useCopyToClipboard();
  const colors = colorSchemes[colorScheme];

  return (
    <section className="mb-20">
      <div className="flex items-center gap-3 mb-6">
        <span className={colors.icon}>{icon}</span>
        <span className={cn('text-sm font-semibold uppercase tracking-wider', colors.icon)}>
          {label}
        </span>
      </div>

      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
        {title}
      </h2>
      <p className="text-muted-foreground mb-8 max-w-2xl">{description}</p>

      {/* Coupon */}
      <div
        className={cn(
          'flex flex-col sm:flex-row items-start sm:items-center gap-4 p-6 rounded-lg border',
          colors.bg,
          colors.border
        )}
      >
        <div className="flex items-center gap-3">
          <span className={cn('shrink-0', colors.icon)}>{icon}</span>
          <code className={cn('text-2xl md:text-3xl font-bold tracking-wider', colors.text)}>
            {code}
          </code>
        </div>
        <button
          onClick={() => copy(code)}
          className={cn(
            'inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium text-white transition-all',
            colors.button
          )}
        >
          {copied ? (
            <>
              <Check className="size-4" />
              Copiado
            </>
          ) : (
            <>
              <Copy className="size-4" />
              Copiar codigo
            </>
          )}
        </button>
      </div>
    </section>
  );
}
