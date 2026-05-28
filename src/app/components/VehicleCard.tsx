import { Heart, MapPin, Fuel, Cog, Calendar, Gauge } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import type { Vehicle } from '../services/types'

interface VehicleCardProps {
  vehicle: Vehicle
  onFavorite?: (id: string) => void
  onClick?: (id: string) => void
  isFavorite?: boolean
}

export function VehicleCard({
  vehicle,
  onFavorite,
  onClick,
  isFavorite = false,
}: VehicleCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
    }).format(value)
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value)
  }

  return (
    <Card
      className="group overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:border-primary/20"
      onClick={() => onClick?.(vehicle.id)}
    >
      {/* Imagem */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={
            vehicle.images?.[0] ||
            'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&h=300&fit=crop'
          }
          alt={vehicle.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Badges de condição */}
        <div className="absolute top-2 left-2 flex gap-1">
          {vehicle.acceptsFinancing && (
            <Badge variant="secondary" className="text-xs bg-card/90 backdrop-blur-sm">
              Financia
            </Badge>
          )}
          {vehicle.acceptsTrade && (
            <Badge variant="secondary" className="text-xs bg-card/90 backdrop-blur-sm">
              Troca
            </Badge>
          )}
        </div>

        {/* Botão de favorito */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onFavorite?.(vehicle.id)
          }}
          className={`
            absolute top-2 right-2 p-2 rounded-full transition-colors
            ${
              isFavorite
                ? 'bg-primary text-primary-foreground'
                : 'bg-card/90 backdrop-blur-sm text-muted-foreground hover:text-primary'
            }
          `}
        >
          <Heart className={`size-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      <CardContent className="p-4">
        {/* Título e Preço */}
        <div className="mb-3">
          <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {vehicle.title}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-1">
            {vehicle.brand} {vehicle.model} {vehicle.version}
          </p>
        </div>

        <p className="text-xl font-bold text-primary mb-3">
          {formatCurrency(vehicle.price)}
        </p>

        {/* Especificações */}
        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <Calendar className="size-3" />
            <span>
              {vehicle.manufactureYear}/{vehicle.modelYear}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Gauge className="size-3" />
            <span>{formatNumber(vehicle.mileage)} km</span>
          </div>
          <div className="flex items-center gap-1">
            <Fuel className="size-3" />
            <span>{vehicle.fuel}</span>
          </div>
          <div className="flex items-center gap-1">
            <Cog className="size-3" />
            <span>{vehicle.transmission}</span>
          </div>
        </div>

        {/* Localização */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground pt-3 border-t border-border">
          <MapPin className="size-3" />
          <span>
            {vehicle.city}, {vehicle.state}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
