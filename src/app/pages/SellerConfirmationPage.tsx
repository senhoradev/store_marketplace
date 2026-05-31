import { Link } from 'react-router';
import {
  BadgePercent,
  LayoutGrid,
  Home,
  Mail,
  FileText,
  Wallet,
  Car,
  ArrowRight,
  TrendingUp,
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
 * Pagina de confirmacao de venda - exibida apos uma venda ser concluida
 */
export function SellerConfirmationPage() {
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
      title: 'Contato do comprador',
      description: 'O comprador entrara em contato para combinar a entrega do veiculo.',
    },
    {
      icon: <FileText className="size-5" />,
      title: 'Transferencia de documentacao',
      description: 'Providencie o CRLV e demais documentos para a transferencia.',
    },
    {
      icon: <Wallet className="size-5" />,
      title: 'Pagamento confirmado',
      description: 'Apos confirmacao do pagamento, o anuncio sera encerrado automaticamente.',
    },
  ];

  return (
    <Layout user={user}>
      <ConfirmationHero
        badge="Venda confirmada com sucesso"
        title="Parabens pela venda!"
        subtitle="Obrigado por confiar na MachoCar. Sua transacao foi concluida com sucesso."
      />

      <div className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-4xl">
          {/* Discount Section */}
          <CouponCard
            code="VENDER10"
            label="Beneficio exclusivo"
            title="10% de desconto na sua proxima comissao"
            description="Como reconhecimento pela sua parceria, o desconto sera aplicado automaticamente na sua proxima venda realizada pela plataforma."
            icon={<BadgePercent className="size-5" />}
            colorScheme="amber"
          />

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
              Estatisticas do mes
            </h2>

            <div className="grid grid-cols-3 gap-6">
              <div className="text-center p-6 bg-muted/50 rounded-lg">
                <p className="text-4xl md:text-5xl font-bold text-foreground mb-2">1</p>
                <p className="text-sm text-muted-foreground">Venda este mes</p>
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

          <div className="border-t border-border mb-20" />

          {/* Next Steps Section */}
          <NextStepsSection title="O que acontece agora?" steps={nextSteps} />

          <div className="border-t border-border mb-20" />

          {/* Feedback Section */}
          <FeedbackSection
            label="Sua experiencia importa"
            title="Como foi vender conosco?"
            description="Sua avaliacao nos ajuda a melhorar constantemente a experiencia de venda."
            placeholder="Conte como foi o processo de anunciar e vender... O que gostou? O que pode melhorar?"
            textareaId="seller-feedback-text"
            submitButtonId="seller-submit-feedback-btn"
          />

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
                Anunciar novo veiculo
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
