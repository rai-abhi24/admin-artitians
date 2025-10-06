"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    Mail,
    ImageIcon,
    Video,
    Users,
    Settings,
    LogOut,
    UserCheck,
    Package2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Enquiries", href: "/admin/enquiries", icon: Mail },
    { name: "Hero Section", href: "/admin/hero", icon: ImageIcon },
    { name: "Testimonials", href: "/admin/testimonials", icon: Video },
    { name: "Partners", href: "/admin/partners", icon: UserCheck },
    { name: "Modules", href: "/admin/modules", icon: Package2 },
    { name: "Admin Users", href: "/admin/users", icon: Users },
    { name: "Settings", href: "/admin/settings", icon: Settings },
]

export default function AppSidebar({ onLogout }: { onLogout: () => void }) {
    const pathname = usePathname()

    return (
        <div className="hidden md:flex h-full w-64 flex-col border-r border-border bg-card">
            <div className="flex h-20 items-center border-b border-border px-6">
                <Image src="/dark-logo.webp" alt="CGPEY" className="mx-auto" width={160} height={100} priority />
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto p-4">
                {navigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg p-3 mb-4 text-md font-medium transition-colors",
                                isActive
                                    ? "bg-primary text-primary-foreground"
                                    : "hover:bg-accent hover:text-accent-foreground",
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.name}
                        </Link>
                    )
                })}
            </nav>

            <div className="border-t border-border p-4">
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
                    onClick={onLogout}
                >
                    <LogOut className="h-5 w-5" />
                    Logout
                </Button>
            </div>
        </div>
    )
}
