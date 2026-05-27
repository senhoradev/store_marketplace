import { useState } from 'react'
import {
  Car,
  Calendar,
  Gauge,
  Fuel,
  Cog,
  Palette,
  DoorOpen,
  CreditCard,
  ArrowLeftRight,
  MapPin,
  X,
  SlidersHorizontal,
} from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { Checkbox } from './ui/checkbox'
import { Slider } from './ui/slider'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion'
import { Separator } from './ui/separator'
import type { VehicleFilters } from '../services/types'

// Opções de filtro
const brands = [
  'Chevrolet',
  'Fiat',
  'Ford',
  'Honda',
  'Hyundai',
  'Jeep',
  'Nissan',
  'Renault',
  'Toyota',
  'Volkswagen',
]

const fuels = ['Flex', 'Gasolina', 'Etanol', 'Diesel', 'Elétrico', 'Híbrido']

const transmissions = ['Manual', 'Automático', 'CVT', 'Automatizado']

const bodyTypes = [
  'Hatch',
  'Sedan',
  'SUV',
  'Picape',
  'Crossover',
  'Minivan',
  'Conversível',
  'Coupé',
]

const colors = [
  'Preto',
  'Branco',
  'Prata',
  'Cinza',
  'Vermelho',
  'Azul',
  'Verde',
  'Amarelo',
  'Marrom',
  'Bege',
]

const states = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
]

interface VehicleFiltersSidebarProps {
  filters: VehicleFilters
  onFiltersChange: (filters: VehicleFilters) => void
  onApplyFilters: () => void
  onClearFilters: () => void
  isOpen?: boolean
  onClose?: () => void
}

