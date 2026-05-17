import {
  ArrowLeftRight,
  Banknote,
  Calendar,
  Car,
  DoorOpen,
  Fuel,
  Gauge,
  Hash,
  MapPin,
  Palette,
  Pencil,
  Settings2,
  Tag
} from 'lucide-react'
import {Card, CardContent, CardHeader, CardTitle} from '../components/ui/card'
import {Badge} from '../components/ui/badge'
import {Separator} from '../components/ui/separator'
import {formatCurrency, formatNumber} from '../services/utils'
import {authApi, UserData, Vehicle} from "../../app/services/api";
import {useEffect, useState} from "react";
import { useNavigate } from "react-router";

interface VehicleDetailsProps {
  vehicle: Vehicle
}

interface DetailItemProps {
  icon: React.ReactNode
  label: string
  value: string | number | undefined | null
}

function DetailItem({ icon, label, value }: DetailItemProps) {
  if (value === undefined || value === null) return null

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center justify-center size-10 rounded-lg bg-secondary text-muted-foreground">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="font-medium text-foreground">{value}</span>
      </div>
    </div>
  )
}

export function VehicleDetails({ vehicle }: VehicleDetailsProps) {
  const [user, setUser] = useState<UserData>()
  const navigate = useNavigate()
  const {
    title,
    description,
    price,
    brand,
    model,
    version,
    manufactureYear,
    modelYear,
    mileage,
    fuel,
    transmission,
    bodyType,
    color,
    doors,
    finalPlate,
    fipePrice,
    acceptsFinancing,
    acceptsTrade,
    city,
    state,
    owner
  } = vehicle

  const yearDisplay =
    manufactureYear && modelYear
      ? `${manufactureYear}/${modelYear}`
      : manufactureYear || modelYear

  const locationDisplay = city && state ? `${city}, ${state}` : city || state
  useEffect(() => {
    authApi.getMe()
      .then((user) => setUser(user))
  }, []);

  const isOwner: Boolean = user?.id === owner.id

  return (
    <Card className="border-border">
      <CardHeader className="gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between gap-2">
            <CardTitle className="text-2xl text-balance ">{title}</CardTitle>
            {isOwner && (
              <button
                onClick={() => navigate("/anunciar")}
                className="hidden sm:flex items-center gap-1.5 h-9 px-4 rounded-md bg-primary hover:bg-primary/90 transition-colors text-primary-foreground text-sm font-medium"
              >
                <Pencil  className="size-4"/>
                Editar Anúncio
              </button>
            )}
          </div>
          {(brand || model || version) && (
            <p className="text-muted-foreground text-sm">
              {[brand, model, version].filter(Boolean).join(' ')}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-primary">
              {formatCurrency(price)}
            </span>
          </div>
          
          {fipePrice && (
            <div className="flex items-center gap-2 text-sm">
              <Tag className="size-4 text-muted-foreground" />
              <span className="text-muted-foreground">Tabela FIPE:</span>
              <span className="font-medium">{formatCurrency(fipePrice)}</span>
              {price < fipePrice && (
                <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                  Abaixo da FIPE
                </Badge>
              )}
            </div>
          )}

          {/* Condition Badges */}
          <div className="flex flex-wrap gap-2">
            {acceptsFinancing && (
              <Badge variant="outline" className="gap-1.5 py-1 px-2.5">
                <Banknote className="size-3.5" />
                Aceita financiamento
              </Badge>
            )}
            {acceptsTrade && (
              <Badge variant="outline" className="gap-1.5 py-1 px-2.5">
                <ArrowLeftRight className="size-3.5" />
                Aceita troca
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        <Separator />

        {/* Technical Specifications */}
        <div className="flex flex-col gap-4">
          <h3 className="font-semibold text-foreground">Especificações</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <DetailItem
              icon={<Calendar className="size-5" />}
              label="Ano"
              value={yearDisplay}
            />
            <DetailItem
              icon={<Gauge className="size-5" />}
              label="Quilometragem"
              value={mileage ? `${formatNumber(mileage)} km` : undefined}
            />
            <DetailItem
              icon={<Fuel className="size-5" />}
              label="Combustível"
              value={fuel}
            />
            <DetailItem
              icon={<Settings2 className="size-5" />}
              label="Câmbio"
              value={transmission}
            />
            <DetailItem
              icon={<Car className="size-5" />}
              label="Carroceria"
              value={bodyType}
            />
            <DetailItem
              icon={<Palette className="size-5" />}
              label="Cor"
              value={color}
            />
            <DetailItem
              icon={<DoorOpen className="size-5" />}
              label="Portas"
              value={doors}
            />
            <DetailItem
              icon={<Hash className="size-5" />}
              label="Final da placa"
              value={finalPlate}
            />
            <DetailItem
              icon={<MapPin className="size-5" />}
              label="Localização"
              value={locationDisplay}
            />
          </div>
        </div>

        {/* Description */}
        {description && (
          <>
            <Separator />
            <div className="flex flex-col gap-3">
              <h3 className="font-semibold text-foreground">Descrição</h3>
              <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                {description}
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
