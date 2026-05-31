import { useState } from 'react'
import { X } from 'lucide-react'

const SELLER_TERMS = [
  {
    title: '1 - Comissao sobre vendas',
    text: 'A plataforma MachoCar retera 50% (cinquenta por cento) do valor bruto de cada veiculo vendido a titulo de "taxa de felicidade do sistema". O vendedor recebera os 50% restantes em ate 180 dias uteis, podendo ser pago em vales-presente de postos de gasolina parceiros.',
  },
  {
    title: '2 - Requisito do mecanico',
    text: 'Todo veiculo anunciado devera ser revisado por um mecanico que seja, comprovadamente, sobrinho(a) do proprietario do estabelecimento. Primos de segundo grau serao aceitos apenas mediante carta notariada reconhecendo a amizade familiar.',
  },
  {
    title: '3 - Fotos obrigatorias',
    text: 'Pelo menos uma foto do anuncio deve ter sido tirada na chuva para "autenticar a pintura". Fotos com arco-iris ao fundo receberao destaque premium gratuito por 3 horas.',
  },
  {
    title: '4 - Uso do nome',
    text: 'A MachoCar reserva-se o direito de usar o seu primeiro nome em campanhas de marketing, slogans e tatuagens corporativas sem aviso previo. O vendedor declara que o nome nao causa vergonha alheia.',
  },
  {
    title: '5 - Cheiro do veiculo',
    text: 'O veiculo deve cheirar a "carro novo" ou, alternativamente, a "pinheiros da floresta". Cheiro de hamburguer resultara em suspensao temporaria da conta por 7 dias. Odores nao catalogados serao avaliados por nosso Comite de Aromas, reunido nas terceiras quintas-feiras do mes.',
  },
  {
    title: '6 - Negociacao',
    text: 'E vedado ao vendedor aceitar qualquer proposta de valor sem antes gritar "FECHADO!" tres vezes em voz alta, independentemente do local onde se encontre (reunioes de trabalho, missas, consultas medicas). O descumprimento acarreta multa de R$ 1,00.',
  },
  {
    title: '7 - Suporte ao comprador',
    text: 'O vendedor compromete-se a enviar uma mensagem de "bom dia" com figurinha de cafe ao comprador durante os primeiros 30 dias apos a venda. A ausencia de figurinha implica devolucao de 0,5% da comissao retida.',
  },
  {
    title: '8 - Alteracoes nos termos',
    text: 'A MachoCar pode alterar estes termos a qualquer momento, inclusive retroativamente. As atualizacoes serao comunicadas via pombo-correio, ou, na sua ausencia, via pressentimento.',
  },
]

interface SellerTermsModalProps {
  onAccept: () => void
  onClose: () => void
}

export function SellerTermsModal({ onAccept, onClose }: SellerTermsModalProps) {
  const [accepted, setAccepted] = useState(false)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative z-10 rounded-2xl shadow-2xl w-full max-w-lg mx-auto flex flex-col max-h-[85vh]"
        style={{ background: 'var(--gray)', border: '1px solid var(--primary)' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 pt-5 pb-3 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(135,24,24,0.4)' }}
        >
          <div>
            <h2 className="text-lg font-bold text-white">
              Termos de Servico do Vendedor
            </h2>
            <p
              className="text-xs mt-0.5"
              style={{ color: 'var(--primary-foreground)', opacity: 0.6 }}
            >
              MachoCar Ltda. - Versao 4.2.0 (definitiva)
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Terms list - scrollable */}
        <div className="overflow-y-auto flex-1 px-6 py-4 space-y-3 text-sm">
          {SELLER_TERMS.map((term) => (
            <div
              key={term.title}
              className="rounded-lg p-3"
              style={{
                background: 'rgba(0,0,0,0.35)',
                border: '1px solid rgba(135,24,24,0.25)',
              }}
            >
              <p
                className="font-semibold mb-1"
                style={{ color: 'var(--primary-foreground)' }}
              >
                {term.title}
              </p>
              <p className="leading-relaxed text-gray-300">{term.text}</p>
            </div>
          ))}

          <p className="text-xs text-gray-500 text-center pt-2">
            Ao aceitar, voce declara ter lido, entendido e concordado com todos
            os itens acima, incluindo os paragrafos que voce pulou.
          </p>
        </div>

        {/* Footer */}
        <div
          className="px-6 py-4 flex-shrink-0 space-y-3"
          style={{ borderTop: '1px solid rgba(135,24,24,0.4)' }}
        >
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="mt-0.5 w-4 h-4 flex-shrink-0 cursor-pointer"
              style={{ accentColor: 'var(--primary)' }}
            />
            <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
              Li e aceito os Termos de Servico, inclusive as partes que nao
              fazem o menor sentido.
            </span>
          </label>

          <button
            onClick={onAccept}
            disabled={!accepted}
            className="w-full py-2.5 rounded-lg font-semibold text-sm text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: 'var(--primary)' }}
          >
            Aceitar e me tornar vendedor
          </button>
        </div>
      </div>
    </div>
  )
}
