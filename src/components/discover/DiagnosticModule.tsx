"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Activity,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Globe,
  RotateCcw,
  MapPin,
  X,
  ChevronRight,
  ChevronLeft,
  Clock,
  Share2,
  ShieldAlert,
  Layers,
  Cpu,
  Milestone,
  AlertTriangle,
  Terminal,
  Wifi,
  Loader2,
  Ban
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup
} from "react-simple-maps";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getMarketDiagnosticData, hasMarketDiagnosticData } from "@/data/market-diagnostics";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

type DiagnosticState = "map" | "running" | "results";

interface Market {
  id: string;
  name: string;
  code: string;
  region: string;
  coordinates: [number, number]; // [longitude, latitude]
  latency?: number;
  tradingHoursUTC: { open: { h: number; m: number }; close: { h: number; m: number } };
}

function getMarketStatus(market: Market): "active" | "closed" {
  const now = new Date();
  const day = now.getUTCDay();
  if (day === 0 || day === 6) return "closed";
  const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
  const openMinutes = market.tradingHoursUTC.open.h * 60 + market.tradingHoursUTC.open.m;
  const closeMinutes = market.tradingHoursUTC.close.h * 60 + market.tradingHoursUTC.close.m;
  return (utcMinutes >= openMinutes && utcMinutes < closeMinutes) ? "active" : "closed";
}

interface LogEntry {
  id: number;
  timestamp: string;
  message: string;
  category: "INFO" | "WARN" | "SUCCESS";
}

// --- Market data with UTC trading hours ---
const MARKETS: Market[] = [
  { id: "nyse", name: "New York Stock Exchange", code: "NYSE", region: "AMER", coordinates: [-74.0060, 40.7128], latency: 12, tradingHoursUTC: { open: { h: 14, m: 30 }, close: { h: 21, m: 0 } } },
  { id: "nse", name: "National Stock Exchange of India", code: "NSE", region: "ASIA", coordinates: [72.8777, 19.0760], latency: 140, tradingHoursUTC: { open: { h: 3, m: 45 }, close: { h: 10, m: 0 } } },
  { id: "cse", name: "Colombo Stock Exchange", code: "CSE", region: "ASIA", coordinates: [79.8612, 6.9271], latency: 165, tradingHoursUTC: { open: { h: 4, m: 0 }, close: { h: 9, m: 0 } } },
  { id: "hose", name: "Ho Chi Minh Stock Exchange", code: "HOSE", region: "ASIA", coordinates: [106.6297, 10.8231], latency: 175, tradingHoursUTC: { open: { h: 2, m: 0 }, close: { h: 8, m: 0 } } },
  { id: "hkg", name: "Hong Kong Stock Exchange", code: "HKG", region: "ASIA", coordinates: [114.1694, 22.3193], latency: 145, tradingHoursUTC: { open: { h: 1, m: 30 }, close: { h: 8, m: 0 } } },
  { id: "sgx", name: "Singapore Exchange", code: "SGX", region: "ASIA", coordinates: [103.8198, 1.3521], latency: 130, tradingHoursUTC: { open: { h: 1, m: 0 }, close: { h: 9, m: 0 } } },
];

// --- Activity Feed log messages (streamed live) ---
const LOG_MESSAGES: { msg: string; cat: "INFO" | "WARN" | "SUCCESS" }[] = [
  { msg: "Connecting to exchange gateway...", cat: "INFO" },
  { msg: "Verifying price history sequence...", cat: "INFO" },
  { msg: "Turnover thresholds normalized.", cat: "SUCCESS" },
  { msg: "Loading 'Maverick' Strategy configuration...", cat: "INFO" },
  { msg: "Gap found in historical data [2023-Q3]", cat: "WARN" },
  { msg: "Re-calibrating volatility index...", cat: "INFO" },
  { msg: "Latency spike detected (14ms)", cat: "WARN" },
  { msg: "Stop Loss simulation confirmed.", cat: "SUCCESS" },
  { msg: "Analyzing order book depth...", cat: "INFO" },
  { msg: "Validating API heartbeat protocol...", cat: "INFO" },
  { msg: "News ingestion pipeline verified.", cat: "SUCCESS" },
  { msg: "Dividend events pipeline operational.", cat: "SUCCESS" },
  { msg: "Order book integrity check passed.", cat: "SUCCESS" },
  { msg: "Compliance rules validated.", cat: "SUCCESS" },
  { msg: "Finalizing executive report...", cat: "INFO" },
];

