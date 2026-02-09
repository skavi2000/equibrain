"use client";

import { Suspense, useState, useEffect } from "react";
import {
  Plus,
  Send,
  Brain,
  Mic,
  Activity,
  Clock,
  ExternalLink,
  ArrowLeft,
  Heart,
  TrendingUp,
  Paperclip,
  Languages,
  Maximize2,
  Cpu,
  Globe,
  Pencil,
  Trash2,
  BarChart as LucideBarChart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ImageWithFallback } from "@/components/shared/image-with-fallback";
import { useSearchParams } from "next/navigation";

type RightPanelMode = "ACTIVITY" | "STOCK_DETAILS" | "ALERTS";
type SearchStrategy = "DEEP_THINK" | "EQUIMIND_SEARCH" | "WEB_EQUIMIND";

export default function EquiMindPage() {
  return (
    <Suspense fallback={<div className="h-full flex items-center justify-center"><span className="text-sm text-[#9CA3AF]">Loading...</span></div>}>
      <EquiMindContent />
    </Suspense>
  );
}

function EquiMindContent() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const [rightPanelMode, setRightPanelMode] = useState<RightPanelMode>("ACTIVITY");
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [activeStrategy, setActiveStrategy] = useState<SearchStrategy>("DEEP_THINK");

  useEffect(() => {
    if (tab === "alerts" || tab === "Alerts") setRightPanelMode("ALERTS");
    else if (tab === "agents" || tab === "Agents") setRightPanelMode("ACTIVITY");
  }, [tab]);

  const handleStockClick = (ticker: string) => {
    setSelectedStock(ticker);
    setRightPanelMode("STOCK_DETAILS");
  };

  return (
    <div className="h-full flex bg-background overflow-hidden text-foreground font-sans">
      {/* Left Sidebar: Chat History */}
      <aside className="w-[260px] bg-secondary/50 border-r border-border flex flex-col shrink-0">
        <div className="p-4">
          <Button variant="outline" className="w-full flex items-center justify-between border-border bg-card hover:bg-secondary text-sm font-semibold h-10 px-3 rounded-lg shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center text-white text-[10px] font-bold">EB</div>
              <span>New chat</span>
            </div>
            <Plus size={16} className="text-muted-foreground" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto px-2 space-y-1 scrollbar-hide">
          <div className="px-3 py-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Today</div>
          <HistoryItem title="which stocks should I buy for trading" active />
          <HistoryItem title="AAPL earnings analysis" />
          <div className="px-3 py-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wider mt-4">Yesterday</div>
          <HistoryItem title="CSE market outlook 2026" />
          <HistoryItem title="Dividend strategy for 2026" />
        </div>
      </aside>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative min-w-0 bg-background">
        <header className="h-14 border-b border-border flex items-center justify-end px-6 shrink-0 bg-background/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground h-9 w-9"><Languages size={18} /></Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground h-9 w-9"><Maximize2 size={18} /></Button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto scroll-smooth">
          <div className="max-w-3xl mx-auto py-10 px-6 space-y-10 pb-32">
            <ChatMessage role="user" content="which stocks should I buy for trading" />
            <ChatMessage role="assistant" content="Based on current CSE market conditions and your portfolio risk profile, here are stocks worth monitoring. My multi-factor analysis identifies several tickers with strong bullish patterns today: JOH, DIST, and AAPL. These present interesting entries based on today's volatility." onStockClick={handleStockClick} />
          </div>
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background to-transparent pt-10 pb-6 px-6">
          <div className="max-w-3xl mx-auto relative">
            <div className="flex items-center gap-2 mb-2 px-1">
              <StrategyButton active={activeStrategy === "DEEP_THINK"} onClick={() => setActiveStrategy("DEEP_THINK")} label="Deep Think" icon={<Brain size={13} />} theme="violet" />
              <StrategyButton active={activeStrategy === "EQUIMIND_SEARCH"} onClick={() => setActiveStrategy("EQUIMIND_SEARCH")} label="Equimind Search" icon={<Cpu size={13} />} theme="blue" />
              <StrategyButton active={activeStrategy === "WEB_EQUIMIND"} onClick={() => setActiveStrategy("WEB_EQUIMIND")} label="Web + Equimind Search" icon={<Globe size={13} />} theme="neutral" />
            </div>
            <div className="relative bg-secondary/30 border border-border rounded-2xl shadow-sm focus-within:bg-card focus-within:shadow-md focus-within:border-ai-violet/30 transition-all p-3">
              <textarea placeholder="Ask EquiMind about stocks, patterns, or trends..." rows={1} className="w-full bg-transparent border-none outline-none text-[15px] px-2 py-1.5 resize-none max-h-[200px] overflow-y-auto placeholder-muted-foreground" style={{ height: "42px" }} />
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-lg"><Paperclip size={18} /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-lg"><Mic size={18} /></Button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground font-medium hidden sm:inline">Press Enter</span>
                  <Button className="h-8 w-8 bg-ai-violet hover:bg-ai-violet/90 text-white rounded-lg flex items-center justify-center p-0 transition-all active:scale-95 shadow-md shadow-ai-violet/20"><Send size={16} /></Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <aside className="w-[360px] border-l border-border flex flex-col shrink-0 bg-card overflow-hidden">
        <div className="flex p-2 gap-1 border-b border-border bg-secondary/20 shrink-0">
          <button onClick={() => setRightPanelMode("ACTIVITY")} className={cn("flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md text-[11px] font-bold transition-all", (rightPanelMode === "ACTIVITY" || rightPanelMode === "ALERTS") ? "bg-card shadow-sm text-primary" : "text-muted-foreground hover:text-foreground")}>
            <Activity size={14} /> Activity Feed
          </button>
          <button onClick={() => { if (selectedStock) setRightPanelMode("STOCK_DETAILS"); }} className={cn("flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md text-[11px] font-bold transition-all", rightPanelMode === "STOCK_DETAILS" ? "bg-card shadow-sm text-primary" : "text-muted-foreground hover:text-foreground", !selectedStock && "opacity-50 cursor-not-allowed")}>
            <LucideBarChart size={14} /> Symbols
          </button>
        </div>
        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            {rightPanelMode === "ACTIVITY" ? (
              <ActivityFeedPanel key="activity" />
            ) : rightPanelMode === "ALERTS" ? (
              <AlertsPanel key="alerts" onClose={() => setRightPanelMode("ACTIVITY")} />
            ) : (
              <EquiMindStockPanel key="stock" ticker={selectedStock || ""} onClose={() => setRightPanelMode("ACTIVITY")} />
            )}
          </AnimatePresence>
        </div>
      </aside>
    </div>
  );
}

