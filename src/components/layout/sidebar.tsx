"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Bookmark, Globe, Brain, Compass } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/stores/auth-store";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  iconClassName?: string;
  subItems?: { label: string; href: string }[];
}

const navItems: NavItem[] = [
  {
    label: "Home",
    href: "/dashboard",
    icon: Home,
  },
  {
    label: "Watchlist",
    href: "/watchlist",
    icon: Bookmark,
  },
  {
    label: "Markets",
    href: "/markets",
    icon: Globe,
  },
  {
    label: "EquiMind",
    href: "/equimind",
    icon: Brain,
  },
  {
    label: "Discover",
    href: "/discover",
    icon: Compass,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="flex h-screen w-[200px] flex-col border-r bg-[#F0F2F5] shrink-0">
      {/* Logo / Brand */}
      <div className="flex h-12 items-center px-4 shrink-0 border-b border-[#E2E6EA]">
        <span className="text-lg font-bold text-[#1A1D23]">Equibrain</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-2 py-2 overflow-y-auto scrollbar-hide">
        {navItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;

          return (
            <div key={item.label}>
              <Link href={item.href} className="block">
                <Button
                  variant="ghost"
                  className={cn(
                    "relative w-full justify-start gap-3 rounded-md px-3 py-2 text-sm font-medium",
                    active
                      ? "bg-[#EFF6FF] text-[#2563EB] hover:bg-[#EFF6FF] hover:text-[#2563EB]"
                      : "text-[#6B7280] hover:bg-[#E2E6EA] hover:text-[#1A1D23]"
                  )}
                >
                  {/* Left blue border indicator for active item */}
                  {active && (
                    <span className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-[#2563EB]" />
                  )}
                  <Icon
                    className={cn(
                      "h-4 w-4",
                      item.iconClassName
                        ? item.iconClassName
                        : active
                          ? "text-[#2563EB]"
                          : "text-[#6B7280]"
                    )}
                  />
                  {item.label}
                </Button>
              </Link>

              {/* Sub-navigation items */}
              {active && item.subItems && (
                <div className="mt-1 space-y-1">
                  {item.subItems.map((subItem) => (
                    <Link
                      key={subItem.label}
                      href={subItem.href}
                      className={cn(
                        "block py-1.5 pl-[52px] text-sm font-medium transition-colors",
                        "text-[#6B7280] hover:text-[#2563EB]"
                      )}
                    >
                      {subItem.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* User section at bottom */}
      <div className="border-t p-3 shrink-0">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-blue-100 text-blue-700 text-xs font-medium">
              {user?.initials || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-[#1A1D23]">
              {user?.name || "User"}
            </span>
            <span className="text-xs text-[#6B7280]">{user?.email || ""}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
