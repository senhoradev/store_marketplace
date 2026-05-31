import { useState } from 'react'
import { Star } from 'lucide-react'
import { cn } from '../services/utils'

interface StarRatingProps {
  value: number
  onChange: (value: number) => void
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'size-5',
  md: 'size-7',
  lg: 'size-9',
}

export function StarRating({ value, onChange, size = 'md' }: StarRatingProps) {
  const [hovered, setHovered] = useState(0)

  return (
    <div
      className="flex items-center gap-2"
      role="radiogroup"
      aria-label="Avaliacao"
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          aria-label={`${star} estrela${star > 1 ? 's' : ''}`}
          className={cn(
            'transition-all duration-200 hover:scale-125',
            star <= (hovered || value)
              ? 'text-amber-400'
              : 'text-zinc-200 hover:text-amber-300'
          )}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
        >
          <Star
            className={sizeClasses[size]}
            fill={star <= (hovered || value) ? 'currentColor' : 'none'}
            strokeWidth={1.5}
          />
        </button>
      ))}
    </div>
  )
}