export function VehicleFiltersSidebar({
  filters,
  onFiltersChange,
  onApplyFilters,
  onClearFilters,
  isOpen = true,
  onClose,
}: VehicleFiltersSidebarProps) {
  const [priceRange, setPriceRange] = useState([
    filters.priceMin || 0,
    filters.priceMax || 500000,
  ])
  const [mileageRange, setMileageRange] = useState([
    filters.mileageMin || 0,
    filters.mileageMax || 200000,
  ])

  const updateFilter = <K extends keyof VehicleFilters>(
    key: K,
    value: VehicleFilters[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value)
    onFiltersChange({
      ...filters,
      priceMin: value[0],
      priceMax: value[1],
    })
  }

  const handleMileageChange = (value: number[]) => {
    setMileageRange(value)
    onFiltersChange({
      ...filters,
      mileageMin: value[0],
      mileageMax: value[1],
    })
  }

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

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i)

  return (
    <aside
      className={`
        bg-card border-r border-border h-full overflow-y-auto
        ${isOpen ? 'block' : 'hidden lg:block'}
        fixed lg:static inset-y-0 left-0 z-40 w-80 lg:w-72
      `}
    >
      {/* Cabeçalho */}
      <div className="sticky top-0 bg-card z-10 border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="size-5 text-primary" />
            <h2 className="font-semibold text-foreground">Filtros</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClearFilters}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Limpar
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="lg:hidden p-1 hover:bg-accent rounded-md transition-colors"
              >
                <X className="size-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-4">
        <Accordion
          type="multiple"
          defaultValue={['vehicle', 'price', 'year', 'features', 'conditions', 'location']}
          className="space-y-2"
        >
          {/* Veículo */}
          <AccordionItem value="vehicle" className="border rounded-lg px-3">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <Car className="size-4 text-primary" />
                <span>Veículo</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              {/* Marca */}
              <div className="space-y-2">
                <Label htmlFor="brand">Marca</Label>
                <Select
                  value={filters.brand || ''}
                  onValueChange={(value) => updateFilter('brand', value || "")}
                >
                  <SelectTrigger id="brand">
                    <SelectValue placeholder="Selecione a marca" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Modelo */}
              <div className="space-y-2">
                <Label htmlFor="model">Modelo</Label>
                <Input
                  id="model"
                  placeholder="Ex: Onix, Civic, Corolla..."
                  value={filters.model || ''}
                  onChange={(e) => updateFilter('model', e.target.value || "")}
                />
              </div>

              {/* Versão */}
              <div className="space-y-2">
                <Label htmlFor="version">Versão</Label>
                <Input
                  id="version"
                  placeholder="Ex: LT, LTZ, EX..."
                  value={filters.version || ''}
                  onChange={(e) => updateFilter('version', e.target.value || "")}
                />
              </div>

              {/* Carroceria */}
              <div className="space-y-2">
                <Label htmlFor="bodyType">Carroceria</Label>
                <Select
                  value={filters.bodyType || ''}
                  onValueChange={(value) => updateFilter('bodyType', value || "")}
                >
                  <SelectTrigger id="bodyType">
                    <SelectValue placeholder="Tipo de carroceria" />
                  </SelectTrigger>
                  <SelectContent>
                    {bodyTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Preço */}
          <AccordionItem value="price" className="border rounded-lg px-3">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <CreditCard className="size-4 text-primary" />
                <span>Preço</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div className="space-y-4">
                <Slider
                  value={priceRange}
                  min={0}
                  max={500000}
                  step={5000}
                  onValueChange={handlePriceChange}
                />
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{formatCurrency(priceRange[0])}</span>
                  <span>{formatCurrency(priceRange[1])}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="priceMin" className="text-xs">
                    Mínimo
                  </Label>
                  <Input
                    id="priceMin"
                    type="number"
                    placeholder="R$ 0"
                    value={filters.priceMin || ''}
                    onChange={(e) =>
                      updateFilter(
                        'priceMin',
                        e.target.value ? Number(e.target.value) : 0
                      )
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="priceMax" className="text-xs">
                    Máximo
                  </Label>
                  <Input
                    id="priceMax"
                    type="number"
                    placeholder="R$ 500.000"
                    value={filters.priceMax || ''}
                    onChange={(e) =>
                      updateFilter(
                        'priceMax',
                        e.target.value ? Number(e.target.value) : 0
                      )
                    }
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Ano */}
          <AccordionItem value="year" className="border rounded-lg px-3">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-primary" />
                <span>Ano</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="yearMin" className="text-xs">
                    Ano Mínimo
                  </Label>
                  <Select
                    value={filters.manufactureYearMin?.toString() || ''}
                    onValueChange={(value) =>
                      updateFilter('manufactureYearMin', value ? Number(value) : 0)
                    }
                  >
                    <SelectTrigger id="yearMin">
                      <SelectValue placeholder="De" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="yearMax" className="text-xs">
                    Ano Máximo
                  </Label>
                  <Select
                    value={filters.manufactureYearMax?.toString() || ''}
                    onValueChange={(value) =>
                      updateFilter('manufactureYearMax', value ? Number(value) : 3000)
                    }
                  >
                    <SelectTrigger id="yearMax">
                      <SelectValue placeholder="Até" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Características */}
          <AccordionItem value="features" className="border rounded-lg px-3">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <Cog className="size-4 text-primary" />
                <span>Características</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              {/* Quilometragem */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Gauge className="size-4 text-muted-foreground" />
                  <Label>Quilometragem</Label>
                </div>
                <Slider
                  value={mileageRange}
                  min={0}
                  max={200000}
                  step={5000}
                  onValueChange={handleMileageChange}
                />
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{formatNumber(mileageRange[0])} km</span>
                  <span>{formatNumber(mileageRange[1])} km</span>
                </div>
              </div>

              <Separator />

              {/* Combustível */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Fuel className="size-4 text-muted-foreground" />
                  <Label htmlFor="fuel">Combustível</Label>
                </div>
                <Select
                  value={filters.fuel || ''}
                  onValueChange={(value) => updateFilter('fuel', value || "")}
                >
                  <SelectTrigger id="fuel">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {fuels.map((fuel) => (
                      <SelectItem key={fuel} value={fuel}>
                        {fuel}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Câmbio */}
              <div className="space-y-2">
                <Label htmlFor="transmission">Câmbio</Label>
                <Select
                  value={filters.transmission || ''}
                  onValueChange={(value) => updateFilter('transmission', value || "")}
                >
                  <SelectTrigger id="transmission">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {transmissions.map((trans) => (
                      <SelectItem key={trans} value={trans}>
                        {trans}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Cor */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Palette className="size-4 text-muted-foreground" />
                  <Label htmlFor="color">Cor</Label>
                </div>
                <Select
                  value={filters.color || ''}
                  onValueChange={(value) => updateFilter('color', value || "")}
                >
                  <SelectTrigger id="color">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {colors.map((color) => (
                      <SelectItem key={color} value={color}>
                        {color}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Portas */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <DoorOpen className="size-4 text-muted-foreground" />
                  <Label htmlFor="doors">Portas</Label>
                </div>
                <Select
                  value={filters.doors.toString() || ''}
                  onValueChange={(value) =>
                    updateFilter('doors', value ? Number(value) : 2)
                  }
                >
                  <SelectTrigger id="doors">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 portas</SelectItem>
                    <SelectItem value="4">4 portas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Final da Placa */}
              <div className="space-y-2">
                <Label htmlFor="finalPlate">Final da Placa</Label>
                <Select
                  value={filters.finalPlate?.toString() || ''}
                  onValueChange={(value) =>
                    updateFilter('finalPlate', value ? Number(value) : 0)
                  }
                >
                  <SelectTrigger id="finalPlate">
                    <SelectValue placeholder="0-9" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 10 }, (_, i) => (
                      <SelectItem key={i} value={i.toString()}>
                        {i}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Condições */}
          <AccordionItem value="conditions" className="border rounded-lg px-3">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <ArrowLeftRight className="size-4 text-primary" />
                <span>Condições</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="acceptsFinancing"
                  checked={filters.acceptsFinancing || false}
                  onCheckedChange={(checked) =>
                    updateFilter('acceptsFinancing', checked === true ? true : undefined)
                  }
                />
                <Label
                  htmlFor="acceptsFinancing"
                  className="text-sm font-normal cursor-pointer"
                >
                  Aceita financiamento
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="acceptsTrade"
                  checked={filters.acceptsTrade || false}
                  onCheckedChange={(checked) =>
                    updateFilter('acceptsTrade', checked === true ? true : undefined)
                  }
                />
                <Label
                  htmlFor="acceptsTrade"
                  className="text-sm font-normal cursor-pointer"
                >
                  Aceita troca
                </Label>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Localização */}
          <AccordionItem value="location" className="border rounded-lg px-3">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <MapPin className="size-4 text-primary" />
                <span>Localização</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="state">Estado</Label>
                <Select
                  value={filters.state || ''}
                  onValueChange={(value) => updateFilter('state', value || "")}
                >
                  <SelectTrigger id="state">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  placeholder="Digite a cidade"
                  value={filters.city || ''}
                  onChange={(e) => updateFilter('city', e.target.value || "")}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Botão de aplicar (fixo na parte inferior) */}
      <div className="sticky bottom-0 bg-card border-t border-border p-4">
        <Button onClick={onApplyFilters} className="w-full">
          Aplicar Filtros
        </Button>
      </div>
    </aside>
  )
}
