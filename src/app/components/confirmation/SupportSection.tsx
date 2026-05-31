import { Headphones, Mail } from 'lucide-react'

export function SupportSection() {
  return (
    <section className="p-6 bg-muted/50 border border-border rounded-lg">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
        <div className="flex items-center gap-4 flex-1">
          <div className="flex items-center justify-center size-10 rounded-full bg-blue-100 text-blue-600 shrink-0">
            <Headphones className="size-5" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Precisa de ajuda?</h3>
            <p className="text-sm text-muted-foreground">
              Nossa equipe esta disponivel para ajudar.
            </p>
          </div>
        </div>
        <a
          href="mailto:suporte@machocar.com.br"
          className="inline-flex items-center justify-center gap-2 rounded-md border border-blue-200 bg-white px-4 py-2.5 text-sm font-medium text-blue-600 transition-all hover:bg-blue-50"
        >
          <Mail className="size-4" />
          Falar com suporte
        </a>
      </div>
    </section>
  )
}
