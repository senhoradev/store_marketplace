import { Link } from 'react-router'
import { Header } from '../components/header'
import { Footer } from '../components/footer'
import { useAuth } from '../hooks/useAuth'
import { useCopyToClipboard } from '../hooks/useCopyToClipboard'
import {
  ConfirmationHero,
  NextStep,
  NextStepsGrid,
  DiscountCoupon,
  FeedbackSection,
  SupportSection,
} from '../components/confirmation'
import {
  Gift,
  Ticket,
  LayoutGrid,
  Home,
  Mail,
  Truck,
  ClipboardCheck,
  ArrowRight,
} from 'lucide-react'

export function BuyerConfirmationPage() {
  const { user } = useAuth()
  const { copied, copy } = useCopyToClipboard()
  const discountCode = 'MACHOCAR10'

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header user={user} />

      <ConfirmationHero
        badge="Compra confirmada com sucesso"
        title="Obrigado pela sua compra"
        subtitle="Seja bem-vindo a familia MachoCar. Sua jornada comeca agora."
      />

      <main className="flex-1 px-6 py-16 md:py-24">
        <div className="mx-auto max-w-4xl">
          {/* Discount Section */}
          <DiscountCoupon
            icon={<Gift className="size-5" />}
            iconColor="text-emerald-600"
            label="Presente especial para voce"
            title="Ganhe 10% de desconto na sua proxima compra"
            description="Como forma de agradecimento pela confianca, preparamos um cupom exclusivo valido por 90 dias."
            code={discountCode}
            copied={copied}
            onCopy={() => copy(discountCode)}
            variant="emerald"
          />

          <div className="border-t border-border mb-20" />

          {/* Next Steps Section */}
          <section className="mb-20">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-10">
              Proximos passos
            </h2>

            <NextStepsGrid>
              <NextStep
                icon={<Mail className="size-5" />}
                title="Confirmacao por e-mail"
                description="Voce recebera um e-mail com todos os detalhes da sua compra e documentacao necessaria."
              />
              <NextStep
                icon={<Truck className="size-5" />}
                title="Contato do vendedor"
                description="O vendedor entrara em contato em ate 24 horas para combinar a entrega do veiculo."
              />
              <NextStep
                icon={<ClipboardCheck className="size-5" />}
                title="Transferencia"
                description="Apos o pagamento, combine a data de vistoria e transferencia do documento."
              />
            </NextStepsGrid>
          </section>

          <div className="border-t border-border mb-20" />

          {/* Feedback Section */}
          <FeedbackSection
            title="Como foi sua experiencia?"
            subtitle="Sua avaliacao nos ajuda a melhorar constantemente nossos servicos."
            textareaId="buyer-feedback-text"
            textareaPlaceholder="Conte um pouco sobre sua experiencia de compra..."
          />

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
                Ver catalogo de veiculos
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/"
                id="buyer-home-btn"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-background px-6 py-3 text-sm font-medium text-foreground transition-all hover:bg-muted"
              >
                <Home className="size-4" />
                Voltar ao inicio
              </Link>
            </div>
          </section>

          <SupportSection />
        </div>
      </main>

      <Footer />
    </div>
  )
}
