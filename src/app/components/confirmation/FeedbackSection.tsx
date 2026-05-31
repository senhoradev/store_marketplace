import { useState } from 'react'
import { CheckCircle2, Send, ThumbsUp } from 'lucide-react'
import { StarRating } from '../StarRating'
import { cn } from '../../services/utils'

interface FeedbackSectionProps {
  title: string
  subtitle: string
  textareaId: string
  textareaPlaceholder: string
  onSubmit?: (rating: number, feedback: string) => void
}

export function FeedbackSection({
  title,
  subtitle,
  textareaId,
  textareaPlaceholder,
  onSubmit,
}: FeedbackSectionProps) {
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    onSubmit?.(rating, feedback)
  }

  return (
    <section className="mb-20">
      <div className="flex items-center gap-3 mb-6">
        <ThumbsUp className="size-5 text-[#871818]" />
        <span className="text-sm font-semibold uppercase tracking-wider text-[#871818]">
          Sua opiniao
        </span>
      </div>

      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
        {title}
      </h2>
      <p className="text-muted-foreground mb-8 max-w-2xl">{subtitle}</p>

      {submitted ? (
        <div className="flex items-center gap-4 p-6 bg-emerald-50 border border-emerald-200 rounded-lg">
          <CheckCircle2 className="size-6 text-emerald-600 shrink-0" />
          <div>
            <p className="font-semibold text-foreground">
              Obrigado pelo feedback!
            </p>
            <p className="text-sm text-muted-foreground">
              Sua avaliacao foi enviada com sucesso.
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="max-w-xl">
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-3">
              Avalie sua experiencia
            </label>
            <StarRating value={rating} onChange={setRating} />
          </div>

          <div className="mb-6">
            <label
              htmlFor={textareaId}
              className="block text-sm font-medium text-foreground mb-2"
            >
              Comentario{' '}
              <span className="text-muted-foreground font-normal">
                (opcional)
              </span>
            </label>
            <textarea
              id={textareaId}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-[#871818] focus:outline-none focus:ring-1 focus:ring-[#871818] transition-all resize-none"
              rows={4}
              placeholder={textareaPlaceholder}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              maxLength={500}
            />
            <div className="mt-2 text-right text-xs text-muted-foreground">
              {feedback.length}/500
            </div>
          </div>

          <button
            type="submit"
            disabled={rating === 0}
            className={cn(
              'inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium transition-all',
              rating === 0
                ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                : 'bg-[#871818] text-white hover:bg-[#6b1010]'
            )}
          >
            <Send className="size-4" />
            Enviar avaliacao
          </button>

          {rating === 0 && (
            <p className="mt-3 text-xs text-muted-foreground">
              Selecione ao menos uma estrela para enviar.
            </p>
          )}
        </form>
      )}
    </section>
  )
}
