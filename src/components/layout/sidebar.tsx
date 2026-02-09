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

import { useUIStore } from "@/stores/ui-store";
import { Menu, X } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet"; // Assuming you have shadcn sheet or just using conditional rendering for mobile

// ... inside Sidebar component ...

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { isSidebarOpen, toggleSidebar } = useUIStore();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  // Mobile drawer logic would act differently, but for now let's focus on the desktop collapse requested via "side menu bar".
  // We'll standardise: Mobile = hidden by default, toggled via hamburger. Desktop = Collapsible.

  return (
    <>
      {/* Mobile Overlay/Drawer could go here if using Sheet, but sticking to basic CSS transitions for "swift" implementation */}

      <aside
        className={cn(
          "flex flex-col border-r bg-[#F0F2F5] shrink-0 transition-all duration-300 ease-in-out h-screen fixed md:relative z-50",
          isSidebarOpen ? "w-[200px] translate-x-0" : "w-0 md:w-[70px] -translate-x-full md:translate-x-0"
        )}
      >
        {/* Logo / Brand */}
        <div className={cn("flex h-12 items-center shrink-0 border-b border-[#E2E6EA] overflow-hidden whitespace-nowrap", isSidebarOpen ? "px-4" : "justify-center px-0")}>
          {isSidebarOpen ? (
            <span className="text-lg font-bold text-[#1A1D23]">Equibrain</span>
          ) : (
            <span className="text-lg font-bold text-[#1A1D23]">EB</span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-2 py-2 overflow-y-auto scrollbar-hide overflow-x-hidden">
          {navItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;

            return (
              <div key={item.label}>
                <Link href={item.href} className="block">
                  <Button
                    variant="ghost"
                    className={cn(
                      "relative w-full justify-start gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all",
                      active
                        ? "bg-[#EFF6FF] text-[#2563EB] hover:bg-[#EFF6FF] hover:text-[#2563EB]"
                        : "text-[#6B7280] hover:bg-[#E2E6EA] hover:text-[#1A1D23]",
                      !isSidebarOpen && "justify-center px-0"
                    )}
                    title={!isSidebarOpen ? item.label : undefined}
                  >
                    {/* Left blue border indicator for active item */}
                    {active && (
                      <span className={cn("absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-[#2563EB]", !isSidebarOpen && "left-0")} />
                    )}
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0",
                        item.iconClassName
                          ? item.iconClassName
                          : active
                            ? "text-[#2563EB]"
                            : "text-[#6B7280]"
                      )}
                    />
                    {isSidebarOpen && <span className="truncate">{item.label}</span>}
                  </Button>
                </Link>

                {/* Sub-navigation items - Only show when expanded */}
                {active && item.subItems && isSidebarOpen && (
                  <div className="mt-1 space-y-1">
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.label}
                        href={subItem.href}
                        className={cn(
                          "block py-1.5 pl-[52px] text-sm font-medium transition-colors truncate",
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
        <div className="border-t p-3 shrink-0 overflow-hidden">
          <div className={cn("flex items-center gap-3", !isSidebarOpen && "justify-center")}>
            <Avatar className="h-9 w-9 shrink-0">
              <AvatarFallback className="bg-blue-100 text-blue-700 text-xs font-medium">
                {user?.initials || "U"}
              </AvatarFallback>
            </Avatar>
            {isSidebarOpen && (
              <div className="flex flex-col truncate">
                <span className="text-sm font-medium text-[#1A1D23] truncate">
                  {user?.name || "User"}
                </span>
                <span className="text-xs text-[#6B7280] truncate">{user?.email || ""}</span>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Overlay for mobile when open */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity",
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={toggleSidebar}
      />
    </>
  );
}
