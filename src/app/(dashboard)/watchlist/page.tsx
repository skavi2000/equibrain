"use client";

import { useState, useEffect, useRef } from "react";
import {
  FileText,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
} from "lucide-react";
import * as LightweightCharts from "lightweight-charts";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { StockDetailsPanel } from "@/components/shared/stock-details-panel";
import { useUIStore } from "@/stores/ui-store";

const WATCHLIST_STOCKS = [
  { ticker: "SCO", name: "ProShares UltraShort Bloomberg Crude...", price: "15,360.4", change: "-0.55%", down: true },
  { ticker: "AAPL", name: "Apple Inc.", price: "228.40", change: "+1.82%", down: false },
  { ticker: "NVDA", name: "NVIDIA Corp.", price: "142.12", change: "+3.45%", down: false },
  { ticker: "GOOGL", name: "Alphabet Inc.", price: "178.12", change: "+0.85%", down: false },
  { ticker: "META", name: "Meta Platforms", price: "485.20", change: "-1.24%", down: true },
  { ticker: "TSLA", name: "Tesla Inc.", price: "214.50", change: "+0.45%", down: false },
  { ticker: "JOH", name: "John Keells Holdings", price: "145.20", change: "+0.94%", down: false },
  { ticker: "DIST", name: "Distilleries Company", price: "89.50", change: "-0.31%", down: true },
];

