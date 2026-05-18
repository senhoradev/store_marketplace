import videoHero from "../../videos/carvideo.webm"

export function Hero() {
    return (
        <section className="relative bg-muted overflow-hidden">
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
            >
                <source src={videoHero} type="video/webm" />
            </video>
            {/* Overlay to improve text contrast */}
            <div className="absolute inset-0 bg-black/40"></div>

            <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 md:py-20">
                <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
                    <div className="max-w-md text-center md:text-left">
                        <h1 className="text-3xl text-white font-bold uppercase leading-tight text-foreground md:text-4xl lg:text-5xl text-balance">
                            A loja para realizar seus sonhos
                        </h1>
                        <p className="mt-4 text-white text-muted-foreground">
                            Encontre o carro perfeito para você. Qualidade, confiança e os melhores preços do mercado.
                        </p>
                        <button className="mt-6 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                            Ver Catálogo
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}