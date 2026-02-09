"use client";

import {
  ArrowUpRight,
  Search,
} from "lucide-react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
} from "recharts";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const PORTFOLIO_DATA = [
  { name: "Jan", value: 2400000 },
  { name: "Feb", value: 2450000 },
  { name: "Mar", value: 2380000 },
  { name: "Apr", value: 2550000 },
  { name: "May", value: 2680000 },
  { name: "Jun", value: 2750000 },
  { name: "Jul", value: 2847350 },
];

const RECENT_ACTIVITY = [
  { time: "10:24 AM", type: "Order Fill", ticker: "AAPL", desc: "Buy order filled at $226.50", status: "success" },
  { time: "09:45 AM", type: "Agent Signal", ticker: "TSLA", desc: "Maverick detected buy signal", status: "signal" },
  { time: "09:12 AM", type: "Alert Triggered", ticker: "META", desc: "Price alert: Above $485", status: "alert" },
  { time: "Yesterday", type: "Order Fill", ticker: "DIST", desc: "Sell order filled at LKR 89.20", status: "success" },
  { time: "Yesterday", type: "Agent Signal", ticker: "JOH", desc: "Volume surge detected by AA", status: "signal" },
];

export default function DashboardPage() {
  return (
    <div className="h-full overflow-auto p-6 space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold">Good morning, Gihan</h1>
        <p className="text-[#6B7280] text-sm">Tuesday, February 3, 2026</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Summary Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Portfolio Value */}
          <Card className="p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[#6B7280]">Portfolio Value</span>
              <div className="flex items-center gap-1 bg-[#DCFCE7] text-[#16A34A] px-2 py-0.5 rounded-full text-[11px] font-bold">
                <ArrowUpRight size={14} /> 2.34%
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-2xl font-bold tabular-nums tracking-tight">LKR 2,847,350.00</p>
              <div className="h-16 w-full -ml-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={PORTFOLIO_DATA}>
                    <defs>
                      <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="value" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#colorVal)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>

          {/* Today's P&L */}
          <Card className="p-5 flex flex-col">
            <span className="text-sm font-medium text-[#6B7280] mb-4">Today&apos;s P&amp;L</span>
            <div className="flex items-center justify-between flex-1">
              <div className="space-y-4">
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#9CA3AF] font-bold uppercase tracking-wider">Total</span>
                  <p className="text-xl font-bold text-[#16A34A] tabular-nums">+LKR 22,800.00</p>
                </div>
                <div className="flex gap-4">
                  <div>
                    <span className="text-[10px] text-[#6B7280] uppercase tracking-wider block">Realized</span>
                    <p className="text-xs font-bold text-[#16A34A]">+LKR 18,200</p>
                  </div>
                  <div className="w-px h-6 bg-[#E2E6EA]" />
                  <div>
                    <span className="text-[10px] text-[#6B7280] uppercase tracking-wider block">Unrealized</span>
                    <p className="text-xs font-bold text-[#16A34A]">+LKR 4,600</p>
                  </div>
                </div>
              </div>
              <div className="w-16 h-16">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={[{ name: "R", value: 18200 }, { name: "U", value: 4600 }]}
                      innerRadius={20}
                      outerRadius={30}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      <Cell fill="#16A34A" />
                      <Cell fill="#4ADE80" />
                    </Pie>
                  </RePieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>

          {/* Active Agents */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-[#6B7280]">Active Agents</span>
              <button className="text-[11px] font-bold text-[#2563EB] hover:underline">View All →</button>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2 overflow-hidden">
                {["MA", "AA", "SL", "DB", "IT", "CC"].map((agent, i) => (
                  <div
                    key={agent}
                    className={cn(
                      "inline-flex h-8 w-8 rounded-full ring-2 ring-white items-center justify-center text-[10px] font-bold text-white relative",
                      i % 3 === 0 ? "bg-[#2563EB]" : i % 3 === 1 ? "bg-[#7C3AED]" : "bg-[#0891B2]"
                    )}
                  >
                    {agent}
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#16A34A] border-2 border-white rounded-full animate-pulse" />
                  </div>
                ))}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold">14 signals today</span>
                <span className="text-[10px] text-[#16A34A] font-bold">Running optimally</span>
              </div>
            </div>
          </Card>

          {/* Market Pulse */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-[#6B7280]">Market Pulse</span>
              <button className="text-[11px] font-bold text-[#2563EB] hover:underline">View All →</button>
            </div>
            <div className="space-y-3">
              {[
                { ticker: "AAPL", price: "228.40", change: "+1.82%", up: true },
                { ticker: "NVDA", price: "142.12", change: "+3.45%", up: true },
                { ticker: "TSLA", price: "214.50", change: "-0.45%", up: false },
              ].map((stock) => (
                <div key={stock.ticker} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded bg-[#F0F2F5] flex items-center justify-center text-[10px] font-bold">{stock.ticker}</span>
                    <div className="w-12 h-6">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={Array.from({ length: 10 }, () => ({ v: Math.random() }))}>
                          <Area type="monotone" dataKey="v" stroke={stock.up ? "#16A34A" : "#DC2626"} fill="transparent" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold tabular-nums">${stock.price}</p>
                    <p className={cn("text-[10px] font-bold", stock.up ? "text-[#16A34A]" : "text-[#DC2626]")}>{stock.change}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick Trade Widget */}
        <Card className="p-6 h-full flex flex-col">
          <h3 className="text-sm font-bold mb-4">Quick Trade</h3>
          <div className="space-y-4 flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" size={16} />
              <Input placeholder="Ticker (e.g. AAPL)" className="h-10 pl-10 bg-[#F0F2F5] border-transparent" />
            </div>
            <div className="flex p-1 bg-[#F0F2F5] rounded-lg">
              <button className="flex-1 py-1.5 text-xs font-bold bg-white text-[#2563EB] rounded shadow-sm">BUY</button>
              <button className="flex-1 py-1.5 text-xs font-bold text-[#6B7280] hover:text-[#1A1D23]">SELL</button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Order Type</label>
                <select className="w-full h-10 bg-[#F0F2F5] rounded-lg px-3 text-sm font-medium outline-none">
                  <option>Market</option>
                  <option>Limit</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Quantity</label>
                <Input type="number" defaultValue={10} className="h-10 bg-[#F0F2F5] border-transparent text-sm font-bold" />
              </div>
            </div>
            <div className="p-4 bg-[#F0F2F5] rounded-xl space-y-2">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-[#6B7280] font-medium">Est. Total</span>
                <span className="font-bold tabular-nums">LKR 125,400.00</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-[#6B7280] font-medium">Available Balance</span>
                <span className="font-bold text-[#2563EB] tabular-nums">LKR 892,100</span>
              </div>
            </div>
            <Button className="w-full h-12 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-xl shadow-lg shadow-[#2563EB]/20">
              Place Order
            </Button>
          </div>
        </Card>
      </div>

      {/* Recent Activity + Watchlist Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h3 className="text-sm font-bold mb-6">Recent Activity Feed</h3>
            <div className="relative space-y-6 pl-4">
              <div className="absolute left-0 top-2 bottom-2 w-px bg-[#E2E6EA]" />
              {RECENT_ACTIVITY.map((item, i) => (
                <div key={i} className="relative">
                  <div
                    className={cn(
                      "absolute -left-[20px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white",
                      item.status === "success" ? "bg-[#16A34A]" : item.status === "signal" ? "bg-[#7C3AED]" : "bg-[#D97706]"
                    )}
                  />
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-[#9CA3AF] font-bold tabular-nums">{item.time}</span>
                      <span
                        className={cn(
                          "px-1.5 py-0.5 rounded text-[9px] font-bold uppercase",
                          item.status === "success"
                            ? "bg-[#DCFCE7] text-[#16A34A]"
                            : item.status === "signal"
                              ? "bg-[#EDE9FE] text-[#7C3AED]"
                              : "bg-[#FEF3C7] text-[#D97706]"
                        )}
                      >
                        {item.type}
                      </span>
                      <span className="px-1.5 py-0.5 bg-[#F0F2F5] text-[#2563EB] text-[9px] font-bold rounded uppercase tracking-wider">
                        {item.ticker}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-[#1A1D23]">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold">Watchlist Preview</h3>
              <button className="text-[11px] font-bold text-[#2563EB] hover:underline">Manage →</button>
            </div>
            <div className="space-y-6">
              {[
                { name: "My Watchlist", count: 8, stocks: [{ t: "AAPL", p: "228.40", c: "+1.82%" }, { t: "GOOGL", p: "178.12", c: "+0.85%" }] },
                { name: "Tech Picks", count: 4, stocks: [{ t: "NVDA", p: "142.12", c: "+3.45%" }, { t: "META", p: "485.20", c: "-1.24%" }] },
              ].map((wl) => (
                <div key={wl.name} className="space-y-3">
                  <p className="text-xs font-bold text-[#1A1D23]">
                    {wl.name} — {wl.count} stocks
                  </p>
                  <div className="space-y-2">
                    {wl.stocks.map((stock) => (
                      <div
                        key={stock.t}
                        className="flex items-center justify-between text-[11px] p-2 hover:bg-[#F9FAFB] rounded-lg transition-colors cursor-pointer border border-transparent hover:border-[#E2E6EA]"
                      >
                        <span className="font-bold">{stock.t}</span>
                        <div className="flex items-center gap-4">
                          <span className="font-bold tabular-nums">${stock.p}</span>
                          <span className={cn("font-bold w-12 text-right", stock.c.startsWith("+") ? "text-[#16A34A]" : "text-[#DC2626]")}>
                            {stock.c}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
