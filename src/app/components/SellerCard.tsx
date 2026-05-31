import { MapPin, Phone, MessageCircle, User } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Avatar, AvatarFallback } from '../components/ui/avatar'
import { Separator } from '../components/ui/separator'
import { SellerData } from "@/src/app/pages/detailsPage";
import { useNavigate } from 'react-router'
import { purchaseApi } from '../services/api'
import { useState } from 'react'


interface SellerCardProps {
  seller: SellerData
  vehicleId: string
}

function getInitials(name: string): string {
  const parts = name.trim().split(' ')
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

export function SellerCard({ seller, vehicleId }: SellerCardProps) {
  const { fullName, city, state } = seller
  const locationDisplay = city && state ? `${city}, ${state}` : city || state
  const navigate = useNavigate()
  const [starting, setStarting] = useState(false)

  const handleStartChat = async () => {
    setStarting(true)
    try {
      await purchaseApi.startPurchase(vehicleId)
    } catch {
      // Silently handle error - will navigate to chat regardless
    } finally {
      setStarting(false)
      navigate(`/chat?vehicleId=${vehicleId}`)
    }
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-lg">Vendedor</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-5">
        <div className="flex items-center gap-4">
          <Avatar className="size-14 border-2 border-border">
            <AvatarFallback className="bg-secondary text-foreground text-lg font-semibold">
              {getInitials(fullName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-foreground">{fullName}</span>
            {locationDisplay && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="size-4" />
                <span>{locationDisplay}</span>
              </div>
            )}
          </div>
        </div>

        <Separator />

        <div className="flex flex-col gap-3">
          <Button className="w-full gap-2">
            <Phone className="size-4" />
            Ver telefone
          </Button>

          <Button variant="outline" className="w-full gap-2" onClick={handleStartChat} disabled={starting}>
            <MessageCircle className="size-4" />
            {starting ? 'Iniciando...' : 'Conversar com o Vendedor'}
          </Button>
        </div>

        <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
          <User className="size-5 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            Negocie diretamente com o vendedor. Verifique sempre a documentação do veículo antes de fechar negócio.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