export default function WatchlistPage() {
  const [selectedTicker, setSelectedTicker] = useState("AEL.N0000");
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState("Chart");
  const selectedStockData = WATCHLIST_STOCKS.find((s) => s.ticker === selectedTicker) || WATCHLIST_STOCKS[0];

  const {
    isWatchlistPanelOpen,
    isDetailsPanelOpen,
    toggleWatchlistPanel,
    toggleDetailsPanel,
  } = useUIStore();

  const mainTabs = ["Chart", "Company Info", "Disclosures", "News"];

  return (
    <div className="h-full flex bg-[#FAFBFC] overflow-hidden relative">
      {/* Mobile backdrop for left panel */}
      {isWatchlistPanelOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={toggleWatchlistPanel} />
      )}

      {/* Left Sidebar: Watchlist Manager */}
      <aside
        className={cn(
          "border-r border-[#E2E6EA] flex flex-col bg-white shrink-0 transition-all duration-300 ease-in-out overflow-hidden",
          "fixed inset-y-0 left-0 z-50 lg:relative lg:z-auto",
          isWatchlistPanelOpen
            ? "w-[280px] lg:w-[260px] translate-x-0"
            : "-translate-x-full lg:translate-x-0 lg:w-[44px]"
        )}
      >
        {isWatchlistPanelOpen ? (
          <>
            <div className="p-4 border-b border-[#E2E6EA] space-y-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={toggleWatchlistPanel}
                  className="p-1.5 hover:bg-[#F0F2F5] rounded-md transition-colors text-[#9CA3AF] hover:text-[#1A1D23] cursor-pointer"
                  title="Collapse watchlist"
                >
                  <PanelLeftClose size={16} />
                </button>
                <h2 className="text-sm font-black text-[#1A1D23] uppercase tracking-wider">Watchlists</h2>
              </div>
              <div className="flex items-center gap-1.5 p-1 bg-[#F0F2F5] rounded-lg">
                <button className="flex-1 py-1.5 text-[10px] font-black bg-white text-[#2563EB] rounded shadow-sm">My Watchlist</button>
                <button className="flex-1 py-1.5 text-[10px] font-black text-[#6B7280] hover:text-[#1A1D23]">Tech Picks</button>
              </div>
              <Button size="sm" className="w-full h-9 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[11px] font-black shadow-md shadow-blue-500/20">
                ＋ Add Stock
              </Button>
            </div>

            <div className="flex-1 overflow-auto scrollbar-hide">
              <div className="grid grid-cols-3 px-4 py-2.5 border-b border-[#F0F2F5] text-[9px] font-black text-[#9CA3AF] uppercase sticky top-0 bg-white z-10">
                <span>Symbol</span>
                <span className="text-right">Price</span>
                <span className="text-right">% Chg</span>
              </div>
              <div className="divide-y divide-[#F0F2F5]">
                {WATCHLIST_STOCKS.map((stock) => (
                  <div
                    key={stock.ticker}
                    onClick={() => { setSelectedTicker(stock.ticker); if (window.innerWidth < 1024) toggleWatchlistPanel(); }}
                    className={cn(
                      "h-[56px] flex items-center px-4 cursor-pointer transition-all group",
                      selectedTicker === stock.ticker
                        ? "bg-[#EFF6FF] border-l-[3px] border-[#2563EB]"
                        : "hover:bg-[#F9FAFB] border-l-[3px] border-transparent"
                    )}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-black text-[#1A1D23] group-hover:text-[#2563EB] transition-colors">{stock.ticker}</p>
                      <p className="text-[9px] text-[#9CA3AF] font-bold truncate leading-none mt-0.5">{stock.name}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[12px] font-black tabular-nums text-[#1A1D23]">{stock.price}</p>
                      <p className={cn("text-[10px] font-black tabular-nums", stock.down ? "text-[#DC2626]" : "text-[#16A34A]")}>{stock.change}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="hidden lg:flex flex-col items-center h-full py-3">
            <button
              onClick={toggleWatchlistPanel}
              className="p-2 hover:bg-[#F0F2F5] rounded-md transition-colors text-[#9CA3AF] hover:text-[#2563EB] cursor-pointer"
              title="Expand watchlist"
            >
              <PanelLeftOpen size={18} />
            </button>
            <div className="flex-1 flex items-center justify-center">
              <span
                className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em] whitespace-nowrap"
                style={{ writingMode: "vertical-lr" }}
              >
                Watchlist
              </span>
            </div>
          </div>
        )}
      </aside>

      {/* Middle Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-white lg:border-r border-[#E2E6EA]">
        <header className="p-3 sm:p-5 border-b border-[#E2E6EA] shrink-0 bg-[#FEFEFE]">
          <div className="flex items-center justify-between mb-2 sm:mb-4">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              {/* Mobile toggle for left panel */}
              <button onClick={toggleWatchlistPanel} className="lg:hidden p-1.5 hover:bg-[#F0F2F5] rounded-md text-[#9CA3AF] hover:text-[#1A1D23] shrink-0">
                <PanelLeftOpen size={16} />
              </button>
              <h1 className="text-base sm:text-xl font-black text-[#1A1D23] truncate">{selectedStockData.name}</h1>
              <span className="bg-[#2563EB] text-white text-[10px] font-black px-2 py-0.5 rounded uppercase shrink-0">{selectedTicker}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1">
                <span className="w-2 h-2 bg-[#16A34A] rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-[#16A34A] uppercase">Market: Open</span>
              </div>
              {/* Mobile toggle for right panel */}
              <button onClick={toggleDetailsPanel} className="lg:hidden p-1.5 hover:bg-[#F0F2F5] rounded-md text-[#9CA3AF] hover:text-[#1A1D23] shrink-0">
                <PanelRightOpen size={16} />
              </button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-10">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl sm:text-4xl font-black text-[#1A1D23] tabular-nums tracking-tighter">{selectedStockData.price}</span>
              <div className="flex flex-col">
                <span className={cn("text-xs font-bold tabular-nums", selectedStockData.down ? "text-[#DC2626]" : "text-[#16A34A]")}>
                  {selectedStockData.down ? "-0.0085" : "+2.45"}
                </span>
                <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-black tabular-nums inline-block text-center", selectedStockData.down ? "bg-[#FEE2E2] text-[#DC2626]" : "bg-[#DCFCE7] text-[#16A34A]")}>
                  {selectedStockData.change}
                </span>
              </div>
            </div>
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 max-w-lg">
              {[
                { l: "Open", v: "15,370" },
                { l: "High", v: "15,420" },
                { l: "Low", v: "15,290" },
                { l: "Volume", v: "1.24M" },
              ].map((s) => (
                <div key={s.l} className="space-y-0.5">
                  <p className="text-[9px] text-[#9CA3AF] font-black uppercase tracking-widest leading-none">{s.l}</p>
                  <p className="text-xs font-black text-[#1A1D23] tabular-nums">{s.v}</p>
                </div>
              ))}
            </div>
          </div>
        </header>

        <div className="flex-1 flex flex-col min-h-0 bg-[#F9FAFB]/30 relative">
          <div className="h-10 bg-white border-b border-[#F0F2F5] px-3 sm:px-5 flex items-center shrink-0 overflow-x-auto scrollbar-hide">
            <div className="flex items-center h-full gap-4 sm:gap-8">
              {mainTabs.map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveWorkspaceTab(t)}
                  className={cn("h-full text-[11px] font-black relative whitespace-nowrap cursor-pointer transition-colors", activeWorkspaceTab === t ? "text-[#2563EB]" : "text-[#6B7280] hover:text-[#1A1D23]")}
                >
                  {t}
                  {activeWorkspaceTab === t && <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#2563EB]" />}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-auto flex flex-col min-h-0">
            {activeWorkspaceTab === "Chart" ? (
              <div className="flex-1 p-2 sm:p-4 relative overflow-hidden flex flex-col min-h-0">
                <div className="flex items-center gap-2 sm:gap-4 mb-2 sm:mb-4 shrink-0 overflow-x-auto scrollbar-hide py-1">
                  <div className="flex bg-[#F0F2F5] p-1 rounded-lg shrink-0">
                    {["5D", "1M", "3M", "YTD", "1Y", "5Y", "Max"].map((p) => (
                      <button key={p} className={cn("px-2 sm:px-3 py-1 text-[10px] font-black rounded-md transition-all cursor-pointer", p === "1D" ? "bg-white shadow-sm text-[#2563EB]" : "text-[#6B7280]")}>
                        {p}
                      </button>
                    ))}
                  </div>
                  <div className="h-4 w-[1px] bg-[#E2E6EA] shrink-0 hidden sm:block" />
                  <div className="hidden sm:flex bg-[#F0F2F5] p-1 rounded-lg shrink-0">
                    {["Daily", "Weekly", "Monthly", "Quarterly"].map((p) => (
                      <button key={p} className={cn("px-3 py-1 text-[10px] font-black rounded-md transition-all cursor-pointer", p === "Daily" ? "bg-white shadow-sm text-[#2563EB]" : "text-[#6B7280]")}>
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex-1 min-h-[300px] sm:min-h-[500px] bg-white rounded-2xl border border-[#E2E6EA] shadow-sm relative overflow-hidden">
                  <StockChart ticker={selectedTicker} panelState={`${isWatchlistPanelOpen}-${isDetailsPanelOpen}`} />
                </div>
              </div>
            ) : activeWorkspaceTab === "Company Info" ? (
              <div className="flex-1 p-4 sm:p-8 bg-white overflow-auto scrollbar-hide">
                <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div>
                    <h3 className="text-[13px] font-black mb-4 text-[#1A1D23] uppercase tracking-wider">Company Description</h3>
                    <p className="text-[13px] text-[#64748B] leading-relaxed font-bold">
                      {selectedStockData.name} (trading as <span className="text-[#2563EB]">{selectedTicker}</span>) seeks to provide investors with leveraged exposure to crude oil market movements.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-12">
                    {[
                      { l: "Sector", v: "Financial Services" },
                      { l: "Market Cap", v: "$1.24B" },
                      { l: "P/E Ratio", v: "14.2" },
                      { l: "Dividend Yield", v: "0.00%" },
                      { l: "CEO", v: "Michael L. Sapir" },
                      { l: "Founded", v: "2006" },
                      { l: "Headquarters", v: "Bethesda, MD" },
                      { l: "Employees", v: "1,240" },
                    ].map((m) => (
                      <div key={m.l} className="space-y-1.5">
                        <p className="text-[10px] text-[#94A3B8] font-black uppercase tracking-widest leading-none">{m.l}</p>
                        <p className="text-[13px] font-black text-[#1A1D23]">{m.v}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 p-6 sm:p-12 flex flex-col items-center justify-center text-center bg-white">
                <div className="w-16 h-16 bg-[#F8FAFC] rounded-2xl flex items-center justify-center mb-4 border border-[#F1F5F9]">
                  <FileText className="text-[#94A3B8]" size={32} />
                </div>
                <h3 className="text-sm font-black text-[#1A1D23] mb-2">{activeWorkspaceTab} content</h3>
                <p className="text-xs text-[#64748B] font-bold max-w-xs">Detailed data for {activeWorkspaceTab} is being synchronized from the institutional data feed.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile backdrop for right panel */}
      {isDetailsPanelOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={toggleDetailsPanel} />
      )}

      {/* Right Sidebar */}
      <aside
        className={cn(
          "shrink-0 bg-white shadow-[-4px_0_12px_rgba(0,0,0,0.02)] overflow-hidden transition-all duration-300 ease-in-out",
          "fixed inset-y-0 right-0 z-50 lg:relative lg:z-10",
          isDetailsPanelOpen
            ? "w-[320px] sm:w-[360px] translate-x-0"
            : "translate-x-full lg:translate-x-0 lg:w-[44px]"
        )}
      >
        {isDetailsPanelOpen ? (
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-[#E2E6EA]">
              <h2 className="text-sm font-black text-[#1A1D23] uppercase tracking-wider">Details</h2>
              <button
                onClick={toggleDetailsPanel}
                className="p-1.5 hover:bg-[#F0F2F5] rounded-md transition-colors text-[#9CA3AF] hover:text-[#1A1D23] cursor-pointer"
                title="Collapse details"
              >
                <PanelRightClose size={16} />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <StockDetailsPanel ticker={selectedTicker} showHeader={true} />
            </div>
          </div>
        ) : (
          <div className="hidden lg:flex flex-col items-center h-full py-3">
            <button
              onClick={toggleDetailsPanel}
              className="p-2 hover:bg-[#F0F2F5] rounded-md transition-colors text-[#9CA3AF] hover:text-[#2563EB] cursor-pointer"
              title="Expand details"
            >
              <PanelRightOpen size={18} />
            </button>
            <div className="flex-1 flex items-center justify-center">
              <span
                className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em] whitespace-nowrap"
                style={{ writingMode: "vertical-lr" }}
              >
                Details
              </span>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

function StockChart({ ticker, panelState }: { ticker: string; panelState: string }) {
  const priceChartContainerRef = useRef<HTMLDivElement>(null);
  const volumeChartContainerRef = useRef<HTMLDivElement>(null);
  const priceChartRef = useRef<ReturnType<typeof LightweightCharts.createChart> | null>(null);
  const volumeChartRef = useRef<ReturnType<typeof LightweightCharts.createChart> | null>(null);

  // Resize charts when panels collapse/expand
  useEffect(() => {
    const timer = setTimeout(() => {
      if (priceChartContainerRef.current && priceChartRef.current) {
        priceChartRef.current.applyOptions({ width: priceChartContainerRef.current.clientWidth });
      }
      if (volumeChartContainerRef.current && volumeChartRef.current) {
        volumeChartRef.current.applyOptions({ width: volumeChartContainerRef.current.clientWidth });
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [panelState]);

  useEffect(() => {
    if (!priceChartContainerRef.current || !volumeChartContainerRef.current) return;

    const commonOptions = {
      layout: {
        background: { type: LightweightCharts.ColorType.Solid, color: "transparent" },
        textColor: "#64748B",
      },
      grid: {
        vertLines: { color: "#F1F5F9" },
        horzLines: { color: "#F1F5F9" },
      },
      timeScale: { borderColor: "#E2E6EA", visible: false },
      rightPriceScale: { borderColor: "#E2E6EA" },
      crosshair: { mode: 0 },
    };

    const priceChart = LightweightCharts.createChart(priceChartContainerRef.current, {
      ...commonOptions,
      width: priceChartContainerRef.current.clientWidth || 400,
      height: 350,
    });

    const volumeChart = LightweightCharts.createChart(volumeChartContainerRef.current, {
      ...commonOptions,
      width: volumeChartContainerRef.current.clientWidth || 400,
      height: 150,
      timeScale: { ...commonOptions.timeScale, visible: true },
    });

    priceChartRef.current = priceChart;
    volumeChartRef.current = volumeChart;

    const candlestickSeries = priceChart.addSeries(LightweightCharts.CandlestickSeries, {
      upColor: "#16A34A",
      downColor: "#DC2626",
      borderVisible: false,
      wickUpColor: "#16A34A",
      wickDownColor: "#DC2626",
    });

    const volumeSeries = volumeChart.addSeries(LightweightCharts.HistogramSeries, {
      color: "#2563EB",
      priceFormat: { type: "volume" },
    });

    const mockData = Array.from({ length: 100 }, (_, i) => {
      const date = new Date(2025, 0, i + 1);
      const time = date.toISOString().split("T")[0];
      const base = 140 + Math.random() * 20;
      const spread = Math.random() * 5;
      const isUp = Math.random() > 0.45;
      return {
        time,
        open: base,
        high: base + spread + Math.random() * 2,
        low: base - Math.random() * 2,
        close: isUp ? base + spread : base - spread,
        value: 1000000 + Math.random() * 5000000,
        color: isUp ? "#16A34A" : "#DC2626",
      };
    });

    candlestickSeries.setData(mockData.map(({ time, open, high, low, close }) => ({ time, open, high, low, close })));
    volumeSeries.setData(mockData.map(({ time, value, color }) => ({ time, value, color })));

    let isSyncing = false;
    priceChart.timeScale().subscribeVisibleTimeRangeChange((range) => {
      if (isSyncing || !range || typeof range !== "object" || !("from" in range)) return;
      isSyncing = true;
      try { volumeChart.timeScale().setVisibleRange(range); } catch {}
      isSyncing = false;
    });
    volumeChart.timeScale().subscribeVisibleTimeRangeChange((range) => {
      if (isSyncing || !range || typeof range !== "object" || !("from" in range)) return;
      isSyncing = true;
      try { priceChart.timeScale().setVisibleRange(range); } catch {}
      isSyncing = false;
    });

    const handleResize = () => {
      if (priceChartContainerRef.current && volumeChartContainerRef.current) {
        priceChart.applyOptions({ width: priceChartContainerRef.current.clientWidth });
        volumeChart.applyOptions({ width: volumeChartContainerRef.current.clientWidth });
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      priceChartRef.current = null;
      volumeChartRef.current = null;
      priceChart.remove();
      volumeChart.remove();
    };
  }, [ticker]);

  return (
    <div className="w-full h-full flex flex-col bg-white">
      <div className="h-8 px-2 sm:px-4 flex items-center gap-2 sm:gap-4 border-b border-[#F1F5F9] shrink-0 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 text-[10px] font-black whitespace-nowrap">
          <span className="text-[#94A3B8]">O</span> <span className="text-[#1A1D23]">15.335</span>
          <span className="text-[#94A3B8]">H</span> <span className="text-[#16A34A]">15.910</span>
          <span className="text-[#94A3B8]">L</span> <span className="text-[#DC2626]">15.185</span>
          <span className="text-[#94A3B8]">C</span> <span className="text-[#1A1D23]">15.360</span>
        </div>
        <div className="hidden sm:flex gap-2 text-[10px] font-black whitespace-nowrap">
          <span className="text-[#94A3B8]">Chg</span> <span className="text-[#DC2626]">-0.090</span>
          <span className="text-[#DC2626]">-0.58%</span>
        </div>
        <div className="hidden sm:flex gap-2 text-[10px] font-black ml-auto whitespace-nowrap">
          <span className="text-[#94A3B8]">Vol</span> <span className="text-[#1A1D23]">2.05M</span>
          <span className="text-[#94A3B8]">Turnover</span> <span className="text-[#1A1D23]">31.86M</span>
        </div>
      </div>
      <div className="flex-1 relative min-h-0">
        <div ref={priceChartContainerRef} className="w-full h-full" />
      </div>
      <div className="h-6 px-2 sm:px-4 flex items-center border-t border-b border-[#F1F5F9] bg-[#F8FAFC]/50 shrink-0">
        <span className="text-[9px] font-black text-[#64748B] uppercase tracking-widest flex items-center gap-2">
          Volume <span className="text-[#2563EB] font-bold">VOL: 2.054M</span>
        </span>
      </div>
      <div className="h-[120px] sm:h-[150px] shrink-0 relative">
        <div ref={volumeChartContainerRef} className="w-full h-full" />
      </div>
    </div>
  );
}
