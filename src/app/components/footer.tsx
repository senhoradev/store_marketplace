const footerLinks = {
  comprar: { title: "Comprar", links: ["Carros usados", "Carros novos", "Motos usadas", "Motos novas", "Vistoriado"], subTitle: "Vender", subLinks: ["Vender carro", "Vender moto", "Gerenciar meu anúncio", "Plataforma revendedores"] },
  assinar: { title: "Assinar", links: ["Carros por assinatura"], subTitle: "Serviços", subLinks: ["Serviços automotivos", "Tabela FIPE e Tabela Webmotors", "Consórcio", "Catálogo 0km", "Vistoriado", "Seguro veículo", "Webmotors Ads", "Comparar veículos", "Multas e Débitos"] },
  noticias: { title: "Notícias WM1", links: ["Portal", "Últimas notícias", "Testes", "Comparativos", "Vídeos", "Motos", "Segredos", "Dicas", "Bolos"] },
  ajuda: { title: "Ajuda", links: ["Para você", "Para a sua loja", "Segurança", "Quem somos", "Trabalhe com a gente", "Mapa do site"] },
  institucional: { title: "Institucional", links: ["Canal de Denúncias", "Código de conduta Webmotors", "Código de Conduta Fornecedores", "Código defesa do consumidor", "Gerenciamento de cookies", "Termos de Uso e Política de Privacidade", "LGPD", "Cartilha LGPD", "Relatório de Transparência"] },
}

export function Footer() {
  const currentYear = new Date().getFullYear()
  return (
    <footer className="border-t border-border bg-background py-10">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5">
          <div>
            <h3 className="text-sm font-bold text-foreground">{footerLinks.comprar.title}</h3>
            <ul className="mt-3 space-y-2">{footerLinks.comprar.links.map((link) => (<li key={link}><a href="#" className="text-xs text-muted-foreground hover:text-foreground">{link}</a></li>))}</ul>
            <h3 className="mt-4 text-sm font-bold text-foreground">{footerLinks.comprar.subTitle}</h3>
            <ul className="mt-3 space-y-2">{footerLinks.comprar.subLinks.map((link) => (<li key={link}><a href="#" className="text-xs text-muted-foreground hover:text-foreground">{link}</a></li>))}</ul>
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">{footerLinks.assinar.title}</h3>
            <ul className="mt-3 space-y-2">{footerLinks.assinar.links.map((link) => (<li key={link}><a href="#" className="text-xs text-muted-foreground hover:text-foreground">{link}</a></li>))}</ul>
            <h3 className="mt-4 text-sm font-bold text-foreground">{footerLinks.assinar.subTitle}</h3>
            <ul className="mt-3 space-y-2">{footerLinks.assinar.subLinks.map((link) => (<li key={link}><a href="#" className="text-xs text-muted-foreground hover:text-foreground">{link}</a></li>))}</ul>
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">{footerLinks.noticias.title}</h3>
            <ul className="mt-3 space-y-2">{footerLinks.noticias.links.map((link) => (<li key={link}><a href="#" className="text-xs text-muted-foreground hover:text-foreground">{link}</a></li>))}</ul>
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">{footerLinks.ajuda.title}</h3>
            <ul className="mt-3 space-y-2">{footerLinks.ajuda.links.map((link) => (<li key={link}><a href="#" className="text-xs text-muted-foreground hover:text-foreground">{link}</a></li>))}</ul>
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">{footerLinks.institucional.title}</h3>
            <ul className="mt-3 space-y-2">{footerLinks.institucional.links.map((link) => (<li key={link}><a href="#" className="text-xs text-muted-foreground hover:text-foreground">{link}</a></li>))}</ul>
          </div>
        </div>
        <div className="mt-10 border-t border-border pt-6 text-center">
          <p className="text-xs text-muted-foreground">© {currentYear} MachoCar. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
