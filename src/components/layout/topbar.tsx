"use client";

import { useState } from "react";
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

export function Topbar() {
  const router = useRouter();
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="h-12 border-b border-[#E2E6EA] bg-white flex items-center justify-between px-6 z-50 relative shrink-0">
      {/* Left: Search bar */}
      <div className="flex-1 max-w-md relative">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search stocks, symbols, news..."
            className="pl-9 h-8 text-sm bg-gray-50 border-gray-200 focus:bg-white"
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
      <div className="flex items-center gap-4 shrink-0">
        {/* Market status indicator */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-green-50 text-green-700 px-2.5 py-1 rounded-full text-xs font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            CSE Market: OPEN
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="h-3 w-3" />
            <span>14:32</span>
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
                  Gihan D.
                </p>
                <p className="text-[10px] text-gray-500 leading-tight">
                  LKR 2,847,350.00
                </p>
              </div>
              <Avatar className="h-7 w-7">
                <AvatarImage src="" alt="Gihan D." />
                <AvatarFallback className="bg-blue-100 text-blue-700 text-xs font-medium">
                  GD
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
              onClick={() => router.push("/login")}
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
