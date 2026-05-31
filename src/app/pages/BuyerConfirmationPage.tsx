import { Link } from 'react-router';
import {
  Gift,
  Ticket,
  LayoutGrid,
  Home,
  Mail,
  Truck,
  ClipboardCheck,
  ArrowRight,
} from 'lucide-react';
import { Layout } from '../components/Layout';
import {
  ConfirmationHero,
  CouponCard,
  NextStepsSection,
  FeedbackSection,
  SupportSection,
} from '../components/confirmation';
import { useAuthenticatedUser } from '../hooks';

/**
 * Pagina de confirmacao de compra - exibida apos uma compra ser concluida
 */
export function BuyerConfirmationPage() {
  const { user, loading } = useAuthenticatedUser();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground animate-pulse">Carregando...</p>
      </div>
    );
  }

  const nextSteps = [
    {
      icon: <Mail className="size-5" />,
      title: 'Confirmacao por e-mail',
      description: 'Voce recebera um e-mail com todos os detalhes da sua compra e documentacao necessaria.',
    },
    {
      icon: <Truck className="size-5" />,
      title: 'Contato do vendedor',
      description: 'O vendedor entrara em contato em ate 24 horas para combinar a entrega do veiculo.',
    },
    {
      icon: <ClipboardCheck className="size-5" />,
      title: 'Transferencia',
      description: 'Apos o pagamento, combine a data de vistoria e transferencia do documento.',
    },
  ];

  return (
    <Layout user={user}>
      <ConfirmationHero
        badge="Compra confirmada com sucesso"
        title="Obrigado pela sua compra"
        subtitle="Seja bem-vindo a familia MachoCar. Sua jornada comeca agora."
      />

      <div className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-4xl">
          {/* Discount Section */}
          <CouponCard
            code="MACHOCAR10"
            label="Presente especial para voce"
            title="Ganhe 10% de desconto na sua proxima compra"
            description="Como forma de agradecimento pela confianca, preparamos um cupom exclusivo valido por 90 dias."
            icon={<Gift className="size-5" />}
            colorScheme="emerald"
          />

          <div className="border-t border-border mb-20" />

          {/* Next Steps Section */}
          <NextStepsSection title="Proximos passos" steps={nextSteps} />

          <div className="border-t border-border mb-20" />

          {/* Feedback Section */}
          <FeedbackSection
            label="Sua opiniao"
            title="Como foi sua experiencia?"
            description="Sua avaliacao nos ajuda a melhorar constantemente nossos servicos."
            placeholder="Conte um pouco sobre sua experiencia de compra..."
            textareaId="buyer-feedback-text"
            submitButtonId="buyer-submit-feedback-btn"
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

          {/* Support */}
          <SupportSection />
        </div>
      </div>
    </Layout>
  );
}
