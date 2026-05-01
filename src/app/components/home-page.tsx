import { useState } from "react"
import { Search, User, Menu, X, Car , ChevronLeft, ChevronRight} from "lucide-react"

const categories = [
  { id: 1, name: "SUV" },
  { id: 2, name: "Sedan" },
  { id: 3, name: "Hatch" },
  { id: 4, name: "Picape" },
  { id: 5, name: "Esportivo" },
  { id: 6, name: "Elétrico" },
]

const products = [
  { id: 1, name: "Nome do Carro", type: "CARDS" },
  { id: 2, name: "Nome do Carro", type: "CARDS" },
  { id: 3, name: "Nome do Carro", type: "CARDS" },
  { id: 4, name: "Nome do Carro", type: "CARDS" },
]

const footerLinks = {
  comprar: { title: "Comprar", links: ["Carros usados", "Carros novos", "Motos usadas", "Motos novas", "Vistoriado"], subTitle: "Vender", subLinks: ["Vender carro", "Vender moto", "Gerenciar meu anúncio", "Plataforma revendedores"] },
  assinar: { title: "Assinar", links: ["Carros por assinatura"], subTitle: "Serviços", subLinks: ["Serviços automotivos", "Tabela FIPE e Tabela Webmotors", "Consórcio", "Catálogo 0km", "Vistoriado", "Seguro veículo", "Webmotors Ads", "Comparar veículos", "Multas e Débitos"] },
  noticias: { title: "Notícias WM1", links: ["Portal", "Últimas notícias", "Testes", "Comparativos", "Vídeos", "Motos", "Segredos", "Dicas", "Bolos"] },
  ajuda: { title: "Ajuda", links: ["Para você", "Para a sua loja", "Segurança", "Quem somos", "Trabalhe com a gente", "Mapa do site"] },
  institucional: { title: "Institucional", links: ["Canal de Denúncias", "Código de conduta Webmotors", "Código de Conduta Fornecedores", "Código defesa do consumidor", "Gerenciamento de cookies", "Termos de Uso e Política de Privacidade", "LGPD", "Cartilha LGPD", "Relatório de Transparência"] },
}

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const itemsPerPage = 4
  const totalPages = Math.ceil(categories.length / itemsPerPage)

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % totalPages)
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages)

  const visibleCategories = categories.slice(
    currentIndex * itemsPerPage,
    currentIndex * itemsPerPage + itemsPerPage
  )

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <a href="/" className="text-xl font-bold text-foreground">MachoCar</a>

          <nav className="hidden items-center gap-6 md:flex">
            <a href="#sobre" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Sobre nós</a>
            <a href="#categorias" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Categorias</a>
            <a href="#produtos" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Produtos</a>
            <a href="#contato" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Fale Conosco</a>
          </nav>

          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <input
                type="text"
                placeholder="Buscar 'SUV 2010'..."
                className="h-9 w-48 rounded-md border border-input bg-background px-3 pr-9 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring lg:w-64"
              />
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
            <button className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent transition-colors">
              <User className="h-5 w-5 text-foreground" />
            </button>
            <button
              className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent transition-colors md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-border bg-background px-4 py-4 md:hidden">
            <nav className="flex flex-col gap-3">
              <a href="#sobre" className="text-sm font-medium text-muted-foreground hover:text-foreground">Sobre nós</a>
              <a href="#categorias" className="text-sm font-medium text-muted-foreground hover:text-foreground">Categorias</a>
              <a href="#produtos" className="text-sm font-medium text-muted-foreground hover:text-foreground">Produtos</a>
              <a href="#contato" className="text-sm font-medium text-muted-foreground hover:text-foreground">Fale Conosco</a>
            </nav>
          </div>
        )}
      </header>
      <main>
        <section className="relative bg-muted">
          <div className="mx-auto max-w-7xl px-4 py-12 md:py-20">
            <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
              <div className="max-w-md text-center md:text-left">
                <h1 className="text-3xl font-bold uppercase leading-tight text-foreground md:text-4xl lg:text-5xl text-balance">
                  A loja para realizar seus sonhos
                </h1>
                <p className="mt-4 text-muted-foreground">
                  Encontre o carro perfeito para você. Qualidade, confiança e os melhores preços do mercado.
                </p>
                <button className="mt-6 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                  Ver Catálogo
                </button>
              </div>

              <div className="flex h-48 w-full max-w-md items-center justify-center rounded-lg border-2 border-dashed border-border bg-background md:h-64 lg:h-80 lg:max-w-lg">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Car className="h-16 w-16" />
                  <span className="text-sm">Imagem do Carro</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="categorias" className="bg-background py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="text-center text-2xl font-bold text-foreground md:text-3xl">
              Procure por categorias
            </h2>

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
                      <h3 className="text-lg font-bold uppercase text-white">{category.name}</h3>
                      <p className="text-xs text-white/80">(link - filtro do catálogo)</p>
                    </div>
                  </a>
                ))}
              </div>

              {totalPages > 1 && (
                <>
                  <button onClick={prevSlide} className="absolute -left-4 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background shadow-lg hover:bg-accent md:flex">
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button onClick={nextSlide} className="absolute -right-4 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background shadow-lg hover:bg-accent md:flex">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>

            <div className="mt-6 flex items-center justify-center gap-2">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 w-2 rounded-full transition-colors ${index === currentIndex ? "bg-foreground" : "bg-border"}`}
                />
              ))}
            </div>
          </div>
        </section>
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
                  className="group overflow-hidden rounded-lg border border-border bg-background transition-shadow hover:shadow-lg"
                >
                  <div className="relative flex h-48 items-center justify-center border-b border-border bg-muted md:h-56">
                    <div className="absolute inset-4 border-2 border-dashed border-border" />
                    <div className="absolute inset-0">
                      <svg className="h-full w-full" preserveAspectRatio="none">
                        <line x1="0" y1="0" x2="100%" y2="100%" stroke="currentColor" className="text-border" strokeWidth="1" />
                        <line x1="100%" y1="0" x2="0" y2="100%" stroke="currentColor" className="text-border" strokeWidth="1" />
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
        <section id="contato" className="bg-foreground py-6">
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <h2 className="text-xl font-bold text-background md:text-2xl">FALE CONOSCO</h2>
              <a href="#about" className="text-sm text-background/80 hover:text-background transition-colors">
                (redirect to about page w/ email)
              </a>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-border bg-background py-10">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5">
            <div>
              <h3 className="text-sm font-bold text-foreground">{footerLinks.comprar.title}</h3>
              <ul className="mt-3 space-y-2">{footerLinks.comprar.links.map((link) => (<li key={link}><a href="#" className="text-xs text-muted-foreground hover:text-foreground">• {link}</a></li>))}</ul>
              <h3 className="mt-4 text-sm font-bold text-foreground">{footerLinks.comprar.subTitle}</h3>
              <ul className="mt-3 space-y-2">{footerLinks.comprar.subLinks.map((link) => (<li key={link}><a href="#" className="text-xs text-muted-foreground hover:text-foreground">• {link}</a></li>))}</ul>
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">{footerLinks.assinar.title}</h3>
              <ul className="mt-3 space-y-2">{footerLinks.assinar.links.map((link) => (<li key={link}><a href="#" className="text-xs text-muted-foreground hover:text-foreground">• {link}</a></li>))}</ul>
              <h3 className="mt-4 text-sm font-bold text-foreground">{footerLinks.assinar.subTitle}</h3>
              <ul className="mt-3 space-y-2">{footerLinks.assinar.subLinks.map((link) => (<li key={link}><a href="#" className="text-xs text-muted-foreground hover:text-foreground">• {link}</a></li>))}</ul>
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">{footerLinks.noticias.title}</h3>
              <ul className="mt-3 space-y-2">{footerLinks.noticias.links.map((link) => (<li key={link}><a href="#" className="text-xs text-muted-foreground hover:text-foreground">• {link}</a></li>))}</ul>
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">{footerLinks.ajuda.title}</h3>
              <ul className="mt-3 space-y-2">{footerLinks.ajuda.links.map((link) => (<li key={link}><a href="#" className="text-xs text-muted-foreground hover:text-foreground">• {link}</a></li>))}</ul>
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">{footerLinks.institucional.title}</h3>
              <ul className="mt-3 space-y-2">{footerLinks.institucional.links.map((link) => (<li key={link}><a href="#" className="text-xs text-muted-foreground hover:text-foreground">• {link}</a></li>))}</ul>
            </div>
          </div>
          <div className="mt-10 border-t border-border pt-6 text-center">
            <p className="text-xs text-muted-foreground">© 2024 MachoCar. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>

  )
}
