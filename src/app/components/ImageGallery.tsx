import { useState } from 'react'
import { ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react'
import { cn } from './ui/utils'

interface ImageGalleryProps {
  images: string[]
  alt: string
}

export function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const hasImages = images && images.length > 0

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  if (!hasImages) {
    return (
      <div className="relative w-full overflow-hidden rounded-xl border border-border bg-muted">
        <div className="aspect-[16/10] flex flex-col items-center justify-center gap-3 text-muted-foreground">
          <ImageIcon className="size-12" />
          <p className="text-sm">Nenhuma imagem disponível</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="relative w-full overflow-hidden rounded-xl border border-border bg-muted group">
        <div className="aspect-[16/10] relative">
          <img
            src={images[currentIndex]}
            alt={`${alt} - Imagem ${currentIndex + 1}`}
            className="absolute inset-0 w-full h-full object-cover"
          />
          
          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-3 top-1/2 -translate-y-1/2 size-10 rounded-full bg-card/90 shadow-md flex items-center justify-center text-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:bg-card"
                aria-label="Imagem anterior"
              >
                <ChevronLeft className="size-6" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 size-10 rounded-full bg-card/90 shadow-md flex items-center justify-center text-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:bg-card"
                aria-label="Próxima imagem"
              >
                <ChevronRight className="size-6" />
              </button>
            </>
          )}

          {/* Image Counter */}
          <div className="absolute bottom-3 right-3 bg-foreground/80 text-background px-3 py-1 rounded-full text-sm font-medium">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                'relative shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all',
                currentIndex === index
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'border-border hover:border-muted-foreground/50'
              )}
            >
              <img
                src={image}
                alt={`${alt} - Miniatura ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
