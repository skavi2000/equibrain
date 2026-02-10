"use client";

import { useState, useEffect, useRef } from "react";
import {
  TrendingUp,
  Clock,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import * as LightweightCharts from "lightweight-charts";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

export function StockDetailsPanel({
  ticker,
  onClose,
  showHeader = true,
}: {
  ticker: string;
  onClose?: () => void;
  showHeader?: boolean;
}) {
  const [activeMainTab, setActiveMainTab] = useState("Order Book");

  const volumeByPriceData = [
    { price: 53.5, buy: 10000, sell: 5000 },
    { price: 54.1, buy: 2000, sell: 8000 },
    { price: 55.0, buy: 5000, sell: 2000 },
    { price: 55.2, buy: 0, sell: 100000 },
    { price: 55.6, buy: 1000, sell: 15000 },
    { price: 55.8, buy: 20000, sell: 10000 },
    { price: 56.1, buy: 3000, sell: 1000 },
    { price: 56.4, buy: 90000, sell: 10000 },
    { price: 56.7, buy: 1000, sell: 2000 },
    { price: 56.9, buy: 5000, sell: 1000 },
  ];

  const tradeOverviewData = [
    { name: "XL Inflow", value: 0, color: "#16A34A" },
    { name: "L Inflow", value: 19.29, color: "#16A34A" },
    { name: "M Inflow", value: 2.4, color: "#16A34A" },
    { name: "S Inflow", value: 6.36, color: "#16A34A" },
    { name: "XL Outflow", value: 0, color: "#DC2626" },
    { name: "L Outflow", value: 0, color: "#DC2626" },
    { name: "M Outflow", value: 1.66, color: "#DC2626" },
    { name: "S Outflow", value: 15.33, color: "#DC2626" },
  ];

  const volumeByDateData = [
    { date: "Oct 6", buy: 40000, sell: 50000 },
    { date: "Oct 8", buy: 400000, sell: 500000 },
    { date: "Oct 10", buy: 10000, sell: 450000 },
    { date: "Oct 12", buy: 25000, sell: 25000 },
    { date: "Oct 14", buy: 150000, sell: 220000 },
    { date: "Oct 16", buy: 150000, sell: 120000 },
    { date: "Oct 18", buy: 60000, sell: 150000 },
    { date: "Oct 20", buy: 100000, sell: 10000 },
    { date: "Oct 22", buy: 80000, sell: 100000 },
    { date: "Jan 22", buy: 60000, sell: 50000 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex flex-col h-full overflow-hidden bg-card text-foreground"
    >
      {showHeader && (
        <div className="px-4 pt-4 pb-2 border-b border-border shrink-0">
          <div className="flex items-baseline gap-2 mb-1">
            <h2 className="text-2xl font-bold tracking-tight">{ticker}</h2>
            <span className="text-sm text-muted-foreground font-medium truncate">Institutional Analysis Feed</span>
          </div>
          <div className="flex items-center gap-4 mb-2">
            <span className="text-4xl font-bold text-gain tabular-nums tracking-tighter">145.20</span>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <TrendingUp size={16} className="text-gain" />
                <span className="text-gain text-sm font-bold">+2.45</span>
                <span className="text-gain text-sm font-bold">+1.72%</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-muted-foreground font-medium">Market: OPEN</span>
                <span className="bg-primary px-1 rounded-[2px] text-[8px] text-white font-bold uppercase">CSE</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-1 py-3 border-t border-border/50">
            <InfoRow label="High" value="148.50" color="text-gain" />
            <InfoRow label="Low" value="142.00" color="text-loss" />
            <InfoRow label="Open" value="143.10" />
            <InfoRow label="Prev Close" value="142.75" />
            <InfoRow label="Volume" value="2.4M" />
            <InfoRow label="Turnover" value="348.5M" />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between px-4 border-b border-border bg-card/95 backdrop-blur-sm sticky top-0 z-10 shrink-0">
        <div className="flex gap-4">
          {["Order Book", "Sentiment", "Special Patterns", "News"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveMainTab(tab)}
              className={cn(
                "py-3 text-[11px] font-bold transition-all relative whitespace-nowrap cursor-pointer",
                activeMainTab === tab ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {activeMainTab === "Order Book" && (
          <div className="p-4 space-y-4 pb-10">
            <div className="mb-4 rounded-xl overflow-hidden border border-border bg-background relative pt-10 pb-2 px-2 shadow-sm">
              <div className="absolute top-3 left-4 text-[10px] font-bold text-muted-foreground z-10 uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                PRICE (LKR)
              </div>
              <div className="h-[200px] w-full relative">
                <TradingViewWidget />
              </div>
            </div>

            <Card className="p-4 border border-border bg-secondary/10">
              <h3 className="text-sm font-bold mb-3 flex items-center justify-between">
                Tradebook (Today)
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Unit:M</span>
              </h3>
              <div className="flex h-5 rounded-full overflow-hidden mb-3 border border-border/50">
                <div className="bg-gain flex items-center justify-center text-white text-[10px] font-bold" style={{ width: "65%" }}>65%</div>
                <div className="bg-loss flex items-center justify-center text-white text-[10px] font-bold" style={{ width: "35%" }}>35%</div>
              </div>
              <div className="flex items-center justify-center gap-2 text-[11px] font-bold">
                <span className="text-gain">INFLOW: 1.56M</span>
                <span className="text-muted-foreground">|</span>
                <span className="text-loss">OUTFLOW: 0.84M</span>
              </div>
            </Card>

            <Card className="p-4 border border-border bg-secondary/10">
              <h3 className="text-sm font-bold mb-3">Latest 10 trades</h3>
              <div className="space-y-1">
                {[
                  { t: "14:27:15", p: "145.2", q: "10,000", s: "BUY" },
                  { t: "14:26:41", p: "145.2", q: "250", s: "BUY" },
                  { t: "14:24:52", p: "145.1", q: "5,000", s: "SELL" },
                  { t: "14:18:35", p: "145.2", q: "1,200", s: "SELL" },
                ].map((trade, i) => (
                  <div key={i} className="flex items-center justify-between text-[11px] py-2 px-2 bg-card rounded-md border border-border/30">
                    <span className="text-muted-foreground w-16">{trade.t}</span>
                    <span className="font-bold w-12 text-center">{trade.p}</span>
                    <span className="font-bold flex-1 text-center">{trade.q}</span>
                    <span className={cn("font-bold w-10 text-right", trade.s === "BUY" ? "text-gain" : "text-loss")}>{trade.s}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4 border border-border bg-secondary/10">
              <h3 className="text-sm font-bold mb-3">Volume by price</h3>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={volumeByPriceData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                    <XAxis dataKey="price" fontSize={9} tickLine={false} axisLine={false} />
                    <YAxis fontSize={9} tickLine={false} axisLine={false} width={35} />
                    <Bar dataKey="buy" fill="var(--gain)" stackId="a" />
                    <Bar dataKey="sell" fill="var(--loss)" stackId="a" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-5 border border-border bg-card rounded-2xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-foreground">Trade Overview</h3>
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Unit:K</span>
              </div>
              <div className="flex items-center gap-2 mb-8">
                <span className="text-xs font-medium text-muted-foreground">Net Inflow:</span>
                <span className="text-gain text-sm font-bold">11.06</span>
              </div>
              <div className="flex flex-col items-center mb-8">
                <div className="h-44 w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={tradeOverviewData} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={2} dataKey="value" stroke="none">
                        {tradeOverviewData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full space-y-3 mt-6">
                  <TradeBar label="XL" inflow={0.0} outflow={0.0} />
                  <TradeBar label="L" inflow={19.29} outflow={0.0} />
                  <TradeBar label="M" inflow={2.4} outflow={1.66} />
                  <TradeBar label="S" inflow={6.36} outflow={15.33} />
                </div>
              </div>
            </Card>

            <Card className="p-4 border border-border bg-secondary/10">
              <h3 className="text-sm font-bold mb-3">Volume by date</h3>
              <div className="h-[180px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={volumeByDateData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                    <XAxis dataKey="date" fontSize={9} tickLine={false} axisLine={false} />
                    <Bar dataKey="buy" fill="var(--gain)" stackId="a" />
                    <Bar dataKey="sell" fill="var(--loss)" stackId="a" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-4 border border-border bg-secondary/10">
              <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                <ShieldCheck size={16} className="text-primary" />
                Scenario Flags
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((s) => (
                  <div key={s} className="flex flex-col items-center gap-1.5 p-3 bg-card rounded-xl border border-border/50 shadow-sm">
                    <span className="text-[10px] font-bold text-muted-foreground">Scenario {s}</span>
                    <div className={cn("w-5 h-5 rounded-full flex items-center justify-center transition-all shadow-inner", [1, 3, 4, 7, 9].includes(s) ? "bg-gain-bg text-gain" : "bg-secondary text-muted-foreground/30")}>
                      {[1, 3, 4, 7, 9].includes(s) ? <CheckCircle2 size={12} /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>

      <div className="p-3 bg-secondary/20 border-t border-border flex items-center text-[10px] text-muted-foreground shrink-0">
        <div className="flex items-center gap-1">
          <Clock size={10} />
          <span>Feb 3 11:13:05</span>
        </div>
      </div>
    </motion.div>
  );
}

function TradingViewWidget() {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;
    const container = chartContainerRef.current;

    const chart = LightweightCharts.createChart(container, {
      layout: { background: { type: LightweightCharts.ColorType.Solid, color: "transparent" }, textColor: "#6B7280" },
      grid: { vertLines: { visible: false }, horzLines: { color: "#E5E7EB", style: 2 } },
      width: container.clientWidth || 300,
      height: 200,
      handleScroll: false,
      handleScale: false,
      timeScale: { visible: false },
      rightPriceScale: { visible: false },
    });

    const area = chart.addSeries(LightweightCharts.AreaSeries, {
      lineColor: "#16A34A",
      topColor: "rgba(22, 163, 74, 0.15)",
      bottomColor: "rgba(22, 163, 74, 0.0)",
      lineWidth: 2,
    });

    area.setData([
      { time: "2023-01-01", value: 142.75 },
      { time: "2023-01-02", value: 143.12 },
      { time: "2023-01-03", value: 144.08 },
      { time: "2023-01-04", value: 145.15 },
      { time: "2023-01-05", value: 144.1 },
      { time: "2023-01-06", value: 145.02 },
      { time: "2023-01-07", value: 145.18 },
      { time: "2023-01-08", value: 145.04 },
      { time: "2023-01-09", value: 145.2 },
    ]);
    chart.timeScale().fitContent();

    const handleResize = () => chart.applyOptions({ width: container.clientWidth });
    window.addEventListener("resize", handleResize);
    return () => { window.removeEventListener("resize", handleResize); chart.remove(); };
  }, []);

  return <div ref={chartContainerRef} className="w-full h-full" />;
}

function TradeBar({ label, inflow, outflow }: { label: string; inflow: number; outflow: number }) {
  const max = Math.max(inflow, outflow, 20);
  return (
    <div className="flex items-center gap-3 text-[11px] font-bold">
      <span className="w-10 text-right tabular-nums text-foreground/90">{inflow.toFixed(2)}</span>
      <div className="flex-1 flex gap-[2px] h-[6px] bg-secondary rounded-full overflow-hidden">
        <div className="bg-gain h-full rounded-l-full transition-all duration-500" style={{ width: `${(inflow / max) * 50}%`, marginLeft: "auto" }} />
        <div className="bg-loss h-full rounded-r-full transition-all duration-500" style={{ width: `${(outflow / max) * 50}%` }} />
      </div>
      <span className="w-6 text-center text-muted-foreground text-[10px] font-black">{label}</span>
      <span className="w-10 text-left tabular-nums text-foreground/90">{outflow.toFixed(2)}</span>
    </div>
  );
}

function InfoRow({ label, value, color = "text-foreground" }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex items-center justify-between text-[10px]">
      <span className="text-muted-foreground font-medium">{label}</span>
      <span className={cn("font-bold tabular-nums", color)}>{value}</span>
    </div>
  );
}
