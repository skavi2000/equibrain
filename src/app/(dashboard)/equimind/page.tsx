"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import {
  Plus,
  Send,
  Brain,
  Mic,
  Activity,
  ArrowLeft,
  Paperclip,
  Languages,
  Maximize2,
  Cpu,
  Globe,
  Pencil,
  Trash2,
  BarChart as LucideBarChart,
  Loader2,
  MoreVertical,
  Archive,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ImageWithFallback } from "@/components/shared/image-with-fallback";
import { StockDetailsPanel } from "@/components/shared/stock-details-panel";
import { useSearchParams, useRouter } from "next/navigation";
import { useChatStore } from "@/stores/chat-store";
import { useSpeechToText } from "@/hooks/use-speech-to-text";
import { Message, ActivityFeedItem, ChatSession } from "@/types/equimind";
import { format } from "date-fns";

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
  const [inputValue, setInputValue] = useState("");

  const {
    sessions,
    currentSessionId,
    messages,
    activityFeed,
    isLoading,
    isStreaming,
    loadSessions,
    selectSession,
    createSession,
    sendMessage,
    deleteSession,
    archiveSession,
    resetState
  } = useChatStore();

  const { isListening, transcript, startListening, stopListening, setTranscript } = useSpeechToText();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    if (tab === "alerts" || tab === "Alerts") setRightPanelMode("ALERTS");
    else if (tab === "agents" || tab === "Agents") setRightPanelMode("ACTIVITY");
  }, [tab]);

  useEffect(() => {
    if (transcript) {
      setInputValue(prev => prev ? `${prev} ${transcript}` : transcript);
      setTranscript(""); // Clear transcript after appending
    }
  }, [transcript]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activityFeed]);

  const handleStockClick = (ticker: string) => {
    setSelectedStock(ticker);
    setRightPanelMode("STOCK_DETAILS");
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isStreaming) return;
    const msg = inputValue;
    setInputValue("");

    // Determine context/reasoning mode based on activeStrategy
    let contextMode: 'web_internal' | 'internal_only' = 'internal_only';
    let reasoningMode: 'quick' | 'deep' = 'quick';

    if (activeStrategy === "DEEP_THINK") {
      reasoningMode = "deep";
    } else if (activeStrategy === "WEB_EQUIMIND") {
      contextMode = "web_internal";
    }

    await sendMessage(msg, {
      context_mode: contextMode,
      reasoning_mode: reasoningMode
    });
  };

  const handleNewChat = async () => {
    resetState();
    // Optional: don't create session immediately, wait for first message
    // Or create immediately:
    // await createSession("New Chat");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }

  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);

  // Responsive check could initially set these based on window width if using a hook, or accept default true.
  // For mobile-friendliness, we can also use media queries in classes.

  return (
    <div className="h-full flex bg-background overflow-hidden text-foreground font-sans relative">
      {/* Left Sidebar: Chat History */}
      <aside
        className={cn(
          "bg-secondary/50 border-r border-border flex flex-col shrink-0 transition-all duration-300 ease-in-out absolute md:relative z-20 h-full",
          isLeftPanelOpen ? "w-[260px] translate-x-0" : "w-0 -translate-x-full md:w-0 md:translate-x-0 opacity-0 overflow-hidden"
        )}
      >
        <div className="p-4 flex items-center justify-between">
          <Button onClick={handleNewChat} variant="outline" className="flex-1 flex items-center justify-between border-border bg-card hover:bg-secondary text-sm font-semibold h-10 px-3 rounded-lg shadow-sm mr-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center text-white text-[10px] font-bold">EB</div>
              <span className="truncate">New chat</span>
            </div>
            <Plus size={16} className="text-muted-foreground shrink-0" />
          </Button>
          {/* Mobile close button */}
          <Button variant="ghost" size="icon" className="md:hidden h-8 w-8" onClick={() => setIsLeftPanelOpen(false)}>
            <ArrowLeft size={18} />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto px-2 space-y-1 scrollbar-hide">
          {/* Group sessions by date could be added here later */}
          <div className="px-3 py-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">History</div>
          {sessions.map(session => (
            <HistoryItem
              key={session.id}
              session={session}
              active={session.id === currentSessionId}
              onSelect={() => { selectSession(session.id); if (window.innerWidth < 768) setIsLeftPanelOpen(false); }}
              onDelete={() => deleteSession(session.id)}
              onArchive={() => archiveSession(session.id)}
            />
          ))}
          {sessions.length === 0 && (
            <div className="px-4 py-8 text-center text-xs text-muted-foreground">
              No history yet
            </div>
          )}
        </div>
      </aside>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative min-w-0 bg-background transition-all">
        <header className="h-14 border-b border-border flex items-center justify-between px-4 shrink-0 bg-background/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-2">
            {!isLeftPanelOpen && (
              <Button variant="ghost" size="icon" onClick={() => setIsLeftPanelOpen(true)} className="text-muted-foreground hover:text-foreground h-9 w-9">
                <MoreVertical size={18} className="rotate-90" />
              </Button>
            )}
            <h2 className="font-semibold text-sm hidden sm:block">EquiMind Chat</h2>
          </div>
          <div className="flex items-center gap-2">

            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground h-9 w-9"><Languages size={18} /></Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
              className={cn("text-muted-foreground hover:text-foreground h-9 w-9", isRightPanelOpen && "bg-secondary text-primary")}
            >
              <Maximize2 size={18} />
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto scroll-smooth">
          <div className="max-w-3xl mx-auto py-10 px-6 space-y-10 pb-64">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full pt-20 opacity-50">
                <Brain size={48} className="text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center px-4">Ask EquiMind about stocks, patterns, or trends...</p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <ChatMessage
                  key={msg.id || idx}
                  role={msg.role}
                  content={msg.content}
                  onStockClick={handleStockClick}
                />
              ))
            )}
            {isStreaming && (
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border shadow-sm bg-ai-violet-bg border-ai-violet/10 text-ai-violet">
                  <Brain size={18} className="animate-pulse" />
                </div>
                <div className="flex items-center mt-2 gap-1">
                  <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background to-transparent pt-10 pb-6 px-4 md:px-6">
          <div className="max-w-3xl mx-auto relative">
            <div className="flex items-center gap-2 mb-2 px-1 overflow-x-auto scrollbar-hide">
              <StrategyButton active={activeStrategy === "DEEP_THINK"} onClick={() => setActiveStrategy("DEEP_THINK")} label="Deep Think" icon={<Brain size={13} />} theme="violet" />
              <StrategyButton active={activeStrategy === "EQUIMIND_SEARCH"} onClick={() => setActiveStrategy("EQUIMIND_SEARCH")} label="Equimind Search" icon={<Cpu size={13} />} theme="blue" />
              <StrategyButton active={activeStrategy === "WEB_EQUIMIND"} onClick={() => setActiveStrategy("WEB_EQUIMIND")} label="Web + Equimind Search" icon={<Globe size={13} />} theme="neutral" />
            </div>
            <div className={cn("relative bg-secondary/30 border border-border rounded-2xl shadow-sm focus-within:bg-card focus-within:shadow-md focus-within:border-ai-violet/30 transition-all p-3", isListening && "border-red-500/50 shadow-red-500/20")}>
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isListening ? "Listening..." : "Ask EquiMind..."}
                rows={1}
                className="w-full bg-transparent border-none outline-none text-[15px] px-2 py-1.5 resize-none max-h-[200px] overflow-y-auto placeholder-muted-foreground"
                style={{ height: "42px" }}
              />
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-lg"><Paperclip size={18} /></Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={isListening ? stopListening : startListening}
                    className={cn("h-8 w-8 text-muted-foreground hover:text-foreground rounded-lg", isListening && "text-red-500 hover:text-red-600 bg-red-100 dark:bg-red-900/20")}
                  >
                    <Mic size={18} className={isListening ? "animate-pulse" : ""} />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground font-medium hidden sm:inline">Press Enter</span>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isStreaming}
                    className="h-8 w-8 bg-ai-violet hover:bg-ai-violet/90 text-white rounded-lg flex items-center justify-center p-0 transition-all active:scale-95 shadow-md shadow-ai-violet/20 disabled:opacity-50"
                  >
                    {isStreaming ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <aside
        className={cn(
          "border-l border-border flex flex-col shrink-0 bg-card overflow-hidden transition-all duration-300 ease-in-out absolute right-0 md:relative z-20 h-full shadow-xl md:shadow-none",
          isRightPanelOpen ? "w-[300px] md:w-[360px] translate-x-0" : "w-0 translate-x-full md:w-0 md:translate-x-0 opacity-0"
        )}
      >
        <div className="flex p-2 gap-1 border-b border-border bg-secondary/20 shrink-0">
          <button onClick={() => setRightPanelMode("ACTIVITY")} className={cn("flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md text-[11px] font-bold transition-all truncate", (rightPanelMode === "ACTIVITY" || rightPanelMode === "ALERTS") ? "bg-card shadow-sm text-primary" : "text-muted-foreground hover:text-foreground")}>
            <Activity size={14} className="shrink-0" /> <span className="truncate">Activity</span>
          </button>
          <button onClick={() => { if (selectedStock) setRightPanelMode("STOCK_DETAILS"); }} className={cn("flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md text-[11px] font-bold transition-all truncate", rightPanelMode === "STOCK_DETAILS" ? "bg-card shadow-sm text-primary" : "text-muted-foreground hover:text-foreground", !selectedStock && "opacity-50 cursor-not-allowed")}>
            <LucideBarChart size={14} className="shrink-0" /> <span className="truncate">Symbols</span>
          </button>
          {/* Close button for mobile right panel */}
          <button onClick={() => setIsRightPanelOpen(false)} className="md:hidden p-1 hover:bg-red-100 text-muted-foreground hover:text-red-500 rounded">
            <X size={16} /> {/* Requires importing X from lucide-react */}
          </button>
        </div>
        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            {rightPanelMode === "ACTIVITY" ? (
              <ActivityFeedPanel key="activity" feed={activityFeed} />
            ) : rightPanelMode === "ALERTS" ? (
              <AlertsPanel key="alerts" onClose={() => setRightPanelMode("ACTIVITY")} />
            ) : (
              <StockDetailsPanel key="stock" ticker={selectedStock || ""} onClose={() => setRightPanelMode("ACTIVITY")} />
            )}
          </AnimatePresence>
        </div>
      </aside>

      {/* Overlay for mobile panel backdrop */}
      {(isLeftPanelOpen || isRightPanelOpen) && (
        <div
          className="md:hidden fixed inset-0 bg-black/20 z-10"
          onClick={() => { setIsLeftPanelOpen(false); setIsRightPanelOpen(false); }}
        />
      )}
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

function HistoryItem({ session, active = false, onSelect, onDelete, onArchive }: { session: ChatSession; active?: boolean; onSelect: () => void; onDelete: () => void; onArchive: () => void }) {
  return (
    <div className={cn("w-full group/item flex items-center gap-2 px-3 py-2.5 rounded-lg transition-all", active ? "bg-ai-violet-bg text-ai-violet" : "hover:bg-secondary text-foreground")}>
      <button onClick={onSelect} className="flex-1 text-left truncate">
        <p className="text-[13px] font-medium truncate">{session.title || "Untitled Chat"}</p>
      </button>
      {active && <div className="w-1.5 h-1.5 rounded-full bg-ai-violet shrink-0" />}
      <div className="hidden group-hover/item:flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); onArchive(); }}>
          <Archive size={12} className="text-muted-foreground hover:text-foreground" />
        </Button>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
          <Trash2 size={12} className="text-muted-foreground hover:text-red-500" />
        </Button>
      </div>
    </div>
  );
}

function ChatMessage({ role, content, onStockClick }: { role: "user" | "assistant" | "system"; content: string; onStockClick?: (t: string) => void }) {
  // Regex to find tickers in {SYMBOL}.{EXCHANGE} format or just simple known tickers if needed for backward compat or flexibility
  // For now, implementing rudimentary ticker detection or using format provided in guide
  // Guide says: {SYMBOL}.{EXCHANGE} format.

  const renderContent = (text: string) => {
    if (role === "user") return text;

    // Split by newlines for basic formatting
    return text.split('\n').map((line, i) => (
      <span key={i} className="block min-h-[1.2em]">{processTickers(line, onStockClick)}</span>
    ));
  };

  const processTickers = (text: string, onClick?: (t: string) => void) => {
    // Regex for Ticker.Exchange (e.g. JKH.N0000)
    const regex = /([A-Z0-9]+\.[N|X]0000)/g;
    const parts = text.split(regex);

    return parts.map((part, i) => {
      if (part.match(regex)) {
        return (
          <span key={i} onClick={() => onClick?.(part)} className="inline-block px-1.5 py-0.5 rounded bg-primary/10 text-primary font-bold cursor-pointer hover:bg-primary/20 transition-all shadow-[0_0_0_1px_rgba(37,99,235,0.1)] active:scale-95 mx-0.5">{part}</span>
        );
      }
      return part;
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={cn("flex gap-4 group text-sm", role === "user" ? "flex-row-reverse" : "flex-row")}>
      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border shadow-sm", role === "user" ? "bg-secondary border-border text-muted-foreground" : "bg-ai-violet-bg border-ai-violet/10 text-ai-violet")}>
        {role === "user" ? (
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center overflow-hidden border border-border">
            {/* Placeholder user avatar */}
            <div className="bg-gradient-to-br from-primary to-ai-violet w-full h-full" />
          </div>
        ) : (
          <Brain size={18} />
        )}
      </div>
      <div className={cn("flex flex-col gap-3 max-w-[85%]", role === "user" ? "items-end" : "items-start")}>
        <div className={cn("px-4 py-3 rounded-2xl leading-relaxed shadow-sm border whitespace-pre-wrap", role === "user" ? "bg-primary text-white border-primary rounded-tr-none" : "bg-card text-foreground border-border rounded-tl-none")}>
          {renderContent(content)}
        </div>
      </div>
    </motion.div>
  );
}

function ActivityFeedPanel({ feed }: { feed: ActivityFeedItem[] }) {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex flex-col h-full overflow-hidden">
      <header className="p-5 border-b border-border flex items-center gap-2 bg-card shrink-0">
        <Activity size={18} className="text-ai-violet" />
        <h3 className="font-bold text-sm tracking-tight">Activity Feed</h3>
      </header>
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {feed.length === 0 ? (
          <div className="text-center text-muted-foreground text-xs pt-10">
            Start a conversation to see AI reasoning...
          </div>
        ) : (
          feed.map((item, idx) => (
            <ReasoningStep
              key={idx}
              type={item.activity_type || item.type}
              title={(item.type || item.activity_type || "processing").toUpperCase()}
              desc={item.message}
              status="completed"
            />
          ))
        )}
      </div>
    </motion.div>
  );
}

function AlertsPanel({ onClose }: { onClose: () => void }) {
  // Placeholder for alerts integration
  // This would ideally fetch alerts from the store/API
  const alerts = [
    { id: 1, ticker: "AAPL", time: "2 mins ago", msg: "Price alert triggered: Above $225.00" },
  ];
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex flex-col h-full overflow-hidden bg-card">
      <header className="px-5 py-4 border-b border-border flex items-center justify-between bg-card shrink-0">
        <div className="flex items-center gap-2">
          <button onClick={onClose} className="p-1 hover:bg-secondary rounded-full transition-colors cursor-pointer"><ArrowLeft size={18} className="text-muted-foreground" /></button>
          <h3 className="font-bold text-[15px]">Notifications & Alerts</h3>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto">
        {/* Alerts list */}
        <div className="p-5 text-center text-xs text-muted-foreground">
          Alerts integration coming soon.
        </div>
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
