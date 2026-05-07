export function ContactBanner() {
  return (
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
  )
}
