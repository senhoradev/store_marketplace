import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const categories = [
  { id: 1, name: "SUV", description: "Espaço e conforto" },
  { id: 2, name: "Sedan", description: "Elegância e economia" },
  { id: 3, name: "Hatch", description: "Compacto e ágil" },
  { id: 4, name: "Picape", description: "Força e versatilidade" },
  { id: 5, name: "Esportivo", description: "Velocidade e estilo" },
  { id: 6, name: "Elétrico", description: "Sustentabilidade" },
]

export function Categories() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const itemsPerPage = 4

  const totalPages = Math.ceil(categories.length / itemsPerPage)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages)
  }

  const visibleCategories = categories.slice(
    currentIndex * itemsPerPage,
    currentIndex * itemsPerPage + itemsPerPage
  )

  // @ts-ignore
  return (
    <section id="categorias" className="bg-background py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-center text-2xl font-bold text-foreground md:text-3xl">
          Procure por categorias
        </h2>

        {/* Categories Grid */}
        <div className="relative mt-8">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {visibleCategories.map((category) => (
              <a
                key={category.id}
                href={`#catalogo?categoria=${category.name.toLowerCase()}`}
                className="group relative flex h-32 flex-col justify-end overflow-hidden rounded-lg bg-foreground p-4 transition-transform hover:scale-105 md:h-40"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20" />
                <div className="relative z-10">
                  <h3 className="text-lg font-bold uppercase text-white">
                    {category.name}
                  </h3>
                  <p className="text-xs text-white/80">
                    (link - filtro do catálogo)
                  </p>
                </div>
              </a>
            ))}
          </div>

          {/* Navigation Arrows */}
          {totalPages > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute -left-4 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background shadow-lg hover:bg-accent md:flex"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute -right-4 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background shadow-lg hover:bg-accent md:flex"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>

        {/* Dots Indicator */}
        <div className="mt-6 flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 w-2 rounded-full transition-colors ${
                index === currentIndex ? "bg-foreground" : "bg-border"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}