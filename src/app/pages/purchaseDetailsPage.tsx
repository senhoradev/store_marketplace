import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router'
import { Header } from '../components/header'
import { Footer } from '../components/footer'
import {
  authApi, vehicleApi, purchaseApi,
  type UserData, type Vehicle, type Purchase
} from '../services/api'
import { ArrowLeft, Car, MessageSquare, Star, Tag } from 'lucide-react'
import { formatCurrency } from '../utils'

export function PurchaseDetailsPage() {
  const [searchParams] = useSearchParams()
  const vehicleId = searchParams.get('vehicleId')
  const navigate = useNavigate()

  const [user, setUser] = useState<UserData | null>(null)
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [purchase, setPurchase] = useState<Purchase | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authApi.isLoggedIn()) {
      navigate('/login')
      return
    }
    authApi.getMe().then(setUser).catch(() => navigate('/login'))
  }, [])

  useEffect(() => {
    if (!vehicleId) {
      setLoading(false)
      return
    }

    // Carrega veículo e compra em paralelo
    Promise.all([
      vehicleApi.getVehicleById(vehicleId),
      purchaseApi.getByVehicle(vehicleId),
    ])
      .then(([v, p]) => {
        setVehicle(v)
        if (p) {
          setPurchase(p)
        } else {
          // fallback para localStorage
          const localData = localStorage.getItem(`purchase_vehicle_${vehicleId}`)
          if (localData) {
            try { setPurchase(JSON.parse(localData)) } catch { /* ignora */ }
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [vehicleId])

  const isBuyer = !!user && !!purchase && purchase.buyerId === user.id

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header user={user} />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground animate-pulse text-sm">Carregando detalhes...</p>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Header user={user} />

      <main className="container max-w-7xl mx-auto px-4 py-10 flex-1">
        {/* Voltar */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors group"
        >
          <ArrowLeft className="size-4 group-hover:-translate-x-0.5 transition-transform" />
          Voltar
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-start">

          {/* ─── Painel esquerdo: dados do veículo ─── */}
          <div className="rounded-2xl border border-border overflow-hidden bg-card shadow-sm">
            {/* Foto principal */}
            <div className="relative h-60 lg:h-80 bg-muted overflow-hidden">
              {vehicle?.images?.[0] ? (
                <img
                  src={vehicle.images[0]}
                  alt={vehicle.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <Car className="size-20 text-muted-foreground/20" />
                </div>
              )}
              {/* Selo "Vendido" */}
              <div className="absolute top-4 left-4">
                <span className="bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg tracking-wide">
                  VENDIDO
                </span>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <h2 className="text-xl font-bold text-foreground leading-snug">
                  {vehicle?.title || purchase?.vehicleTitle || 'Veículo'}
                </h2>
                {vehicle && (
                  <p className="text-muted-foreground text-sm mt-1">
                    {vehicle.brand} {vehicle.model}
                    {vehicle.manufactureYear && ` · ${vehicle.manufactureYear}/${vehicle.modelYear}`}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Tag className="size-5 text-red-600" />
                <span className="text-2xl font-bold text-red-600">
                  {formatCurrency(purchase?.vehiclePrice ?? vehicle?.price ?? 0)}
                </span>
              </div>

              {/* Detalhes técnicos */}
              {vehicle && (
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {vehicle.mileage != null && (
                    <div className="bg-muted/50 rounded-xl p-3">
                      <p className="text-muted-foreground text-xs mb-0.5">Quilometragem</p>
                      <p className="font-semibold text-foreground">{vehicle.mileage.toLocaleString('pt-BR')} km</p>
                    </div>
                  )}
                  {vehicle.transmission && (
                    <div className="bg-muted/50 rounded-xl p-3">
                      <p className="text-muted-foreground text-xs mb-0.5">Câmbio</p>
                      <p className="font-semibold text-foreground">{vehicle.transmission}</p>
                    </div>
                  )}
                  {vehicle.fuel && (
                    <div className="bg-muted/50 rounded-xl p-3">
                      <p className="text-muted-foreground text-xs mb-0.5">Combustível</p>
                      <p className="font-semibold text-foreground">{vehicle.fuel}</p>
                    </div>
                  )}
                  {vehicle.color && (
                    <div className="bg-muted/50 rounded-xl p-3">
                      <p className="text-muted-foreground text-xs mb-0.5">Cor</p>
                      <p className="font-semibold text-foreground">{vehicle.color}</p>
                    </div>
                  )}
                  {vehicle.city && (
                    <div className="bg-muted/50 rounded-xl p-3 col-span-2">
                      <p className="text-muted-foreground text-xs mb-0.5">Localização</p>
                      <p className="font-semibold text-foreground">{vehicle.city}, {vehicle.state}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Data da compra */}
              {purchase?.purchasedAt && (
                <p className="text-xs text-muted-foreground border-t border-border pt-4">
                  {isBuyer ? 'Comprado' : 'Vendido'} em{' '}
                  {new Date(purchase.purchasedAt).toLocaleDateString('pt-BR', {
                    day: '2-digit', month: 'long', year: 'numeric'
                  })}
                </p>
              )}
            </div>
          </div>

          {/* ─── Painel direito: mensagem de confirmação ─── */}
          <div className="flex flex-col gap-5">
            {/* Banner de sucesso */}
            <div
              className={`rounded-2xl p-8 lg:p-10 text-center border shadow-sm ${
                isBuyer
                  ? 'bg-gradient-to-br from-green-50 to-emerald-50/60 border-green-200'
                  : 'bg-gradient-to-br from-blue-50 to-indigo-50/60 border-blue-200'
              }`}
            >
              <div className="text-7xl mb-5">{isBuyer ? '🎉' : '🏆'}</div>
              <h1
                className={`text-3xl font-bold mb-3 ${isBuyer ? 'text-green-800' : 'text-blue-800'}`}
              >
                {isBuyer ? 'Compra Concluída!' : 'Venda Concluída!'}
              </h1>
              <p className={`text-sm leading-relaxed ${isBuyer ? 'text-green-700' : 'text-blue-700'}`}>
                {isBuyer
                  ? 'Parabéns pela sua compra! Obrigado por escolher a Webmotors. Esperamos que aproveite muito seu novo veículo!'
                  : 'Parabéns pela venda! Obrigado por anunciar na Webmotors. Esperamos vê-lo novamente em breve com novos anúncios!'}
              </p>
            </div>

            {/* Card de feedback / CTA */}
            <div className="rounded-2xl border border-border bg-card p-6 space-y-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <Star className="size-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {isBuyer ? 'Avalie sua experiência' : 'Nos ajude a melhorar'}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {isBuyer
                      ? 'Sua opinião é muito importante para nós!'
                      : 'Compartilhe sua experiência como vendedor.'}
                  </p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {isBuyer
                  ? 'Ficou com alguma dúvida ou precisa de suporte? Nossa equipe está pronta para te ajudar!'
                  : 'Quer anunciar mais veículos? Acesse seu perfil e crie novos anúncios agora mesmo.'}
              </p>

              <div className="flex flex-col gap-3">
                {isBuyer ? (
                  <a
                    href="mailto:contato@webmotors.com.br"
                    className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 transition-colors text-white py-3 rounded-xl font-semibold text-sm"
                  >
                    <MessageSquare className="size-4" />
                    Fale Conosco
                  </a>
                ) : (
                  <Link
                    to="/anunciar"
                    className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 transition-colors text-white py-3 rounded-xl font-semibold text-sm"
                  >
                    <Car className="size-4" />
                    Anunciar Novo Veículo
                  </Link>
                )}

                <Link
                  to="/"
                  className="flex items-center justify-center gap-2 border border-border hover:bg-muted transition-colors py-3 rounded-xl font-semibold text-sm text-foreground"
                >
                  Ir para o Início
                </Link>
              </div>
            </div>

            {/* ID da transação */}
            {purchase && (
              <p className="text-xs text-muted-foreground text-center">
                ID da {isBuyer ? 'compra' : 'venda'}:{' '}
                <span className="font-mono">{purchase.id}</span>
              </p>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
