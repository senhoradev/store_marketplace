import { useState, useCallback } from 'react'

interface UseCopyToClipboardOptions {
  timeout?: number
}

export function useCopyToClipboard(options: UseCopyToClipboardOptions = {}) {
  const { timeout = 2500 } = options
  const [copied, setCopied] = useState(false)

  const copy = useCallback(
    (text: string) => {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), timeout)
      })
    },
    [timeout]
  )

  return { copied, copy }
}
