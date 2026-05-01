import {Car} from "lucide-react";


const products = [
  { id: 1, name: "Nome do Carro", type: "CARDS" },
  { id: 2, name: "Nome do Carro", type: "CARDS" },
  { id: 3, name: "Nome do Carro", type: "CARDS" },
  { id: 4, name: "Nome do Carro", type: "CARDS" },
]

export function ProductGrid() {
  return (
    <section id="produtos" className="bg-muted py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">NOVIDADES (ANÚNCIOS NOVOS)</h2>
          <p className="mt-1 text-muted-foreground">(ou maiores descontos?)</p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {products.map((product) => (
            <a
              key={product.id}
              href={`#produto/${product.id}`}
              className="group overflow-hidden rounded-lg border border-black bg-background transition-shadow hover:shadow-lg"
            >
              <div className="relative flex h-48 items-center justify-center border-b border-border bg-muted md:h-56">
                <div className="absolute inset-4 border-2 border-dashed border-border" />
                <div className="absolute inset-0">
                  <svg className="h-full w-full" preserveAspectRatio="none">
                    <line x1="0" y1="0" x2="100%" y2="100%" stroke="black" className="text-border" strokeWidth="1" />
                    <line x1="100%" y1="0" x2="0" y2="100%" stroke="black" className="text-border" strokeWidth="1" />
                  </svg>
                </div>
                <Car className="relative z-10 h-12 w-12 text-muted-foreground" />
              </div>

              <div className="flex items-start justify-between p-4">
                <div>
                  <h3 className="font-bold text-foreground uppercase">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">{product.type}</p>
                </div>
                <span className="text-xs text-muted-foreground text-right">
                  (REDIRECT PRA<br />PÁGINA DO<br />PRODUTO)
                </span>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-8 text-center">
          <a
            href="#catalogo"
            className="inline-block rounded-md border border-foreground bg-transparent px-8 py-3 text-sm font-medium text-foreground hover:bg-foreground hover:text-background transition-colors"
          >
            Ver Todos os Veículos
          </a>
        </div>
      </div>
    </section>
  )
}