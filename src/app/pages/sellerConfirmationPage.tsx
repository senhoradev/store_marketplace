import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { Header } from '../components/header'
import { Footer } from '../components/footer'
import { authApi, type UserData } from '../services/api'
import {
  CheckCircle2,
  Star,
  BadgePercent,
  Send,
  ThumbsUp,
  LayoutGrid,
  Home,
  Headphones,
  Mail,
  FileText,
  Wallet,
  Car,
  Copy,
  Check,
  ArrowRight,
  TrendingUp,
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
export function SellerConfirmationPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState<UserData | null>(null)
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!authApi.isLoggedIn()) {
      navigate('/login')
      return
    }
    authApi.getMe().then(setUser).catch(() => navigate('/login'))
  }, [navigate])

  const discountCode = 'VENDER10'

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
      <Header user={user} />

      {/* Hero Section */}
      <section className="relative bg-[#871818] overflow-hidden">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent" />

        <div className="relative z-10 px-6 py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            {/* Success Badge */}
            <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-5 py-2.5">
              <CheckCircle2 className="size-5 text-emerald-400" />
              <span className="text-sm font-medium text-white/90 tracking-wide">Venda confirmada com sucesso</span>
            </div>

            {/* Title */}
            <h1 className="mb-5 text-4xl md:text-6xl font-bold text-white tracking-tight">
              Parabéns pela venda!
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-white/70 leading-relaxed max-w-xl mx-auto">
              Obrigado por confiar na MachoCar. Sua transação foi concluída com sucesso.
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
              <BadgePercent className="size-5 text-amber-600" />
              <span className="text-sm font-semibold uppercase tracking-wider text-amber-600">
                Benefício exclusivo
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              10% de desconto na sua próxima comissão
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl">
              Como reconhecimento pela sua parceria, o desconto será aplicado automaticamente na sua próxima venda realizada pela plataforma.
            </p>

            {/* Coupon */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-6 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center gap-3">
                <BadgePercent className="size-5 text-amber-600 shrink-0" />
                <code className="text-2xl md:text-3xl font-bold tracking-wider text-amber-700">
                  {discountCode}
                </code>
              </div>
              <button
                onClick={handleCopy}
                className={cn(
                  'inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-all',
                  copied
                    ? 'bg-amber-600 text-white'
                    : 'bg-amber-600 text-white hover:bg-amber-700'
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

          {/* Stats Section */}
          <section className="mb-20">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="size-5 text-blue-600" />
              <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                Seu desempenho
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-10">
              Estatísticas do mês
            </h2>

            <div className="grid grid-cols-3 gap-6">
              <div className="text-center p-6 bg-muted/50 rounded-lg">
                <p className="text-4xl md:text-5xl font-bold text-foreground mb-2">1</p>
                <p className="text-sm text-muted-foreground">Venda este mês</p>
              </div>
              <div className="text-center p-6 bg-emerald-50 border border-emerald-200 rounded-lg">
                <p className="text-4xl md:text-5xl font-bold text-emerald-600 mb-2">+10%</p>
                <p className="text-sm text-muted-foreground">Desconto garantido</p>
              </div>
              <div className="text-center p-6 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-4xl md:text-5xl font-bold text-amber-600 mb-2">Ativo</p>
                <p className="text-sm text-muted-foreground">Status vendedor</p>
              </div>
            </div>
          </section>

          {/* Divider */}
          <div className="border-t border-border mb-20" />

          {/* Next Steps Section */}
          <section className="mb-20">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-10">
              O que acontece agora?
            </h2>

            <div className="grid md:grid-cols-3 gap-8 md:gap-12">
              <div>
                <div className="flex items-center justify-center size-12 rounded-full bg-[#871818]/10 text-[#871818] mb-4">
                  <Mail className="size-5" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Contato do comprador</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  O comprador entrará em contato para combinar a entrega do veículo.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-center size-12 rounded-full bg-[#871818]/10 text-[#871818] mb-4">
                  <FileText className="size-5" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Transferência de documentação</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Providencie o CRLV e demais documentos para a transferência.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-center size-12 rounded-full bg-[#871818]/10 text-[#871818] mb-4">
                  <Wallet className="size-5" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Pagamento confirmado</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Após confirmação do pagamento, o anúncio será encerrado automaticamente.
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
                Sua experiência importa
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              Como foi vender conosco?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl">
              Sua avaliação nos ajuda a melhorar constantemente a experiência de venda.
            </p>

            {submitted ? (
              <div className="flex items-center gap-4 p-6 bg-emerald-50 border border-emerald-200 rounded-lg">
                <CheckCircle2 className="size-6 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-semibold text-foreground">Feedback enviado! Muito obrigado.</p>
                  <p className="text-sm text-muted-foreground">Sua opinião nos ajuda a melhorar cada vez mais.</p>
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
                  <label htmlFor="seller-feedback-text" className="block text-sm font-medium text-foreground mb-2">
                    Comentário <span className="text-muted-foreground font-normal">(opcional)</span>
                  </label>
                  <textarea
                    id="seller-feedback-text"
                    className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-[#871818] focus:outline-none focus:ring-1 focus:ring-[#871818] transition-all resize-none"
                    rows={4}
                    placeholder="Conte como foi o processo de anunciar e vender... O que gostou? O que pode melhorar?"
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
                  id="seller-submit-feedback-btn"
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

                {rating === 0 && (
                  <p className="mt-3 text-xs text-muted-foreground">
                    Selecione ao menos uma estrela para enviar.
                  </p>
                )}
              </form>
            )}
          </section>

          {/* Divider */}
          <div className="border-t border-border mb-20" />

          {/* Actions */}
          <section className="mb-20">
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/anunciar"
                id="seller-new-listing-btn"
                className="group inline-flex items-center justify-center gap-2 rounded-md bg-[#871818] px-6 py-3 text-sm font-medium text-white transition-all hover:bg-[#6b1010]"
              >
                <Car className="size-4" />
                Anunciar novo veículo
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/profile"
                id="seller-profile-btn"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-background px-6 py-3 text-sm font-medium text-foreground transition-all hover:bg-muted"
              >
                <LayoutGrid className="size-4" />
                Ver meu perfil
              </Link>
              <Link
                to="/"
                id="seller-home-btn"
                className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium text-muted-foreground transition-all hover:text-foreground px-4 py-3"
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
                id="seller-support-btn"
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