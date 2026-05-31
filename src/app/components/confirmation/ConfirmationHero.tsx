import { ReactNode } from 'react'
import { CheckCircle2 } from 'lucide-react'

interface ConfirmationHeroProps {
  badge: string
  title: string
  subtitle: string
}

export function ConfirmationHero({ badge, title, subtitle }: ConfirmationHeroProps) {
  return (
    <section className="relative bg-[#871818] overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent" />

      <div className="relative z-10 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          {/* Success Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-5 py-2.5">
            <CheckCircle2 className="size-5 text-emerald-400" />
            <span className="text-sm font-medium text-white/90 tracking-wide">
              {badge}
            </span>
          </div>

          {/* Title */}
          <h1 className="mb-5 text-4xl md:text-6xl font-bold text-white tracking-tight">
            {title}
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-white/70 leading-relaxed max-w-xl mx-auto">
            {subtitle}
          </p>
        </div>
      </div>
    </section>
  )
}

interface NextStepProps {
  icon: ReactNode
  title: string
  description: string
}

export function NextStep({ icon, title, description }: NextStepProps) {
  return (
    <div>
      <div className="flex items-center justify-center size-12 rounded-full bg-[#871818]/10 text-[#871818] mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  )
}

interface NextStepsGridProps {
  children: ReactNode
}

export function NextStepsGrid({ children }: NextStepsGridProps) {
  return (
    <div className="grid md:grid-cols-3 gap-8 md:gap-12">
      {children}
    </div>
  )
}
