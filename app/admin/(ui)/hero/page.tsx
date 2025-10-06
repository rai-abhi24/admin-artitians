"use client"

import { Header } from "@/components/header"
import { HeroForm } from "@/components/hero-form"

export default function HeroPage() {
  return (
    <div className="flex flex-col">
      <Header title="Hero Section" description="Manage your landing page hero section" />
      <div className="flex-1 space-y-6 p-6">
        <HeroForm />
      </div>
    </div>
  )
}