function StrategyButton({ active, onClick, label, icon, theme }: { active: boolean; onClick: () => void; label: string; icon: React.ReactNode; theme: "violet" | "blue" | "neutral" }) {
  const themes = {
    violet: active ? "bg-ai-violet-bg text-ai-violet border-ai-violet/20" : "bg-card text-muted-foreground border-border hover:border-muted-foreground",
    blue: active ? "bg-primary/10 text-primary border-primary/20" : "bg-card text-muted-foreground border-border hover:border-muted-foreground",
    neutral: active ? "bg-secondary text-foreground border-border shadow-sm" : "bg-card text-muted-foreground border-border hover:border-muted-foreground",
  };
  const indicatorColors = {
    violet: active ? "bg-ai-violet" : "bg-muted-foreground",
    blue: active ? "bg-primary" : "bg-muted-foreground",
    neutral: active ? "bg-foreground" : "bg-muted-foreground",
  };
  return (
    <button onClick={onClick} className={cn("flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-bold transition-all border shadow-sm cursor-pointer", themes[theme])}>
      <div className={cn("shrink-0", active ? "scale-110" : "opacity-70")}>{icon}</div>
      <span>{label}</span>
      <div className={cn("w-1.5 h-1.5 rounded-full ml-0.5", indicatorColors[theme], active && "animate-pulse")} />
    </button>
  );
}

