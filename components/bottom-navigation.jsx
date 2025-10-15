"use client"

import { Home, ArrowUp, ArrowUpDown, Clock } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "../lib/utils"

const navItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "Send",
    href: "/dashboard/send",
    icon: ArrowUp,
  },
  {
    name: "Swap",
    href: "/dashboard/swap",
    icon: ArrowUpDown,
  },
  {
    name: "History",
    href: "/dashboard/history",
    icon: Clock,
  },
]

export function BottomNavigation() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border">
      <nav className="flex items-center justify-around px-4 py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200",
                "hover:bg-secondary/50 active:scale-95",
                isActive && "relative",
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 transition-colors duration-200",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
              />
              <span
                className={cn(
                  "text-xs font-medium transition-colors duration-200",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
              >
                {item.name}
              </span>
              {isActive && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-0.5 gradient-purple-blue rounded-full animate-glow" ></div>
              )}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
