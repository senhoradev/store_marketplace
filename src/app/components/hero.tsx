import {Car} from "lucide-react";

export function Hero () {
    return (
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
    )
}