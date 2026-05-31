import { cn } from '../ui/utils';

type AlertType = 'error' | 'success' | 'warning' | 'info';

interface AlertProps {
  type: AlertType;
  message: string;
  className?: string;
}

const alertStyles: Record<AlertType, string> = {
  error: 'bg-red-500/10 border-red-500/30 text-red-600',
  success: 'bg-green-500/10 border-green-500/30 text-green-700',
  warning: 'bg-amber-500/10 border-amber-500/30 text-amber-600',
  info: 'bg-blue-500/10 border-blue-500/30 text-blue-600',
};

/**
 * Componente de alerta para feedback visual
 */
export function Alert({ type, message, className }: AlertProps) {
  return (
    <div
      className={cn(
        'rounded-lg border p-3 text-sm',
        alertStyles[type],
        className
      )}
    >
      {message}
    </div>
  );
}
