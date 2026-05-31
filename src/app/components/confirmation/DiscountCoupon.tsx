import { ReactNode } from 'react'
import { Copy, Check } from 'lucide-react'
import { cn } from '../../services/utils'

interface DiscountCouponProps {
  icon: ReactNode
  iconColor: string
  label: string
  title: string
  description: string
  code: string
  copied: boolean
  onCopy: () => void
  variant?: 'emerald' | 'amber'
}

export function DiscountCoupon({
  icon,
  iconColor,
  label,
  title,
  description,
  code,
  copied,
  onCopy,
  variant = 'emerald',
}: DiscountCouponProps) {
  const variantStyles = {
    emerald: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      codeColor: 'text-emerald-700',
      buttonBg: 'bg-emerald-600 hover:bg-emerald-700',
    },
    amber: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      codeColor: 'text-amber-700',
      buttonBg: 'bg-amber-600 hover:bg-amber-700',
    },
  }

  const styles = variantStyles[variant]

  return (
    <section className="mb-20">
      <div className="flex items-center gap-3 mb-6">
        <span className={iconColor}>{icon}</span>
        <span
          className={cn(
            'text-sm font-semibold uppercase tracking-wider',
            iconColor
          )}
        >
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
          styles.bg,
          styles.border
        )}
      >
        <div className="flex items-center gap-3">
          <span className={cn('shrink-0', iconColor)}>{icon}</span>
          <code
            className={cn(
              'text-2xl md:text-3xl font-bold tracking-wider',
              styles.codeColor
            )}
          >
            {code}
          </code>
        </div>
        <button
          onClick={onCopy}
          className={cn(
            'inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-all text-white',
            styles.buttonBg
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
  )
}
