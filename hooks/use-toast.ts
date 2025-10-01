import * as React from "react"
import { toast as sonner } from "sonner"

type ToastOptions = {
  title?: React.ReactNode
  description?: React.ReactNode
  variant?: "default" | "destructive"
}

function toast(opts: ToastOptions) {
  const { title, description, variant } = opts
  const message = title || description || ""
  return sonner(String(message), {
    description: title ? (description as any) : undefined,
    className: variant === "destructive" ? "bg-red-50 text-red-900" : undefined,
  })
}

function useToast() {
  return React.useMemo(() => ({ toast, dismiss: (_?: string) => {} }), [])
}

export { useToast, toast }
