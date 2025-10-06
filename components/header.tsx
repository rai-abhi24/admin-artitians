"use client"

import { MobileSidebar } from "./mobile-sidebar"

interface HeaderProps {
  title: string
  description?: string
}

export function Header({ title, description }: HeaderProps) {
  const { data: session } = { data: { user: { name: "Abhishek Rai", email: "abhishek.rai@example.com" } } } as { data: { user: { name: string; email: string } } | null }

  return (
    <header className="sticky top-0 z-10 flex h-20 items-center gap-4 border-b border-border bg-background px-6">
      <MobileSidebar />
      <div className="flex-1">
        <h1 className="text-xl font-semibold">{title}</h1>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden text-right text-sm md:block">
          <p className="font-medium">{session?.user?.name}</p>
          <p className="text-xs text-muted-foreground">{session?.user?.email}</p>
        </div>
      </div>
    </header>
  )
}
