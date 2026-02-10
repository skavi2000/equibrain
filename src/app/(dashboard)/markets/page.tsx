"use client";

import { Suspense, useState, useEffect } from "react";
import {
  Target,
  Search,
  ChevronRight,
  ArrowUpRight,
  Info,
  Activity,
  Globe,
  BarChart3,
  Sparkles,
  Wrench,
} from "lucide-react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { StockDetailsPanel } from "@/components/shared/stock-details-panel";

export default function MarketsPage() {
  return (
    <Suspense fallback={<div className="h-full flex items-center justify-center"><span className="text-sm text-[#9CA3AF]">Loading...</span></div>}>
      <MarketsContent />
    </Suspense>
  );
}

function MarketsContent() {
  const searchParams = useSearchParams();
  const sub = searchParams.get("tab");
  const [activeMainTab, setActiveMainTab] = useState("Overview");
  const [activeSubTab, setActiveSubTab] = useState("Home Page");
  const [selectedStock, setSelectedStock] = useState<string | null>("AEL.N0000");
  const [selectedInstitution, setSelectedInstitution] = useState<string | null>(null);

  useEffect(() => {
    if (sub === "Overview" || sub === "CSE" || sub === "HK") {
      setActiveMainTab(sub);
    }
  }, [sub]);

  const mainTabs = ["Overview", "CSE", "HK"];
  const subTabs = ["Home Page", "Institutional Tracker"];

  if (selectedInstitution && activeSubTab === "Institutional Tracker") {
    return <InstitutionDetail institution={selectedInstitution} onBack={() => setSelectedInstitution(null)} />;
  }

  return (
    <div className="h-full flex bg-[#FAFBFC] overflow-hidden">
      <div className="flex-1 flex flex-col min-w-0 border-r border-[#E2E6EA]">
        <div className="h-10 bg-white border-b border-[#E2E6EA] flex items-center px-4 shrink-0 gap-6">
          {mainTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveMainTab(tab)}
              className={cn(
                "h-full px-2 text-[13px] font-bold transition-all relative cursor-pointer",
                activeMainTab === tab ? "text-[#2563EB]" : "text-[#6B7280] hover:text-[#1A1D23]"
              )}
            >
              {tab}
              {activeMainTab === tab && <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#2563EB] rounded-t-full" />}
            </button>
          ))}
        </div>

        {activeMainTab === "CSE" && (
          <div className="h-9 bg-white border-b border-[#E2E6EA] px-6 flex items-center shrink-0">
            <div className="flex gap-6 overflow-x-auto scrollbar-hide h-full items-center">
              {subTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveSubTab(tab)}
                  className={cn(
                    "h-full text-[11px] font-bold transition-all whitespace-nowrap relative cursor-pointer",
                    activeSubTab === tab ? "text-[#2563EB]" : "text-[#6B7280] hover:text-[#1A1D23]"
                  )}
                >
                  {tab}
                  {activeSubTab === tab && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#2563EB]" />}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex-1 overflow-auto bg-[#F7F8FA] scrollbar-hide">
          {activeMainTab === "Overview" ? (
            <MarketUnderDevelopment
              icon={<Globe size={40} strokeWidth={1.5} />}
              title="Market Overview"
              description="A unified cross-market dashboard aggregating real-time indices, sector rotations, global heat maps, and macro sentiment indicators — all in one view."
              color="#2563EB"
              bgColor="#EFF6FF"
            />
          ) : activeMainTab === "HK" ? (
            <MarketUnderDevelopment
              icon={<BarChart3 size={40} strokeWidth={1.5} />}
              title="Hong Kong Market"
              description="Live HKEX market data, Hang Seng Index tracking, institutional flow analysis, and cross-listed securities monitoring — currently being integrated."
              color="#DC2626"
              bgColor="#FEF2F2"
            />
          ) : (
            <>
              {activeSubTab === "Home Page" ? (
                <div className="p-4 space-y-4 max-w-[1440px] mx-auto">
                  <MarketsOverview onStockClick={setSelectedStock} />
                </div>
              ) : (
                <div className="p-4">
                  <InstitutionalTracker onSelect={setSelectedInstitution} />
                </div>
              )}
            </>
          )}
        </div>

        <div className="h-9 bg-white border-t border-[#E2E6EA] flex items-center px-6 overflow-hidden shrink-0">
          <div className="flex items-center gap-2 mr-8">
            <span className="w-2 h-2 bg-[#16A34A] rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-[#16A34A] uppercase">Market Open</span>
          </div>
          <div className="flex items-center gap-12 whitespace-nowrap">
            {[
              { n: "Dow Jones", v: "39,892.47", c: "+123.45", up: true },
              { n: "NASDAQ", v: "17,695.65", c: "+210.12", up: true },
              { n: "S&P 500", v: "6,935.33", c: "+47.89", up: true },
              { n: "CSE ALL", v: "12,461.82", c: "-34.56", up: false },
              { n: "FTSE 100", v: "8,245.12", c: "+12.45", up: true },
              { n: "NIKKEI 225", v: "38,124.50", c: "-145.20", up: false },
            ].map((idx, i) => (
              <div key={i} className="flex items-center gap-2 text-[10px] font-bold">
                <span className="text-[#1A1D23]">{idx.n}</span>
                <span className="tabular-nums">{idx.v}</span>
                <span className={idx.up ? "text-[#16A34A]" : "text-[#DC2626]"}>
                  {idx.up ? "▲" : "▼"} {idx.c}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <aside className="w-[360px] flex flex-col shrink-0 bg-white">
        {selectedStock ? (
          <StockDetailsPanel ticker={selectedStock} onClose={() => setSelectedStock(null)} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#F9FAFB]">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-[#E2E6EA] flex items-center justify-center mb-6">
              <Activity size={32} className="text-[#9CA3AF]" />
            </div>
            <h3 className="font-bold text-[#1A1D23] mb-2">No Stock Selected</h3>
            <p className="text-sm text-[#6B7280]">Select a symbol from the market list to view detailed analysis.</p>
          </div>
        )}
      </aside>
    </div>
  );
}

function MarketsOverview({ onStockClick }: { onStockClick: (t: string) => void }) {
  const [drillDown, setDrillDown] = useState<{ type: "Industry" | "Stock"; category: string } | null>(null);

  if (drillDown) {
    return (
      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-[#E2E6EA] shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => setDrillDown(null)} className="p-1.5 hover:bg-[#F0F2F5] rounded-full transition-colors cursor-pointer group">
              <ChevronRight size={18} className="rotate-180 text-[#6B7280] group-hover:text-[#2563EB]" />
            </button>
            <div>
              <h3 className="text-sm font-bold text-[#1A1D23]">{drillDown.category}</h3>
              <p className="text-[10px] text-[#9CA3AF] font-bold uppercase tracking-widest">{drillDown.type} Performance</p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded">+1.42% avg</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="p-4 hover:shadow-md transition-all cursor-pointer border-[#E2E6EA] group" onClick={() => onStockClick(`SYM${i}`)}>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-black text-sm text-[#1A1D23] group-hover:text-[#2563EB] transition-colors">SYM{i}</h4>
                  <p className="text-[10px] text-[#6B7280] truncate w-24">Company {i} Inc</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold tabular-nums">145.20</p>
                  <p className="text-[10px] font-bold text-[#16A34A]">+2.45%</p>
                </div>
              </div>
              <div className="h-10 w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={Array.from({ length: 10 }, () => ({ v: 50 + Math.random() * 50 }))}>
                    <Area type="monotone" dataKey="v" stroke="#16A34A" strokeWidth={1.5} fill="transparent" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        {[
          { n: "DOW JONES INDUSTRIAL", v: "48,892.47", c: "-179.09", p: "-0.36%", up: false },
          { n: "NASDAQ COMPOSITE INDEX", v: "23,461.82", c: "-223.30", p: "-0.94%", up: false },
          { n: "S&P 500 INDEX", v: "6,939.03", c: "-29.98", p: "-0.43%", up: false },
        ].map((idx) => (
          <Card key={idx.n} className="p-4 flex flex-col justify-between h-32 hover:shadow-md transition-shadow cursor-pointer bg-white border-[#E2E6EA]">
            <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">{idx.n}</p>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xl font-bold tabular-nums tracking-tighter mb-0.5 text-[#1A1D23]">{idx.v}</p>
                <div className="flex items-center gap-1.5">
                  <span className={cn("text-[10px] font-bold", idx.up ? "text-[#16A34A]" : "text-[#DC2626]")}>{idx.c}</span>
                  <span className={cn("text-[10px] font-bold px-1 py-0.5 rounded", idx.up ? "bg-[#DCFCE7] text-[#16A34A]" : "bg-[#FEE2E2] text-[#DC2626]")}>{idx.p}</span>
                </div>
              </div>
              <div className="w-20 h-10">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={Array.from({ length: 12 }, () => ({ v: 50 + Math.random() * 20 }))}>
                    <Area type="monotone" dataKey="v" stroke={idx.up ? "#16A34A" : "#DC2626"} strokeWidth={1.5} fill="transparent" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-4">
          <MarketsTable title="Top Gainers" type="gain" onStockClick={onStockClick} />
          <MarketsTable title="Heat List" type="loss" onStockClick={onStockClick} />
        </div>
        <div className="space-y-4">
          <MarketsTable title="Top Losers" type="loss" onStockClick={onStockClick} />
          <HighDividendsTable onStockClick={onStockClick} />
        </div>
        <div className="space-y-4">
          <HeatMapCard onSelectCategory={(category, type) => setDrillDown({ category, type })} />
          <NewsHighlightsCard />
        </div>
      </div>
    </div>
  );
}

function HeatMapCard({ onSelectCategory }: { onSelectCategory: (cat: string, type: "Industry" | "Stock") => void }) {
  const [mode, setMode] = useState<"Industry" | "Stock">("Industry");
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold text-[#1A1D23]">Heat Map</h3>
        <div className="flex bg-[#F0F2F5] p-1 rounded-lg">
          <button onClick={() => setMode("Industry")} className={cn("px-3 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer", mode === "Industry" ? "bg-white text-[#2563EB] shadow-sm" : "text-[#6B7280]")}>Industry</button>
          <button onClick={() => setMode("Stock")} className={cn("px-3 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer", mode === "Stock" ? "bg-white text-[#2563EB] shadow-sm" : "text-[#6B7280]")}>Stock</button>
        </div>
      </div>
      {mode === "Industry" ? (
        <div className="grid grid-cols-2 grid-rows-2 h-[260px] gap-1.5 rounded-xl overflow-hidden">
          <HeatBlock name="Internet Content" change="-0.68%" color="bg-[#7F1D1D]" onClick={() => onSelectCategory("Internet Content", "Industry")} />
          <HeatBlock name="Semiconductors" change="-1.62%" color="bg-[#450A0A]" onClick={() => onSelectCategory("Semiconductors", "Industry")} />
          <HeatBlock name="Software - Infra" change="-1.26%" color="bg-[#991B1B]" onClick={() => onSelectCategory("Software - Infra", "Industry")} />
          <div className="grid grid-cols-2 gap-1.5">
            <HeatBlock name="Consumer" change="+0.42%" color="bg-[#14532D]" onClick={() => onSelectCategory("Consumer", "Industry")} />
            <HeatBlock name="Healthcare" change="+0.84%" color="bg-[#166534]" onClick={() => onSelectCategory("Healthcare", "Industry")} />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-3 grid-rows-3 h-[260px] gap-1 rounded-lg overflow-hidden">
          {["AAPL", "MSFT", "NVDA", "GOOGL", "AMZN", "META", "TSLA", "BRK.B", "LLY"].map((s, i) => (
            <div key={s} onClick={() => onSelectCategory(s, "Stock")} className={cn("flex flex-col items-center justify-center p-1 text-white cursor-pointer hover:opacity-80 transition-opacity", i % 3 === 0 ? "bg-[#7F1D1D]" : i % 3 === 1 ? "bg-[#14532D]" : "bg-[#450A0A]")}>
              <span className="text-[10px] font-black">{s}</span>
              <span className="text-[8px] font-bold opacity-80">{(Math.random() * 4 - 2).toFixed(2)}%</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function HeatBlock({ name, change, size = "", color, onClick }: { name: string; change: string; size?: string; color: string; onClick?: () => void }) {
  return (
    <div onClick={onClick} className={cn("flex flex-col items-center justify-center p-3 text-white text-center transition-all hover:scale-[0.98] cursor-pointer shadow-sm active:scale-95", size, color)}>
      <span className="text-[11px] font-black leading-tight mb-1">{name}</span>
      <span className="text-[10px] font-bold opacity-80">{change}</span>
    </div>
  );
}

function HighDividendsTable({ onStockClick }: { onStockClick: (t: string) => void }) {
  return (
    <Card className="p-4">
      <h3 className="text-xs font-bold mb-4 text-[#1A1D23]">High Dividends</h3>
      <table className="w-full text-[10px]">
        <thead>
          <tr className="text-[#9CA3AF] border-b border-[#F0F2F5]">
            <th className="text-left pb-2 font-bold uppercase tracking-wider">Ticker</th>
            <th className="text-left pb-2 font-bold uppercase tracking-wider">Price</th>
            <th className="text-right pb-2 font-bold uppercase tracking-wider">Yield%</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#F0F2F5]">
          {[
            { t: "ACL.N0000", n: "Aitken Spence", p: "145.20", y: "6.24%" },
            { t: "AEL.N0000", n: "Distilleries", p: "89.50", y: "5.82%" },
            { t: "HARI.N0000", n: "Brooks", p: "42.10", y: "5.10%" },
            { t: "COMB.N0000", n: "Hapugastenne", p: "32.40", y: "4.85%" },
            { t: "RHL.N0000", n: "Sampath Bank", p: "78.20", y: "4.62%" },
          ].map((row) => (
            <tr key={row.t} className="hover:bg-[#F9FAFB] transition-colors cursor-pointer group" onClick={() => onStockClick(row.t)}>
              <td className="py-2.5">
                <span className="font-bold text-[#1A1D23] group-hover:text-[#2563EB] transition-colors">{row.t}</span>
                <p className="text-[9px] text-[#6B7280]">{row.n}</p>
              </td>
              <td className="py-2.5 font-bold tabular-nums text-[#1A1D23]">{row.p}</td>
              <td className="py-2.5 text-right">
                <span className="bg-[#FEF3C7] text-[#D97706] px-1.5 py-0.5 rounded font-bold">{row.y}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

function NewsHighlightsCard() {
  return (
    <Card className="p-4">
      <h3 className="text-xs font-bold mb-4 text-[#1A1D23]">News Highlights</h3>
      <div className="space-y-4">
        {[
          { s: "Bloomberg", t: "2h ago", h: "CSE expands trading hours starting next Monday" },
          { s: "Reuters", t: "4h ago", h: "Global tech stocks rally on strong AI chips demand" },
          { s: "MarketEye", t: "6h ago", h: "John Keells announces new strategic logistics hub" },
        ].map((n, i) => (
          <div key={i} className="space-y-1.5 group cursor-pointer">
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 bg-[#F0F2F5] rounded text-[8px] font-bold text-[#6B7280] uppercase tracking-wider">{n.s}</span>
              <span className="text-[9px] text-[#9CA3AF] font-medium">{n.t}</span>
            </div>
            <p className="text-[11px] font-bold leading-relaxed text-[#1A1D23] group-hover:text-[#2563EB] transition-colors line-clamp-2">{n.h}</p>
            <button className="text-[9px] font-bold text-[#2563EB] hover:underline flex items-center gap-1">
              read more <ArrowUpRight size={8} />
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
}

function MarketsTable({ title, type, onStockClick }: { title: string; type: "gain" | "loss"; onStockClick: (t: string) => void }) {
  const isGain = type === "gain";
  const color = isGain ? "text-[#16A34A]" : "text-[#DC2626]";
  const bgColor = isGain ? "bg-[#DCFCE7]" : "bg-[#FEE2E2]";

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold text-[#1A1D23]">{title}</h3>
        <button className="px-2 py-0.5 text-[9px] font-bold bg-[#F0F2F5] text-[#6B7280] rounded hover:bg-[#E2E6EA] transition-colors">Regular Hours</button>
      </div>
      <table className="w-full text-[10px]">
        <thead>
          <tr className="text-[#9CA3AF] border-b border-[#F0F2F5]">
            <th className="text-left pb-2 font-bold uppercase tracking-wider">Ticker</th>
            <th className="text-right pb-2 font-bold uppercase tracking-wider">Price</th>
            <th className="text-right pb-2 font-bold uppercase tracking-wider">Change%</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#F0F2F5]">
          {[...Array(5)].map((_, i) => (
            <tr key={i} className="hover:bg-[#F9FAFB] transition-colors cursor-pointer group" onClick={() => onStockClick(`SYM${i}`)}>
              <td className="py-2.5">
                <span className="font-bold text-[#1A1D23] group-hover:text-[#2563EB] transition-colors">SYM{i}</span>
                <p className="text-[9px] text-[#6B7280]">Company {i}</p>
              </td>
              <td className="py-2.5 text-right font-bold tabular-nums text-[#1A1D23]">1,245.00</td>
              <td className="py-2.5 text-right">
                <span className={cn("px-1.5 py-0.5 rounded font-bold inline-block min-w-[45px] text-center", color, bgColor)}>
                  {isGain ? "+" : "-"}
                  {(2.45 - i * 0.2).toFixed(2)}%
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

function InstitutionalTracker({ onSelect }: { onSelect: (id: string) => void }) {
  const institutions = [
    { id: "VG", n: "The Vanguard", mv: "7.3T", top: "NVDA 9.15%", inc: "BBT +9.71M" },
    { id: "BR", n: "BlackRock", mv: "6.38T", top: "NVDA 7.92%", inc: "MDIA +35.26M" },
    { id: "SS", n: "State Street Global Advisors", mv: "3.07T", top: "NVDA 4.03%", inc: "TTD +26.56M" },
    { id: "CR", n: "Capital Research", mv: "2.19T", top: "AVGO 7.89%", inc: "TRS +2.89M" },
    { id: "FMR", n: "FMR", mv: "1.77T", top: "NVDA 3.71%", inc: "IHG +32.19M" },
    { id: "GC", n: "Geode Capital Management, LLC", mv: "1.7T", top: "NVDA 2.41%", inc: "BBT +1.94M" },
    { id: "TR", n: "T. Rowe Price Group, Inc.", mv: "1.16T", top: "NVDA 1.76%", inc: "KPTI +1.60M" },
    { id: "NB", n: "Norges Bank Investment Management", mv: "1.11T", top: "NVDA 1.34%", inc: "UPB +1.91M" },
    { id: "UBS", n: "UBS Asset Management", mv: "1.02T", top: "NVDA 1.17%", inc: "ABVX +7.69M" },
    { id: "JP", n: "J.P. Morgan Asset Management, Inc.", mv: "963.48B", top: "NVDA 1.39%", inc: "HIMS +12.43M" },
    { id: "NT", n: "Northern Trust Global Investments", mv: "750.92B", top: "NVDA 1.07%", inc: "OSBC +583.49K" },
    { id: "MS", n: "Morgan Stanley", mv: "656.9B", top: "GOOGL 0.85%", inc: "LNTH +3.22M" },
  ];

  return (
    <div className="flex gap-4 max-w-[1440px] mx-auto overflow-hidden">
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between border-b border-[#E2E6EA] pb-3">
          <h2 className="text-sm font-black text-[#1A1D23] uppercase tracking-wider">Top Institutions</h2>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-[#6B7280]">Sort by:</span>
            <select className="text-[10px] font-bold bg-white border border-[#E2E6EA] rounded px-2 py-1 outline-none">
              <option>Market Value</option>
              <option>Performance</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 h-[calc(100vh-180px)] overflow-y-auto scrollbar-hide pb-10 pr-2">
          {institutions.map((inst) => (
            <Card key={inst.id} onClick={() => onSelect(inst.n)} className="p-3 cursor-pointer hover:shadow-md hover:border-[#2563EB]/30 transition-all border border-[#E2E6EA] bg-white group flex flex-col gap-3 h-fit">
              <h4 className="text-[11px] font-black group-hover:text-[#2563EB] transition-colors truncate">{inst.n}</h4>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded bg-[#F8FAFC] border border-[#F1F5F9] flex items-center justify-center font-black text-xs text-[#94A3B8] shadow-inner shrink-0">{inst.id}</div>
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-[#94A3B8] font-bold uppercase tracking-tight">US MV</span>
                    <span className="text-[#1A1D23] font-black tabular-nums">{inst.mv}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-[#94A3B8] font-bold uppercase tracking-tight">Top holding</span>
                    <span className="text-[#1A1D23] font-black">{inst.top}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-[#94A3B8] font-bold uppercase tracking-tight">Increased</span>
                    <span className="text-[#16A34A] font-black tabular-nums">{inst.inc}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
      <div className="w-[260px] shrink-0 space-y-4">
        <Card className="p-4 bg-white border border-[#E2E6EA]">
          <h3 className="text-xs font-black mb-4 text-[#1A1D23] uppercase tracking-wider">Search Filter</h3>
          <div className="space-y-5">
            <div className="relative group">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] group-focus-within:text-[#2563EB] transition-colors" size={12} />
              <Input placeholder="Search institution..." className="h-8 pl-8 text-[11px] bg-[#F8FAFC] border-transparent focus:bg-white focus:ring-2 focus:ring-[#2563EB]/10 font-bold" />
            </div>
            <div className="space-y-2.5">
              <label className="text-[9px] font-bold text-[#94A3B8] uppercase tracking-widest">Institution Type</label>
              <div className="flex flex-wrap gap-1.5">
                {["Mutual Fund", "Hedge Fund", "Pension", "ETF"].map((s) => (
                  <button key={s} className="px-2.5 py-1.5 text-[9px] font-bold rounded-md border border-[#E2E6EA] transition-all bg-white text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#1A1D23]">{s}</button>
                ))}
              </div>
            </div>
          </div>
        </Card>
        <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
          <div className="flex items-center gap-2 mb-2 text-[#2563EB]">
            <Info size={14} />
            <span className="text-[10px] font-black uppercase tracking-wider">Institutional Flow</span>
          </div>
          <p className="text-[10px] text-[#64748B] font-bold leading-relaxed">Institutions represent over 80% of daily volume. Track their movements to identify long-term accumulation zones.</p>
        </div>
      </div>
    </div>
  );
}

function InstitutionDetail({ institution, onBack }: { institution: string; onBack: () => void }) {
  const [activeHoldingsTab, setActiveHoldingsTab] = useState("All");

  return (
    <div className="h-full flex flex-col bg-[#FAFBFC] overflow-auto scrollbar-hide">
      <div className="p-6 border-b border-[#E2E6EA] bg-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="text-[#2563EB] text-[11px] font-bold flex items-center gap-1 hover:translate-x-[-2px] transition-transform cursor-pointer">
              <ChevronRight size={12} className="rotate-180" /> Back to Tracker
            </button>
            <div className="h-4 w-[1px] bg-[#E2E6EA]" />
            <h1 className="text-sm font-black text-[#1A1D23]">{institution}</h1>
          </div>
        </div>

        <p className="text-xs text-[#64748B] font-bold leading-relaxed mb-6">
          {institution}, established in 1975, is a leading global mutual fund provider and the second-largest issuer of ETFs.
        </p>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-[11px] font-black text-[#1A1D23] uppercase tracking-wider">Overview</h2>
            <span className="text-[9px] text-[#94A3B8] font-bold">Jan 28, 2026</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 border-[#E2E6EA] bg-white shadow-sm">
              <p className="text-[9px] text-[#94A3B8] font-black uppercase tracking-widest mb-2">US MV (USD)</p>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black text-[#1A1D23]">7.3T</span>
                <span className="text-[10px] font-bold text-[#16A34A]">+4.93%</span>
              </div>
            </Card>
            <Card className="p-4 border-[#E2E6EA] bg-white shadow-sm">
              <p className="text-[9px] text-[#94A3B8] font-black uppercase tracking-widest mb-2">Number of Stocks Held</p>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black text-[#1A1D23]">4433</span>
                <span className="text-[10px] font-bold text-[#16A34A]">+29</span>
              </div>
            </Card>
            <Card className="p-4 border-[#E2E6EA] bg-white shadow-sm">
              <p className="text-[9px] text-[#94A3B8] font-black uppercase tracking-widest mb-2">% of Top 10 Holdings</p>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black text-[#1A1D23]">27.44%</span>
                <span className="text-[10px] font-bold text-[#DC2626]">-0.64%</span>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6 max-w-[1440px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 bg-white border border-[#E2E6EA]">
            <h3 className="text-xs font-black mb-8 text-[#1A1D23] uppercase tracking-wider">Industry Distribution</h3>
            <div className="flex items-center gap-10">
              <div className="w-44 h-44 relative shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={[{ name: "Computer", value: 16.12 }, { name: "Electronics", value: 15.16 }, { name: "Medical Biology", value: 10.24 }, { name: "Non-Bank Financials", value: 8.51 }, { name: "Internet & Media", value: 8.19 }, { name: "Other", value: 41.77 }]} innerRadius={60} outerRadius={80} paddingAngle={3} dataKey="value" stroke="none">
                      {["#2563EB", "#0EA5E9", "#10B981", "#84CC16", "#EAB308", "#E2E6EA"].map((color, i) => (
                        <Cell key={i} fill={color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-3">
                {[
                  { n: "Computer", p: "16.12%", c: "#2563EB" },
                  { n: "Electronics", p: "15.16%", c: "#0EA5E9" },
                  { n: "Medical Biology", p: "10.24%", c: "#10B981" },
                  { n: "Non-Bank Financials", p: "8.51%", c: "#84CC16" },
                  { n: "Internet & Media", p: "8.19%", c: "#EAB308" },
                  { n: "Other", p: "41.77%", c: "#E2E6EA" },
                ].map((s) => (
                  <div key={s.n} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ background: s.c }} />
                      <span className="text-[11px] font-bold text-[#64748B]">{s.n}</span>
                    </div>
                    <span className="text-[11px] font-black text-[#1A1D23] tabular-nums">{s.p}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white border border-[#E2E6EA]">
            <h3 className="text-xs font-black mb-8 text-[#1A1D23] uppercase tracking-wider">Top 10 Holdings</h3>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { n: "NVDA", v: 5.41 }, { n: "AAPL", v: 4.49 }, { n: "GOOGL", v: 3.95 }, { n: "MSFT", v: 3.8 },
                  { n: "AMZN", v: 2.59 }, { n: "AVGO", v: 2.01 }, { n: "META", v: 1.85 }, { n: "TSLA", v: 1.42 },
                  { n: "LLY", v: 1.15 }, { n: "JPM", v: 1.05 },
                ]}>
                  <XAxis dataKey="n" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: "bold", fill: "#64748B" }} />
                  <YAxis hide domain={[0, 6]} />
                  <Tooltip cursor={{ fill: "#F8FAFC" }} contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", fontSize: "10px", fontWeight: "bold" }} formatter={(v: number) => [`${v}%`, "Weight"]} />
                  <Bar dataKey="v" fill="#2563EB" radius={[4, 4, 0, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <Card className="p-0 overflow-hidden mb-10 border-[#E2E6EA] bg-white">
          <div className="p-4 border-b border-[#F1F5F9] flex items-center justify-between">
            <div className="flex items-center gap-6">
              <h3 className="text-xs font-black text-[#1A1D23] uppercase tracking-wider">Holdings List</h3>
              <div className="flex bg-[#F1F5F9] p-1 rounded-md">
                {["All", "Increase", "Decrease", "New", "Sold Out"].map((tab) => (
                  <button key={tab} onClick={() => setActiveHoldingsTab(tab)} className={cn("px-3 py-1 text-[9px] font-bold rounded transition-all cursor-pointer", activeHoldingsTab === tab ? "bg-white text-[#2563EB] shadow-sm" : "text-[#64748B]")}>{tab}</button>
                ))}
              </div>
            </div>
            <div className="relative group">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={12} />
              <Input placeholder="Symbol" className="h-7 pl-8 w-32 text-[10px] bg-[#F8FAFC] border-transparent font-bold" />
            </div>
          </div>
          <table className="w-full text-[11px]">
            <thead className="bg-[#F8FAFC] text-[#94A3B8] border-b border-[#F1F5F9]">
              <tr>
                <th className="px-5 py-3 text-left font-black uppercase text-[9px] tracking-widest">Symbol</th>
                <th className="px-5 py-3 text-left font-black uppercase text-[9px] tracking-widest">Name</th>
                <th className="px-5 py-3 text-right font-black uppercase text-[9px] tracking-widest">% Portfolio</th>
                <th className="px-5 py-3 text-right font-black uppercase text-[9px] tracking-widest">Change</th>
                <th className="px-5 py-3 text-right font-black uppercase text-[9px] tracking-widest">Holdings MV</th>
                <th className="px-5 py-3 text-left font-black uppercase text-[9px] tracking-widest">Industry</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {[
                { s: "NVDA", n: "NVIDIA", p: "5.41%", ch: "-8.91M", mv: "430.43B", i: "Electronics", up: false },
                { s: "AAPL", n: "Apple", p: "4.49%", ch: "-16.51M", mv: "357.09B", i: "Computer", up: false },
                { s: "GOOGL", n: "Alphabet-A", p: "3.95%", ch: "-3.99M", mv: "313.93B", i: "Internet & Media", up: false },
                { s: "MSFT", n: "Microsoft", p: "3.80%", ch: "-3.09M", mv: "302.30B", i: "Computer", up: false },
                { s: "AMZN", n: "Amazon", p: "2.59%", ch: "+616.86K", mv: "205.76B", i: "Commerce", up: true },
                { s: "AVGO", n: "Broadcom", p: "2.01%", ch: "-4.66M", mv: "160.22B", i: "Electronics", up: false },
              ].map((h) => (
                <tr key={h.s} className="hover:bg-[#F8FAFC] transition-colors cursor-pointer group">
                  <td className="px-5 py-3 font-black text-[#1A1D23] group-hover:text-[#2563EB]">{h.s}</td>
                  <td className="px-5 py-3 font-bold text-[#64748B]">{h.n}</td>
                  <td className="px-5 py-3 text-right font-black tabular-nums text-[#1A1D23]">{h.p}</td>
                  <td className={cn("px-5 py-3 text-right font-black tabular-nums", h.up ? "text-[#16A34A]" : "text-[#DC2626]")}>{h.ch}</td>
                  <td className="px-5 py-3 text-right font-black tabular-nums text-[#1A1D23]">{h.mv}</td>
                  <td className="px-5 py-3 font-bold text-[#64748B]">{h.i}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}

function MarketUnderDevelopment({ icon, title, description, color, bgColor }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  bgColor: string;
}) {
  return (
    <div className="h-full flex items-center justify-center p-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center text-center max-w-md"
      >
        {/* Animated icon container */}
        <div className="relative mb-8">
          <div
            className="absolute inset-0 rounded-full animate-ping opacity-10"
            style={{ backgroundColor: color }}
          />
          <motion.div
            className="absolute -inset-4 rounded-full border-2 border-dashed opacity-15"
            style={{ borderColor: color }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <div
            className="relative w-24 h-24 rounded-full flex items-center justify-center"
            style={{ backgroundColor: bgColor, color }}
          >
            {icon}
          </div>
          <motion.div
            className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-white shadow-lg border border-[#E2E6EA] flex items-center justify-center"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Wrench size={14} className="text-[#9CA3AF]" />
          </motion.div>
        </div>

        <h3 className="text-xl font-bold text-[#1A1D23] mb-2">{title}</h3>

        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#E2E6EA] bg-white shadow-sm mb-5">
          <Sparkles size={14} style={{ color }} />
          <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Under Development</span>
        </div>

        <p className="text-sm text-[#6B7280] leading-relaxed mb-8">
          {description}
        </p>

        <div className="w-full max-w-xs">
          <div className="flex justify-between text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-2">
            <span>Progress</span>
            <span>Building...</span>
          </div>
          <div className="h-1.5 bg-[#F1F3F5] rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: color }}
              initial={{ width: "0%" }}
              animate={{ width: ["0%", "65%", "45%", "65%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
