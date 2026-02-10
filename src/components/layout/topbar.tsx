"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search as SearchIcon,
  Bell,
  Clock,
  User,
  LogOut,
  Settings,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";

const recentSearches = [
  "AAPL - Apple Inc.",
  "TSLA - Tesla Inc.",
  "JKH.N0000 - John Keells Holdings",
  "COMB.N0000 - Commercial Bank",
];

const notifications = [
  {
    id: 1,
    ticker: "AAPL",
    time: "2 mins ago",
    message: "Price alert triggered: Above $225.00",
    read: false,
  },
  {
    id: 2,
    ticker: "AAPL",
    time: "2 mins ago",
    message: "Price alert triggered: Above $225.00",
    read: false,
  },
  {
    id: 3,
    ticker: "AAPL",
    time: "2 mins ago",
    message: "Price alert triggered: Above $225.00",
    read: false,
  },
];

import { useUIStore } from "@/stores/ui-store";
import { Menu } from "lucide-react";

// ... inside Topbar component ...
export function Topbar() {
  const router = useRouter();
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, logout } = useAuthStore();
  const { toggleSidebar } = useUIStore();

  // Live clock in Sri Lanka timezone (Asia/Colombo, UTC+5:30)
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Format time in Sri Lanka timezone
  const sriLankaTime = now.toLocaleTimeString("en-US", {
    timeZone: "Asia/Colombo",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  // Determine if CSE market is open (Mon-Fri, 9:30 AM - 2:30 PM Sri Lanka time)
  const sriLankaDate = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Colombo" }));
  const dayOfWeek = sriLankaDate.getDay(); // 0=Sun, 6=Sat
  const hours = sriLankaDate.getHours();
  const minutes = sriLankaDate.getMinutes();
  const totalMinutes = hours * 60 + minutes;
  const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
  const isMarketOpen = isWeekday && totalMinutes >= 570 && totalMinutes < 870; // 9:30=570, 14:30=870

  return (
    <header className="h-12 border-b border-[#E2E6EA] bg-white flex items-center justify-between px-4 z-40 relative shrink-0 gap-4">
      {/* Mobile/Sidebar Toggle */}
      <button onClick={toggleSidebar} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
        <Menu size={20} />
      </button>

      {/* Left: Search bar */}
      <div className="flex-1 max-w-xs sm:max-w-md lg:max-w-xl relative">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search stocks, symbols, news..."
            className="pl-9 h-8 text-sm bg-gray-50 border-gray-200 focus:bg-white w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
          />
        </div>
        {searchFocused && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg py-2 z-50">
            <p className="px-3 py-1 text-xs font-medium text-gray-500 uppercase tracking-wide">
              Recent Searches
            </p>
            {recentSearches.map((item, index) => (
              <button
                key={index}
                className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                onMouseDown={(e) => {
                  e.preventDefault();
                  setSearchQuery(item);
                  setSearchFocused(false);
                }}
              >
                <SearchIcon className="h-3 w-3 text-gray-400" />
                {item}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        {/* Market status indicator */}
        <div className="hidden sm:flex items-center gap-2">
          <div className={cn(
            "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
            isMarketOpen
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          )}>
            <span className={cn(
              "h-1.5 w-1.5 rounded-full",
              isMarketOpen ? "bg-green-500" : "bg-red-500"
            )} />
            <span className="hidden md:inline">CSE Market:</span> {isMarketOpen ? "OPEN" : "CLOSED"}
          </div>
          <div className="hidden md:flex items-center gap-1 text-xs text-gray-500">
            <Clock className="h-3 w-3" />
            <span>{sriLankaTime}</span>
          </div>
        </div>

        {/* Notification bell */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative p-1.5 rounded-md hover:bg-gray-100 transition-colors">
              <Bell className="h-4 w-4 text-gray-600" />
              <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-red-500 text-white text-[10px] font-medium rounded-full flex items-center justify-center">
                3
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="flex items-center justify-between px-3 py-2">
              <DropdownMenuLabel className="p-0 text-sm font-semibold">
                Notifications & Alerts
              </DropdownMenuLabel>
              <button className="text-xs text-blue-600 hover:underline">
                Mark all as read
              </button>
            </div>
            <DropdownMenuSeparator />
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={cn(
                  "flex flex-col items-start gap-1 px-3 py-2.5 cursor-pointer",
                  !notification.read && "bg-blue-50/50"
                )}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-semibold text-gray-900">
                    {notification.ticker}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {notification.time}
                  </span>
                </div>
                <p className="text-xs text-gray-600">{notification.message}</p>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <div className="p-2">
              <Link
                href="/equimind?tab=alerts"
                className="block w-full text-center text-xs font-medium text-blue-600 hover:underline py-1"
              >
                View All Alerts
              </Link>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User profile section */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 hover:bg-gray-50 rounded-md px-2 py-1 transition-colors">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-medium text-gray-900 leading-tight">
                  {user?.name || "User"}
                </p>
                <p className="text-[10px] text-gray-500 leading-tight">
                  {user?.email || ""}
                </p>
              </div>
              <Avatar className="h-7 w-7">
                <AvatarImage src="" alt={user?.name || "User"} />
                <AvatarFallback className="bg-blue-100 text-blue-700 text-xs font-medium">
                  {user?.initials || "U"}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="text-sm">
              My Account
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              Preferences
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-red-600 focus:text-red-600"
              onClick={() => { logout(); router.push("/login"); }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
