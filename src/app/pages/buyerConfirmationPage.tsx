import { useState } from 'react'
import { Link } from 'react-router'
import { Header } from '../components/header'
import { Footer } from '../components/footer'
import {
  CheckCircle2,
  Star,
  Gift,
  Send,
  Ticket,
  ThumbsUp,
  LayoutGrid,
  Home,
  Headphones,
  Mail,
  Truck,
  ClipboardCheck,
  Copy,
  Check,
  ArrowRight,
} from 'lucide-react'

// ─── helper: substitui cn() do shadcn ────────────────────────────────────────
function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

// ─── Star Rating Component ─────────────────────────────────────────────────
function StarRating({
  value,
  onChange,
}: {
  value: number
  onChange: (v: number) => void
}) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex items-center gap-2" role="radiogroup" aria-label="Avaliação">
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
            className="size-7"
            fill={star <= (hovered || value) ? 'currentColor' : 'none'}
            strokeWidth={1.5}
          />
        </button>
      ))}
    </div>
  )
}

// ─── Main Page ──────────────────────────────────────────────────────────────
export function BuyerConfirmationPage() {
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [copied, setCopied] = useState(false)

  const discountCode = 'MACHOCAR10'

  const handleCopy = () => {
    navigator.clipboard.writeText(discountCode).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header user={null} />

      {/* Hero Section */}
      <section className="relative bg-[#871818] overflow-hidden">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent" />

        <div className="relative z-10 px-6 py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            {/* Success Badge */}
            <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-5 py-2.5">
              <CheckCircle2 className="size-5 text-emerald-400" />
              <span className="text-sm font-medium text-white/90 tracking-wide">Compra confirmada com sucesso</span>
            </div>

            {/* Title */}
            <h1 className="mb-5 text-4xl md:text-6xl font-bold text-white tracking-tight">
              Obrigado pela sua compra
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-white/70 leading-relaxed max-w-xl mx-auto">
              Seja bem-vindo à família MachoCar. Sua jornada começa agora.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 px-6 py-16 md:py-24">
        <div className="mx-auto max-w-4xl">

          {/* Discount Section */}
          <section className="mb-20">
            <div className="flex items-center gap-3 mb-6">
              <Gift className="size-5 text-emerald-600" />
              <span className="text-sm font-semibold uppercase tracking-wider text-emerald-600">
                Presente especial para você
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              Ganhe 10% de desconto na sua próxima compra
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl">
              Como forma de agradecimento pela confiança, preparamos um cupom exclusivo válido por 90 dias.
            </p>

            {/* Coupon */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-6 bg-emerald-50 border border-emerald-200 rounded-lg">
              <div className="flex items-center gap-3">
                <Ticket className="size-5 text-emerald-600 shrink-0" />
                <code className="text-2xl md:text-3xl font-bold tracking-wider text-emerald-700">
                  {discountCode}
                </code>
              </div>
              <button
                onClick={handleCopy}
                className={cn(
                  'inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-all',
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
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
                    Copiar código
                  </>
                )}
              </button>
            </div>
          </section>

          {/* Divider */}
          <div className="border-t border-border mb-20" />

          {/* Next Steps Section */}
          <section className="mb-20">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-10">
              Próximos passos
            </h2>

            <div className="grid md:grid-cols-3 gap-8 md:gap-12">
              <div>
                <div className="flex items-center justify-center size-12 rounded-full bg-[#871818]/10 text-[#871818] mb-4">
                  <Mail className="size-5" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Confirmação por e-mail</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Você receberá um e-mail com todos os detalhes da sua compra e documentação necessária.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-center size-12 rounded-full bg-[#871818]/10 text-[#871818] mb-4">
                  <Truck className="size-5" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Contato do vendedor</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  O vendedor entrará em contato em até 24 horas para combinar a entrega do veículo.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-center size-12 rounded-full bg-[#871818]/10 text-[#871818] mb-4">
                  <ClipboardCheck className="size-5" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Transferência</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Após o pagamento, combine a data de vistoria e transferência do documento.
                </p>
              </div>
            </div>
          </section>

          {/* Divider */}
          <div className="border-t border-border mb-20" />

          {/* Feedback Section */}
          <section className="mb-20">
            <div className="flex items-center gap-3 mb-6">
              <ThumbsUp className="size-5 text-[#871818]" />
              <span className="text-sm font-semibold uppercase tracking-wider text-[#871818]">
                Sua opinião
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              Como foi sua experiência?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl">
              Sua avaliação nos ajuda a melhorar constantemente nossos serviços.
            </p>

            {submitted ? (
              <div className="flex items-center gap-4 p-6 bg-emerald-50 border border-emerald-200 rounded-lg">
                <CheckCircle2 className="size-6 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-semibold text-foreground">Obrigado pelo feedback!</p>
                  <p className="text-sm text-muted-foreground">Sua avaliação foi enviada com sucesso.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="max-w-xl">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Avalie sua experiência
                  </label>
                  <StarRating value={rating} onChange={setRating} />
                </div>

                <div className="mb-6">
                  <label htmlFor="feedback-text" className="block text-sm font-medium text-foreground mb-2">
                    Comentário <span className="text-muted-foreground font-normal">(opcional)</span>
                  </label>
                  <textarea
                    id="feedback-text"
                    className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-[#871818] focus:outline-none focus:ring-1 focus:ring-[#871818] transition-all resize-none"
                    rows={4}
                    placeholder="Conte um pouco sobre sua experiência de compra..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    maxLength={500}
                  />
                  <div className="mt-2 text-right text-xs text-muted-foreground">
                    {feedback.length}/500
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={rating === 0}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium transition-all',
                    rating === 0
                      ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                      : 'bg-[#871818] text-white hover:bg-[#6b1010]'
                  )}
                >
                  <Send className="size-4" />
                  Enviar avaliação
                </button>
              </form>
            )}
          </section>

          {/* Divider */}
          <div className="border-t border-border mb-20" />

          {/* Actions */}
          <section className="mb-20">
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/category"
                id="buyer-catalog-btn"
                className="group inline-flex items-center justify-center gap-2 rounded-md bg-[#871818] px-6 py-3 text-sm font-medium text-white transition-all hover:bg-[#6b1010]"
              >
                <LayoutGrid className="size-4" />
                Ver catálogo de veículos
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/"
                id="buyer-home-btn"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-background px-6 py-3 text-sm font-medium text-foreground transition-all hover:bg-muted"
              >
                <Home className="size-4" />
                Voltar ao início
              </Link>
            </div>
          </section>

          {/* Support */}
          <section className="p-6 bg-muted/50 border border-border rounded-lg">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-4 flex-1">
                <div className="flex items-center justify-center size-10 rounded-full bg-blue-100 text-blue-600 shrink-0">
                  <Headphones className="size-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Precisa de ajuda?</h3>
                  <p className="text-sm text-muted-foreground">Nossa equipe está disponível para ajudar.</p>
                </div>
              </div>
              <a
                href="mailto:suporte@machocar.com.br"
                id="buyer-support-btn"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-blue-200 bg-white px-4 py-2.5 text-sm font-medium text-blue-600 transition-all hover:bg-blue-50"
              >
                <Mail className="size-4" />
                Falar com suporte
              </a>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  )
}