function HistoryItem({ title, active = false }: { title: string; active?: boolean }) {
  return (
    <button className={cn("w-full text-left px-3 py-2.5 rounded-lg transition-all group flex items-center gap-2", active ? "bg-ai-violet-bg text-ai-violet" : "hover:bg-secondary text-foreground")}>
      <p className="text-[13px] font-medium truncate flex-1">{title}</p>
      {active && <div className="w-1.5 h-1.5 rounded-full bg-ai-violet" />}
    </button>
  );
}

function ChatMessage({ role, content, onStockClick }: { role: "user" | "assistant"; content: string; onStockClick?: (t: string) => void }) {
  const tickers = ["AAPL", "JOH", "DIST"];
  const renderContent = (text: string) => {
    if (role === "user") return text;
    const regex = new RegExp(`(${tickers.join("|")})`, "g");
    const parts = text.split(regex);
    return parts.map((part, i) => {
      if (tickers.includes(part)) {
        return (
          <span key={i} onClick={() => onStockClick?.(part)} className="inline-block px-1.5 py-0.5 rounded bg-primary/10 text-primary font-bold cursor-pointer hover:bg-primary/20 transition-all shadow-[0_0_0_1px_rgba(37,99,235,0.1)] active:scale-95 mx-0.5">{part}</span>
        );
      }
      return part;
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={cn("flex gap-4 group", role === "user" ? "flex-row-reverse" : "flex-row")}>
      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border shadow-sm", role === "user" ? "bg-secondary border-border text-muted-foreground" : "bg-ai-violet-bg border-ai-violet/10 text-ai-violet")}>
        {role === "user" ? (
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center overflow-hidden border border-border">
            <ImageWithFallback src="https://images.unsplash.com/photo-1568585105565-e372998a195d?auto=format&fit=crop&q=80&w=100&h=100" className="w-full h-full object-cover" />
          </div>
        ) : (
          <Brain size={18} />
        )}
      </div>
      <div className={cn("flex flex-col gap-3 max-w-[85%]", role === "user" ? "items-end" : "items-start")}>
        <div className={cn("px-4 py-3 rounded-2xl text-[15px] leading-relaxed shadow-sm border", role === "user" ? "bg-primary text-white border-primary rounded-tr-none" : "bg-card text-foreground border-border rounded-tl-none")}>
          {renderContent(content)}
        </div>
      </div>
    </motion.div>
  );
}

function ActivityFeedPanel() {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex flex-col h-full overflow-hidden">
      <header className="p-5 border-b border-border flex items-center gap-2 bg-card shrink-0">
        <Activity size={18} className="text-ai-violet" />
        <h3 className="font-bold text-sm tracking-tight">Activity Feed</h3>
      </header>
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        <ReasoningStep type="Thinking" title="Query Decomposition" desc="Analyzing portfolio benchmarks." status="completed" />
        <ReasoningStep type="Analyzing" title="Correlation Study" desc="Divergence analysis between local and global tech." status="completed" />
        <ReasoningStep type="Generating" title="Final Synthesis" desc="Compiling setups for risk profile." status="processing" />
      </div>
    </motion.div>
  );
}

function AlertsPanel({ onClose }: { onClose: () => void }) {
  const alerts = [
    { id: 1, ticker: "AAPL", time: "2 mins ago", msg: "Price alert triggered: Above $225.00" },
    { id: 2, ticker: "AAPL", time: "2 mins ago", msg: "Price alert triggered: Above $225.00" },
    { id: 3, ticker: "AAPL", time: "2 mins ago", msg: "Price alert triggered: Above $225.00" },
  ];
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex flex-col h-full overflow-hidden bg-card">
      <header className="px-5 py-4 border-b border-border flex items-center justify-between bg-card shrink-0">
        <div className="flex items-center gap-2">
          <button onClick={onClose} className="p-1 hover:bg-secondary rounded-full transition-colors cursor-pointer"><ArrowLeft size={18} className="text-muted-foreground" /></button>
          <h3 className="font-bold text-[15px]">Notifications & Alerts</h3>
        </div>
        <button className="text-[12px] font-bold text-[#4F46E5] hover:text-[#4338CA] cursor-pointer">Mark all as read</button>
      </header>
      <div className="flex-1 overflow-y-auto divide-y divide-[#F0F2F5]">
        {alerts.map((alert) => (
          <div key={alert.id} className="p-5 hover:bg-secondary/30 transition-colors group relative">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#EEF2FF] text-[#4F46E5] text-[10px] font-bold uppercase tracking-wider">{alert.ticker}</span>
                <span className="text-[10px] text-muted-foreground font-medium">{alert.time}</span>
              </div>
              <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground"><Pencil size={12} /></button>
                <button className="p-1.5 rounded-lg hover:bg-loss/10 text-muted-foreground hover:text-loss"><Trash2 size={12} /></button>
              </div>
            </div>
            <p className="text-[13px] font-bold leading-snug">{alert.msg}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function ReasoningStep({ type, title, desc, status }: { type: string; title: string; desc: string; status: string }) {
  return (
    <div className="relative pl-6">
      <div className={cn("absolute left-0 top-1 w-2.5 h-2.5 rounded-full border-2 border-card shadow-sm ring-4 ring-background z-10", status === "completed" ? "bg-ai-violet" : "bg-ai-violet animate-pulse")} />
      <div className="absolute left-[4.5px] top-3.5 bottom-[-24px] w-px border-l border-dashed border-ai-violet/30" />
      <div className="bg-background rounded-xl p-4 border border-border shadow-sm">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="px-1.5 py-0.5 bg-ai-violet text-white rounded text-[8px] font-bold uppercase">{type}</span>
          <h4 className="text-xs font-bold">{title}</h4>
        </div>
        {desc && <p className="text-[11px] text-muted-foreground">{desc}</p>}
      </div>
    </div>
  );
}

function EquiMindStockPanel({ ticker, onClose }: { ticker: string; onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex flex-col h-full overflow-hidden bg-card text-foreground">
      <div className="px-4 pt-4 pb-2 border-b border-border shrink-0">
        <div className="flex items-center justify-between mb-2">
          <ArrowLeft size={18} className="text-muted-foreground cursor-pointer" onClick={onClose} />
          <Heart size={18} className="text-muted-foreground cursor-pointer hover:text-loss transition-colors" />
        </div>
        <div className="flex items-baseline gap-2 mb-1">
          <h2 className="text-2xl font-bold tracking-tight">{ticker}</h2>
          <span className="text-sm text-muted-foreground font-medium">NaaS Technology</span>
        </div>
        <div className="flex items-center gap-4 mb-2">
          <span className="text-4xl font-bold text-gain tabular-nums tracking-tighter">3.050</span>
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <TrendingUp size={16} className="text-gain" />
              <span className="text-gain text-sm font-bold">+0.230</span>
              <span className="text-gain text-sm font-bold">+8.16%</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-8 text-center">
        <div>
          <h3 className="font-bold text-sm mb-2">Detailed Analysis</h3>
          <p className="text-xs text-muted-foreground">Full order book, sentiment, and pattern data for {ticker}.</p>
        </div>
      </div>
      <div className="p-3 bg-secondary/20 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground shrink-0">
        <div className="flex items-center gap-1"><Clock size={10} /><span>Feb 3 11:13:05</span></div>
        <ExternalLink size={12} className="hover:text-primary cursor-pointer transition-colors" />
      </div>
    </motion.div>
  );
}
