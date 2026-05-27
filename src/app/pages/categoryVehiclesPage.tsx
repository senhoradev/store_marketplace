import {useEffect, useState} from "react";
import { Header } from '../components/header'
import { VehicleFiltersSidebar } from '../components/VehicleFiltersSidebar'
import { VehicleCard } from '../components/VehicleCard'
import { vehicleApi } from "../services/api";
import { SlidersHorizontal, Grid3X3, List, ChevronDown } from 'lucide-react'
import { Button } from '../components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../components/ui/select'
import type { VehicleFilters, UserData, Vehicle } from '../services/types'

export function CategoryCarsPage() {
    const initialFilters : VehicleFilters = {
      title: "",
      description: "",
      price: 0,
      brand: "",
      model: "",
      version: "",
      manufactureYear: 0,
      modelYear: 0,
      mileage: 0,
      fuel: "",
      transmission: "",
      bodyType: "",
      color: "",
      doors: 0,
      finalPlate: 0,
      status: "",
      city: "",
      state: "",
      priceMin: 0,
      priceMax: 0,
      mileageMin: 0,
      mileageMax: 0,
      manufactureYearMax: 0,
      manufactureYearMin: 0,
    }

    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [user, setUser] = useState<UserData | null>(null)
    const [filters, setFilters] = useState<VehicleFilters>(initialFilters)
    const [showFilters, setShowFilters] = useState(false)
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [sortBy, setSortBy] = useState('recent')
    const [favorites, setFavorites] = useState<string[]>([])
    const [searching, setSearching] = useState<boolean>(false)

    useEffect(() => {
      vehicleApi.getAllVehicles()
        .then((vehicleResponse) => setVehicles(vehicleResponse.data))
    }, [])

    // Um filtro será aplicado automaticamente sempre que for selecionado.
    useEffect(() => {
      handleApplyFilters()
    }, [filters]);

    const handleApplyFilters = () => {
      const params = converterFiltersToString(filters)
      const urlParams = new URLSearchParams({...params});
      setSearching(true)
      vehicleApi.filterVehicle(urlParams)
        .then(res => {
          setVehicles(res.data)
          setShowFilters(false)
          setSearching(false)
        })
    }

    const handleClearFilters = () => {
      setFilters(initialFilters)
    }

    const handleToggleFavorite = (id: string) => {
      setFavorites((prev) =>
        prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
      )
    }

    const handleVehicleClick = (id: string) => {
      console.log('Navegando para veículo:', id)
    }

    return (
      <div className="min-h-screen bg-background ">
          <Header user={user}/>
        <div className="flex">
          {/* Sidebar de filtros - Desktop */}
          <div className="hidden lg:block">
            <VehicleFiltersSidebar
              filters={filters}
              onFiltersChange={setFilters}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* Sidebar de filtros - Mobile */}
          {showFilters && (
            <>
              <div
                className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                onClick={() => setShowFilters(false)}
              />
              <VehicleFiltersSidebar
                filters={filters}
                onFiltersChange={setFilters}
                onApplyFilters={handleApplyFilters}
                onClearFilters={handleClearFilters}
                isOpen={showFilters}
                onClose={() => setShowFilters(false)}
              />
            </>
          )}

          {/* Conteúdo principal */}
          <main className="flex-1 p-4 lg:p-6">
            {/* Cabeçalho da página */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-foreground mb-2">Veículos</h1>
              <p className="text-muted-foreground">
                {vehicles.length} veículos encontrados
              </p>
            </div>

            {/* Barra de controles */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-border">
              {/* Botão de filtros (mobile) */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(true)}
                className="lg:hidden"
              >
                <SlidersHorizontal className="size-4 mr-2" />
                Filtros
              </Button>

              {/* Ordenação */}
              <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground hidden sm:inline">
                Ordenar por:
              </span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-44">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Mais recentes</SelectItem>
                    <SelectItem value="price-asc">Menor preço</SelectItem>
                    <SelectItem value="price-desc">Maior preço</SelectItem>
                    <SelectItem value="mileage-asc">Menor km</SelectItem>
                    <SelectItem value="year-desc">Ano mais novo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Modo de visualização */}
              <div className="flex items-center gap-1 border border-border rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Grid3X3 className="size-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'list'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <List className="size-4" />
                </button>
              </div>
            </div>

            {/* Filtros ativos */}
            {Object.keys(filters).length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {filters.brand && (
                  <FilterTag
                    label={`Marca: ${filters.brand}`}
                    onRemove={() => setFilters({ ...filters, brand: "" })}
                  />
                )}
                {filters.model && (
                  <FilterTag
                    label={`Modelo: ${filters.model}`}
                    onRemove={() => setFilters({ ...filters, model: "" })}
                  />
                )}
                {filters.bodyType && (
                  <FilterTag
                    label={`Carroceria: ${filters.bodyType}`}
                    onRemove={() => setFilters({ ...filters, bodyType: "" })}
                  />
                )}
                {filters.fuel && (
                  <FilterTag
                    label={`Combustível: ${filters.fuel}`}
                    onRemove={() => setFilters({ ...filters, fuel: "" })}
                  />
                )}
                {filters.transmission && (
                  <FilterTag
                    label={`Câmbio: ${filters.transmission}`}
                    onRemove={() => setFilters({ ...filters, transmission: "" })}
                  />
                )}
                {filters.state && (
                  <FilterTag
                    label={`Estado: ${filters.state}`}
                    onRemove={() => setFilters({ ...filters, state: "" })}
                  />
                )}
                {(filters.priceMin || filters.priceMax) && (
                  <FilterTag
                    label={`Preço: ${filters.priceMin ? `R$ ${filters.priceMin}` : '0'} - ${filters.priceMax ? `R$ ${filters.priceMax}` : '...'}`}
                    onRemove={() =>
                      setFilters({ ...filters, priceMin: 0, priceMax: 0 })
                    }
                  />
                )}
                <button
                  onClick={handleClearFilters}
                  className="text-sm text-primary hover:underline"
                >
                  Limpar todos
                </button>
              </div>
            )}

            {/* Grid de veículos */}
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4'
                  : 'flex flex-col gap-4'
              }
            >
              {searching ? (
                <div>Nenhum carro encontrado com esse filtro</div>
              ) : (
                <>
                  {vehicles.map((vehicle) => (
                    <VehicleCard
                      key={vehicle.id}
                      vehicle={vehicle}
                      onFavorite={handleToggleFavorite}
                      onClick={handleVehicleClick}
                      isFavorite={favorites.includes(vehicle.id)}
                    />
                  ))}
                </>
              ) }
            </div>

            {/* Paginação simples */}
            <div className="flex items-center justify-center gap-2 mt-8 pt-8 border-t border-border">
              <Button variant="outline" disabled>
                Anterior
              </Button>
              <div className="flex items-center gap-1">
                <Button variant="default" size="sm">
                  1
                </Button>
                <Button variant="outline" size="sm">
                  2
                </Button>
                <Button variant="outline" size="sm">
                  3
                </Button>
                <span className="px-2 text-muted-foreground">...</span>
                <Button variant="outline" size="sm">
                  10
                </Button>
              </div>
              <Button variant="outline">Próximo</Button>
            </div>
          </main>
        </div>
      </div>
    );
}

function FilterTag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm">
      {label}
      <button
        onClick={onRemove}
        className="ml-1 hover:text-destructive transition-colors"
      >
        ×
      </button>
    </span>
  )
}

function converterFiltersToString(filters: VehicleFilters) : Record<string, string>  {
  return Object.entries(filters).reduce(
    (acc, [key, value]) => {

      const isEmptyString =
        typeof value === 'string' && value.trim() === '';

      const isZeroNumber =
        typeof value === 'number' && value === 0;

      const isUndefinedOrNull =
        value === undefined || value === null;

      if (
        !isEmptyString &&
        !isZeroNumber &&
        !isUndefinedOrNull
      ) {
        acc[key] = String(value);
      }

      return acc;
    },
    {} as Record<string, string>
  );
}