// Data is now loaded dynamically per market from @/data/market-diagnostics

// Sparkline data for monitor cards
const SPARK_DATA = Array.from({ length: 20 }, (_, i) => ({ val: Math.random() * 100 }));

// --- Blocker type for results ---
interface DerivedBlocker {
  code: string;
  severity: string;
  category: "DATA" | "EXECUTION" | "STRATEGY";
  recommended_actions: string[];
}

export function DiagnosticModule() {
  const [state, setState] = useState<DiagnosticState>("map");
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [progress, setProgress] = useState(0);
  const [, setTick] = useState(0);

  // Re-check market statuses every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  // Live activity feed state
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [radarData, setRadarData] = useState([
    { subject: 'Data Quality', A: 20, fullMark: 100 },
    { subject: 'Structure', A: 20, fullMark: 100 },
    { subject: 'Adaptability', A: 20, fullMark: 100 },
    { subject: 'Risk Model', A: 20, fullMark: 100 },
    { subject: 'Execution', A: 20, fullMark: 100 },
    { subject: 'Speed', A: 20, fullMark: 100 },
  ]);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Tooltip state for map markers
  const [hoveredMarket, setHoveredMarket] = useState<Market | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Results state
  const [activeTab, setActiveTab] = useState<"DATA" | "EXECUTION" | "STRATEGY">("DATA");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  const handleMarketClick = (market: Market) => {
    setSelectedMarket(market);
    setShowModal(true);
  };

  const startDiagnostic = () => {
    setShowModal(false);
    setState("running");
    setProgress(0);
    setLogs([]);
    setRadarData([
      { subject: 'Data Quality', A: 20, fullMark: 100 },
      { subject: 'Structure', A: 20, fullMark: 100 },
      { subject: 'Adaptability', A: 20, fullMark: 100 },
      { subject: 'Risk Model', A: 20, fullMark: 100 },
      { subject: 'Execution', A: 20, fullMark: 100 },
      { subject: 'Speed', A: 20, fullMark: 100 },
    ]);
  };

  const handleReset = () => {
    setState("map");
    setSelectedMarket(null);
    setProgress(0);
    setLogs([]);
    setActiveTab("DATA");
    setCurrentPage(1);
  };

  // Live scanning simulation
  useEffect(() => {
    if (state !== "running") return;

    let counter = 0;
    const interval = setInterval(() => {
      counter++;
      const currentProgress = (counter / 40) * 100;
      setProgress(Math.min(currentProgress, 100));

      // Animate radar values
      setRadarData(prev => prev.map(item => ({
        ...item,
        A: Math.min(item.A + Math.random() * 15, item.fullMark * 0.85)
      })));

      // Add log entries progressively
      if (counter % 3 === 0 && Math.floor(counter / 3) <= LOG_MESSAGES.length) {
        const msgIdx = Math.floor(counter / 3) - 1;
        if (msgIdx >= 0 && msgIdx < LOG_MESSAGES.length) {
          const logData = LOG_MESSAGES[msgIdx];
          setLogs(prev => [...prev, {
            id: Date.now(),
            timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, fractionalSecondDigits: 3 } as Intl.DateTimeFormatOptions),
            message: logData.msg,
            category: logData.cat
          }]);
        }
      }

      if (counter >= 40) {
        clearInterval(interval);
        setTimeout(() => setState("results"), 800);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [state]);

  // Auto-scroll logs
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // Load per-market data dynamically
  const marketData = selectedMarket ? getMarketDiagnosticData(selectedMarket.id) : null;
  const diagnosticData = marketData?.diagnostic ?? null;
  const remediationData = marketData?.remediation ?? null;

  // Derive blockers from actual blockers + warnings + non-ready agents
  const derivedBlockers: DerivedBlocker[] = useMemo(() => {
    if (!diagnosticData) return [];
    const items: DerivedBlocker[] = [];

    // Actual blockers first (high priority)
    diagnosticData.blockers.forEach(b => {
      items.push({ code: b.code, severity: b.severity, category: b.category, recommended_actions: b.recommended_actions });
    });

    // Warnings
    diagnosticData.warnings.forEach(w => {
      items.push({ code: w.code, severity: w.severity, category: w.category, recommended_actions: [w.details] });
    });

    // Non-ready agents (exclude "Ready" and "Not Applicable")
    diagnosticData.agents
      .filter(a => !["Ready", "Not Applicable"].includes(a.status))
      .forEach(a => {
        const severity = ["Blocked", "Not Available"].includes(a.status) ? "High" : a.status === "Partial" ? "High" : "Medium";
        items.push({ code: `${a.agent_id} (${a.status})`, severity, category: a.category, recommended_actions: a.recommended_actions });
      });

    return items;
  }, [diagnosticData]);

  const tabBlockers = derivedBlockers.filter(b => b.category === activeTab);
  const totalPages = Math.ceil(tabBlockers.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const currentBlockers = tabBlockers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const scores = diagnosticData?.scores ?? { data_quality: 0, trade_execution: 0, agent_readiness: 0, overall: 0, scoring_notes: [] };
  const ringColor = scores.overall >= 80 ? "#10B981" : "#F59E0B";

  return (
    <div className="h-full flex flex-col bg-[#FAFBFC] overflow-hidden">
      {/* Secondary Top Bar */}
      <div className="h-12 border-b border-[#E2E6EA] bg-[#F8FAFC] flex items-center px-6 gap-6 shrink-0 justify-between">
        <div className="flex items-center gap-6">
          <button
            onClick={handleReset}
            className={cn(
              "h-full px-1 flex items-center text-[12px] font-bold transition-all relative",
              state === "map" ? "text-[#E67E22]" : "text-[#6B7280] hover:text-[#1A1D23]"
            )}
          >
            Select Target Market
            {state === "map" && (
              <motion.div layoutId="activeDiagTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E67E22]" />
            )}
          </button>
          <button
            disabled={state !== "results"}
            className={cn(
              "h-full px-1 flex items-center text-[12px] font-bold transition-all relative",
              state === "results" ? "text-[#E67E22]" : "text-[#6B7280]"
            )}
          >
            Assessment Results
            {state === "results" && (
              <motion.div layoutId="activeDiagTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E67E22]" />
            )}
          </button>
        </div>

        {(state === "running" || state === "results") && (
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-2 bg-[#DCFCE7] text-[#16A34A] px-3 py-1 rounded-full border border-[#16A34A]/10">
               <span className="w-1.5 h-1.5 bg-[#16A34A] rounded-full animate-pulse" />
               <span className="text-[10px] font-bold uppercase tracking-wider">Online</span>
             </div>
             <span className="text-[10px] font-bold text-[#9CA3AF]">v2.4.1</span>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto relative">
        <AnimatePresence mode="wait">
          {/* ============ MAP STATE ============ */}
          {state === "map" && (
            <motion.div
              key="map"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full p-12 max-w-6xl mx-auto flex flex-col"
            >
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-3 text-[#1A1D23]">
                    <Globe className="text-[#E67E22]" size={24} />
                    Select Target Market
                  </h2>
                  <p className="text-sm text-[#6B7280] mt-1">Choose a global exchange to run the readiness assessment.</p>
                </div>
                <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-full border border-[#E2E6EA] shadow-sm">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#16A34A]" />
                    <span className="text-[10px] font-bold text-[#6B7280]">Active</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#DC2626]" />
                    <span className="text-[10px] font-bold text-[#6B7280]">Closed</span>
                  </div>
                </div>
              </div>

              <div ref={mapContainerRef} className="flex-1 bg-white rounded-3xl border border-[#E2E6EA] shadow-xl relative overflow-hidden group min-h-[400px]">
                {/* Grid Overlay */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-10"
                     style={{
                       backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
                       backgroundSize: '40px 40px'
                     }} />

                {/* World Map with react-simple-maps */}
                <ComposableMap
                  projection="geoMercator"
                  projectionConfig={{
                    scale: 130,
                    center: [40, 20],
                  }}
                  className="w-full h-full"
                  style={{ width: "100%", height: "100%" }}
                >
                  <Geographies geography={GEO_URL}>
                    {({ geographies }) =>
                      geographies.map((geo) => (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill="#E8ECF0"
                          stroke="#CBD5E1"
                          strokeWidth={0.5}
                          style={{
                            default: { outline: "none" },
                            hover: { outline: "none", fill: "#D1D8E0" },
                            pressed: { outline: "none" },
                          }}
                        />
                      ))
                    }
                  </Geographies>

                  {/* Market Markers */}
                  {MARKETS.map((m) => (
                    <Marker key={m.id} coordinates={m.coordinates}>
                      <g
                        onClick={() => handleMarketClick(m)}
                        className="cursor-pointer"
                        style={{ pointerEvents: "all" }}
                        onMouseEnter={(e) => {
                          const rect = mapContainerRef.current?.getBoundingClientRect();
                          if (rect) {
                            setTooltipPos({
                              x: e.clientX - rect.left,
                              y: e.clientY - rect.top,
                            });
                          }
                          setHoveredMarket(m);
                        }}
                        onMouseLeave={() => setHoveredMarket(null)}
                      >
                        {/* Pulse ring animation */}
                        <circle
                          r={12}
                          fill="transparent"
                          stroke={getMarketStatus(m) === "active" ? "#16A34A" : "#DC2626"}
                          strokeWidth={1}
                          opacity={0.3}
                        >
                          <animate attributeName="r" from="8" to="16" dur="2s" repeatCount="indefinite" />
                          <animate attributeName="opacity" from="0.4" to="0" dur="2s" repeatCount="indefinite" />
                        </circle>
                        {/* Marker circle */}
                        <circle
                          r={6}
                          fill="transparent"
                          stroke={getMarketStatus(m) === "active" ? "#16A34A" : "#DC2626"}
                          strokeWidth={2.5}
                        />
                        {/* Invisible larger hit area for easier hover */}
                        <circle r={14} fill="transparent" />
                      </g>
                    </Marker>
                  ))}
                </ComposableMap>

                {/* HTML Tooltip Overlay */}
                {hoveredMarket && (
                  <div
                    className="absolute z-20 pointer-events-none"
                    style={{
                      left: tooltipPos.x,
                      top: tooltipPos.y,
                      transform: "translate(-50%, -100%) translateY(-16px)",
                    }}
                  >
                    <div className="bg-white rounded-xl shadow-2xl border border-[#E2E6EA] px-5 py-3 flex flex-col items-center gap-1 min-w-[120px]">
                      <span className="text-sm font-black text-[#1A1D23] tracking-tight">{hoveredMarket.code}</span>
                      <span className="text-[11px] text-[#6B7280] font-medium">{hoveredMarket.name.split(" ")[0]}</span>
                    </div>
                    <div className="flex justify-center">
                      <div className="w-2.5 h-2.5 bg-white border-b border-r border-[#E2E6EA] rotate-45 -mt-[6px]" />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ============ RUNNING STATE ============ */}
          {state === "running" && (
            <motion.div
              key="running"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full bg-white flex flex-col"
            >
              {/* Internal Header */}
              <div className="h-14 border-b border-[#F1F3F5] flex items-center justify-between px-8 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-[#E67E22] rounded flex items-center justify-center text-white text-[10px] font-bold">E</div>
                  <h3 className="text-sm font-bold text-[#1A1D23]">EquiMind <span className="text-[#9CA3AF] font-medium">Diagnostic</span></h3>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-medium text-[#E67E22] text-sm animate-pulse bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                    Scanning... {Math.round(progress)}%
                  </span>
                </div>
              </div>

              <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col p-8">
                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-[#F0F2F5] rounded-full mb-8 overflow-hidden">
                  <div
                    className="h-full bg-[#E67E22] transition-all duration-100 ease-linear rounded-r-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="flex gap-8 flex-1">
                  {/* Left Column: Radar Analysis */}
                  <div className="flex-[2] bg-white border border-[#E2E6EA] rounded-2xl shadow-sm p-8 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                         <Activity className="text-[#E67E22]" size={20} />
                         <h3 className="text-lg font-bold">System Analysis</h3>
                      </div>
                    </div>

                    <div className="flex-1 min-h-[320px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                          <PolarGrid stroke="#E2E6EA" />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 13, fontWeight: 500 }} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                          <Radar name="EquiMind" dataKey="A" stroke="#E67E22" fill="#E67E22" fillOpacity={0.15} strokeWidth={3} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Micro Monitors */}
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E6EA] relative overflow-hidden">
                        <div className="flex items-center justify-between mb-2 z-10 relative">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wide">Data Flow</span>
                            <span className="text-sm font-bold text-[#1A1D23]">Optimal</span>
                          </div>
                          <div className="p-2 bg-white rounded-lg"><Wifi size={14} className="text-emerald-500" /></div>
                        </div>
                        <div className="h-10 w-full absolute bottom-0 left-0 opacity-20">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={SPARK_DATA}>
                              <Line type="monotone" dataKey="val" stroke="#10b981" strokeWidth={2} dot={false} />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E6EA] relative overflow-hidden">
                        <div className="flex items-center justify-between mb-2 z-10 relative">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wide">System Compatibility</span>
                            <span className="text-sm font-bold text-[#1A1D23]">Checking...</span>
                          </div>
                          <div className="p-2 bg-white rounded-lg"><Activity size={14} className="text-amber-500" /></div>
                        </div>
                        <div className="h-10 w-full absolute bottom-0 left-0 opacity-20">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={SPARK_DATA}>
                              <Line type="monotone" dataKey="val" stroke="#f59e0b" strokeWidth={2} dot={false} />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: LIVE Activity Feed */}
                  <div className="flex-1 bg-white border border-[#E2E6EA] rounded-2xl shadow-sm flex flex-col max-h-[600px] overflow-hidden">
                    <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center shrink-0">
                      <span className="text-slate-500 font-semibold text-sm flex items-center gap-2">
                        <Terminal size={16} />
                        Activity Feed
                      </span>
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                      </div>
                    </div>

                    <div ref={logContainerRef} className="flex-1 overflow-y-auto p-5 space-y-4">
                      {logs.map((log) => (
                        <motion.div
                          key={log.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex gap-3 items-start"
                        >
                          <div className="mt-0.5 shrink-0">
                            {log.category === "SUCCESS" ? (
                              <div className="w-5 h-5 rounded-full bg-[#DCFCE7] border border-[#16A34A] text-[#16A34A] flex items-center justify-center">
                                <CheckCircle2 size={12} />
                              </div>
                            ) : log.category === "WARN" ? (
                              <div className="w-5 h-5 rounded-full bg-[#FFFBEB] border border-[#F59E0B] text-[#F59E0B] flex items-center justify-center">
                                <AlertCircle size={12} />
                              </div>
                            ) : (
                              <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[11px] font-bold text-[#4B5563] leading-tight">{log.message}</span>
                            <span className="text-[10px] text-[#9CA3AF] tabular-nums">{log.timestamp}</span>
                          </div>
                        </motion.div>
                      ))}
                      {logs.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400 text-sm gap-2">
                          <Loader2 size={24} className="animate-spin" />
                          Waiting for stream...
                        </div>
                      )}
                      <div className="h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ============ RESULTS STATE ============ */}
          {state === "results" && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="h-full p-8 max-w-7xl mx-auto space-y-6"
            >
              {/* Executive Summary Card */}
              <Card className="p-8 border-none shadow-xl bg-white relative overflow-hidden">
                <div className="flex items-center gap-12 relative z-10">
                  {/* Gauge */}
                  <div className="relative w-48 h-48 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="96" cy="96" r="88" stroke="#f1f5f9" strokeWidth="16" fill="none" />
                      <motion.circle
                        cx="96" cy="96" r="88"
                        stroke={ringColor}
                        strokeWidth="16"
                        fill="none"
                        strokeDasharray="552.9"
                        initial={{ strokeDashoffset: 552.9 }}
                        animate={{ strokeDashoffset: 552.9 * (1 - scores.overall / 100) }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-6xl font-bold text-[#1A1D23] tracking-tighter">{scores.overall}</span>
                      <span className="text-sm text-[#9CA3AF] font-semibold mt-1">/ 100</span>
                    </div>
                  </div>

                  {/* Text Summary */}
                  <div className="flex-1 space-y-3">
                    <div className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest flex items-center gap-1">
                      <Globe size={12} />
                      Assessment Target: <span className="text-[#4B5563]">{selectedMarket?.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <h1 className="text-3xl font-bold text-[#1A1D23]">
                        {diagnosticData?.diagnostic_run.overall_status ?? "Unknown"}
                      </h1>
                      {scores.overall >= 80 ? (
                        <CheckCircle2 size={32} className="text-[#10B981]" />
                      ) : (
                        <AlertTriangle size={32} className="text-[#F59E0B]" />
                      )}
                    </div>
                    <p className="text-sm text-[#6B7280] leading-relaxed max-w-2xl font-medium">
                      {scores.scoring_notes[0]}
                    </p>
                  </div>

                  {/* Sub Scores */}
                  <div className="w-56 space-y-4 border-l border-[#F1F3F5] pl-8">
                    {[
                      { l: "Data Quality", v: scores.data_quality, icon: <Layers size={14} /> },
                      { l: "Trade Execution", v: scores.trade_execution, icon: <Activity size={14} /> },
                      { l: "Agent Readiness", v: scores.agent_readiness, icon: <Cpu size={14} /> },
                    ].map((s) => (
                      <div key={s.l} className="space-y-1.5">
                        <div className="flex justify-between text-[11px] font-bold">
                          <span className="text-[#6B7280] flex items-center gap-1.5">{s.icon} {s.l}</span>
                          <span className="text-[#1A1D23]">{s.v}%</span>
                        </div>
                        <div className="h-2 bg-[#F1F3F5] rounded-full overflow-hidden">
                          <motion.div
                            className={cn("h-full rounded-full", s.v >= 80 ? "bg-[#10B981]" : "bg-[#F59E0B]")}
                            initial={{ width: 0 }}
                            animate={{ width: `${s.v}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Attention Required */}
                <Card className="p-8 border-none shadow-xl bg-white flex flex-col">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-[#FEE2E2] text-[#DC2626] flex items-center justify-center">
                      <ShieldAlert size={24} />
                    </div>
                    <h3 className="text-xl font-bold">Attention Required</h3>
                  </div>

                  {/* Tabs */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {([
                      { id: "DATA" as const, label: "Data Quality", icon: <Layers size={14} /> },
                      { id: "EXECUTION" as const, label: "Trade Execution", icon: <Activity size={14} /> },
                      { id: "STRATEGY" as const, label: "Agent Readiness", icon: <Cpu size={14} /> },
                    ]).map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-full transition-all border",
                          activeTab === tab.id
                            ? "bg-[#1A1D23] text-white border-[#1A1D23] shadow-md"
                            : "bg-white text-[#6B7280] border-[#E2E6EA] hover:bg-slate-50"
                        )}
                      >
                        {tab.icon}
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* List Content */}
                  <div className="flex-1 space-y-4 min-h-[300px]">
                    {tabBlockers.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-[#9CA3AF] text-sm gap-2 border border-dashed border-[#E2E6EA] rounded-xl p-8">
                        <CheckCircle2 size={32} className="text-[#DCFCE7]" />
                        No critical issues found in this category.
                      </div>
                    ) : (
                      currentBlockers.map((blocker, idx) => (
                        <div key={idx} className="p-5 border border-red-100 rounded-xl bg-[#FAFBFC] hover:shadow-md transition-shadow flex flex-col gap-3">
                          <div className="flex justify-between items-start">
                            <span className="font-bold text-[#1A1D23] text-sm">{blocker.code}</span>
                            <span className={cn(
                              "px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase",
                              blocker.severity === "High" ? "bg-red-50 text-red-600 border-red-100" :
                              blocker.severity === "Medium" ? "bg-amber-50 text-amber-600 border-amber-100" :
                              "bg-slate-50 text-slate-500 border-slate-200"
                            )}>
                              {blocker.severity} Priority
                            </span>
                          </div>
                          <div className="space-y-2">
                            <p className="text-[10px] text-[#9CA3AF] font-bold uppercase tracking-wider">Recommended Actions:</p>
                            <ul className="space-y-2">
                              {blocker.recommended_actions.map((action, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs text-[#4B5563]">
                                  <AlertCircle size={14} className="text-[#9CA3AF] shrink-0 mt-0.5" />
                                  {action}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-4 pt-4 border-t border-[#F1F3F5]">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-full hover:bg-slate-100 disabled:opacity-30 transition-colors"
                      >
                        <ChevronLeft size={20} className="text-[#6B7280]" />
                      </button>
                      <span className="text-[11px] font-bold text-[#9CA3AF] uppercase">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-full hover:bg-slate-100 disabled:opacity-30 transition-colors"
                      >
                        <ChevronRight size={20} className="text-[#6B7280]" />
                      </button>
                    </div>
                  )}
                </Card>

                {/* Right: Timeline & Remediation */}
                <div className="space-y-6">
                  {/* Estimated Resolution Time */}
                  <Card className="p-8 border-none shadow-xl bg-white">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#3B82F6] flex items-center justify-center">
                        <Clock size={24} />
                      </div>
                      <h3 className="text-xl font-bold">Estimated Resolution Time</h3>
                    </div>

                    <div className="flex items-baseline gap-2 mb-6">
                      <span className="text-5xl font-black text-[#1A1D23]">
                        {remediationData?.timeline_estimates.fast_path_weeks.split('-')[0]} - {remediationData?.timeline_estimates.conservative_weeks.split('-')[1]}
                      </span>
                      <span className="text-xl font-bold text-[#6B7280]">Weeks</span>
                      <div className="ml-auto text-right">
                        <div className="text-[11px] font-bold text-[#10B981]">Fast Path: {remediationData?.timeline_estimates.fast_path_weeks} Weeks</div>
                        <div className="text-[11px] font-bold text-[#6B7280]">Conservative: {remediationData?.timeline_estimates.conservative_weeks} Weeks</div>
                      </div>
                    </div>

                    <div className="relative pt-6">
                      <div className="absolute top-0 left-0 text-[10px] font-bold text-[#9CA3AF] uppercase">Start</div>
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 text-[10px] font-bold text-[#10B981] uppercase">Fast Path</div>
                      <div className="absolute top-0 right-0 text-[10px] font-bold text-[#9CA3AF] uppercase">Conservative</div>
                      <div className="h-4 bg-[#F1F3F5] rounded-full mt-2 overflow-hidden relative">
                        <div className="absolute inset-y-0 left-0 w-[60%] bg-[#A7F3D0]" />
                        <div className="absolute inset-y-0 left-0 w-[30%] bg-[#10B981]" />
                      </div>
                    </div>
                  </Card>

                  {/* Phased Remediation Plan */}
                  <Card className="p-8 border-none shadow-xl bg-white">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-[#FFF7ED] text-[#E67E22] flex items-center justify-center">
                        <Milestone size={24} />
                      </div>
                      <h3 className="text-xl font-bold">Phased Remediation Plan</h3>
                    </div>

                    <div className="space-y-6 relative before:absolute before:left-[9px] before:top-2 before:bottom-2 before:w-[2px] before:bg-[#F1F3F5]">
                      {(remediationData?.phases ?? []).map((phase, idx) => (
                        <div key={idx} className="relative pl-8">
                          <div className="absolute left-0 top-1.5 w-5 h-5 rounded-full border-2 border-[#E2E6EA] bg-white z-10" />
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="text-[12px] font-black text-[#1A1D23] uppercase tracking-tight">{phase.phase_name}</h5>
                            <span className="px-2 py-1 bg-[#EEF2FF] text-[#3B82F6] text-[10px] font-bold rounded uppercase shrink-0 ml-2">
                              {phase.duration_weeks} Weeks
                            </span>
                          </div>
                          <div className="space-y-1.5">
                            {phase.outcomes.map((outcome, k) => (
                              <div key={k} className="flex items-start gap-2 text-xs font-medium text-[#6B7280]">
                                <ArrowRight size={14} className="text-[#E67E22] mt-0.5 shrink-0" />
                                <p>{outcome}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-3 mt-8">
                      <Button className="flex-1 h-14 bg-[#1A1D23] hover:bg-[#000] text-white font-bold rounded-2xl shadow-xl transition-all">
                        <Share2 size={18} className="mr-2" /> Download Full Strategy PDF
                      </Button>
                      <Button
                        variant="outline"
                        className="h-14 w-14 border-[#E2E6EA] rounded-2xl flex items-center justify-center hover:bg-[#FAFBFC]"
                        onClick={handleReset}
                      >
                        <RotateCcw size={20} />
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Market Selection Modal */}
      <AnimatePresence>
        {showModal && selectedMarket && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-[#1A1D23]/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[32px] w-full max-w-lg overflow-hidden shadow-2xl relative z-10"
            >
              <div className="bg-[#1A1D23] p-12 flex flex-col items-center justify-center relative">
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-1.5 rounded-full"
                >
                  <X size={20} />
                </button>
                <div className="w-20 h-20 rounded-full border-2 border-white/20 flex items-center justify-center bg-white/5 backdrop-blur-md shadow-xl">
                  <MapPin size={32} className="text-white" />
                </div>
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
              </div>

              <div className="p-10 flex flex-col items-center text-center">
                <h3 className="text-2xl font-black text-[#1A1D23] mb-4 tracking-tight">{selectedMarket.name}</h3>

                <div className="flex gap-3 mb-10">
                  <span className="px-3 py-1 bg-[#F1F3F5] text-[#1A1D23] text-[10px] font-black uppercase rounded-lg border border-[#E2E6EA]">{selectedMarket.code}</span>
                  <span className="px-3 py-1 bg-[#F1F3F5] text-[#1A1D23] text-[10px] font-black uppercase rounded-lg border border-[#E2E6EA]">{selectedMarket.region}</span>
                  {(() => {
                    const status = getMarketStatus(selectedMarket);
                    return (
                      <span className={cn(
                        "px-3 py-1 text-[10px] font-black uppercase rounded-lg border flex items-center gap-1.5",
                        status === "active" ? "bg-[#DCFCE7] text-[#16A34A] border-[#16A34A]/20" :
                        "bg-[#FEE2E2] text-[#DC2626] border-[#DC2626]/20"
                      )}>
                        <div className={cn("w-1.5 h-1.5 rounded-full",
                          status === "active" ? "bg-[#16A34A]" : "bg-[#DC2626]"
                        )} />
                        {status}
                      </span>
                    );
                  })()}
                </div>

                {!hasMarketDiagnosticData(selectedMarket.id) && (
                  <div className="flex items-center gap-2 mb-6 px-4 py-3 bg-[#FEF3C7] border border-[#F59E0B]/20 rounded-xl text-[#92400E] text-xs font-medium">
                    <Ban size={14} className="shrink-0" />
                    Diagnostic data is not yet available for this market. Assessment will be enabled once the market integration is complete.
                  </div>
                )}

                <div className="flex w-full gap-4">
                  <Button
                    variant="outline"
                    className="flex-1 h-14 rounded-2xl border-[#E2E6EA] text-[#1A1D23] font-bold hover:bg-[#FAFBFC]"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 h-14 rounded-2xl bg-[#E67E22] hover:bg-[#D35400] text-white font-bold shadow-xl shadow-[#E67E22]/30 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                    onClick={startDiagnostic}
                    disabled={!hasMarketDiagnosticData(selectedMarket.id)}
                  >
                    Run Diagnostic <ArrowRight size={18} className="ml-2" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
