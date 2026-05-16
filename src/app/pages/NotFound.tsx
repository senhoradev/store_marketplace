import { Button } from '../components/ui/button'
import { Car, Home, Search, ArrowLeft } from 'lucide-react'

interface NotFoundProps {
  onGoHome?: () => void
  onGoBack?: () => void
}

export function NotFound({ onGoHome, onGoBack }: NotFoundProps) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="relative mb-8">
          <div className="w-32 h-32 mx-auto bg-muted rounded-full flex items-center justify-center">
            <Car className="w-16 h-16 text-muted-foreground" />
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
            404
          </div>
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-3">
          Página não encontrada
        </h1>

        <p className="text-muted-foreground mb-8 leading-relaxed">
          Parece que o veículo que você está procurando deu uma volta errada.
          Não se preocupe, vamos te ajudar a encontrar o caminho certo.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={onGoHome} className="gap-2">
            <Home className="w-4 h-4" />
            Ir para o início
          </Button>
          <Button variant="outline" onClick={onGoBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Voltar à página anterior
          </Button>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">
            Você também pode tentar:
          </p>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li className="flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Verificar se o endereço está correto
            </li>
            <li className="flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Navegar pelas categorias de veículos
            </li>
            <li className="flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Entrar em contato com nosso suporte
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
