"use client";

import React, { useState } from "react";
import {
  Bell,
  History,
  Plus,
  Search,
  Calendar,
  AlertCircle,
  Settings,
  Filter,
  Trash2,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Monitor,
  Zap,
  Activity,
  List
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type AlertsTab = "Create Alerts" | "Alerts History";

export function AlertsModule() {
  const [activeTab, setActiveTab] = useState<AlertsTab>("Create Alerts");
  const [alertType, setAlertType] = useState<"Manual" | "Agent-Based">("Manual");

  const tabs: AlertsTab[] = ["Create Alerts", "Alerts History"];

  return (
    <div className="h-full flex flex-col">
      {/* Secondary Top Bar */}
      <div className="h-12 border-b border-[#E2E6EA] bg-[#F8FAFC] flex items-center px-6 gap-6 shrink-0">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "h-full px-1 flex items-center text-[12px] font-bold transition-all relative",
              activeTab === tab ? "text-[#D97706]" : "text-[#6B7280] hover:text-[#1A1D23]"
            )}
          >
            {tab}
            {activeTab === tab && (
              <motion.div
                layoutId="activeAlertsTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D97706]"
              />
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto p-6">
        <AnimatePresence mode="wait">
          {activeTab === "Create Alerts" && (
            <motion.div
              key="create"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-4xl mx-auto space-y-8"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#FEF3C7] text-[#D97706] rounded-xl flex items-center justify-center">
                  <Bell size={24} />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Configure Alert</h1>
                  <p className="text-[13px] text-[#6B7280]">Set intelligent triggers for real-time market opportunities.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <Card className="p-6 border-t-4 border-t-[#D97706]">
                    <div className="flex items-center justify-between mb-8">
                       <h3 className="text-sm font-bold">Alert Configuration</h3>
                       <div className="flex p-0.5 bg-[#F0F2F5] rounded-lg">
                        <button
                          onClick={() => setAlertType("Manual")}
                          className={cn("px-4 py-1.5 text-[10px] font-bold rounded shadow-sm transition-all", alertType === "Manual" ? "bg-white text-[#D97706]" : "text-[#6B7280]")}
                        >Manual</button>
                        <button
                          onClick={() => setAlertType("Agent-Based")}
                          className={cn("px-4 py-1.5 text-[10px] font-bold rounded shadow-sm transition-all", alertType === "Agent-Based" ? "bg-white text-[#D97706]" : "text-[#6B7280]")}
                        >Agent-Based</button>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold text-[#9CA3AF] uppercase">Trigger Conditions</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {[
                            { l: "Price Above", icon: ArrowUpRight },
                            { l: "Volume Spike", icon: Zap },
                            { l: "Order Book", icon: List },
                            { l: "Market Eye", icon: Monitor },
                            { l: "Crossing", icon: Activity },
                          ].map((c) => (
                            <button key={c.l} className="flex items-center gap-2 p-3 bg-[#F8FAFC] border border-[#E2E6EA] rounded-xl hover:border-[#D97706] group transition-all">
                              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#9CA3AF] group-hover:text-[#D97706] transition-colors">
                                <c.icon size={16} />
                              </div>
                              <span className="text-xs font-bold text-[#4B5563]">{c.l}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-[#9CA3AF] uppercase">Symbol</label>
                          <Input placeholder="Enter Symbol (e.g. AAPL)" className="h-10 bg-[#F8FAFC] border-[#E2E6EA] font-bold uppercase" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-[#9CA3AF] uppercase">Value</label>
                          <Input type="number" defaultValue="150.00" className="h-10 bg-[#F8FAFC] border-[#E2E6EA] font-bold" />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-[#9CA3AF] uppercase">Notification Message</label>
                        <Input placeholder="Custom alert message..." className="h-10 bg-[#F8FAFC] border-[#E2E6EA] text-xs font-medium" />
                      </div>

                      <div className="pt-4 border-t border-[#F0F2F5] flex justify-end gap-3">
                        <Button variant="outline" className="h-10 px-8 font-bold border-[#E2E6EA]">Discard</Button>
                        <Button className="h-10 px-8 bg-[#D97706] hover:bg-[#B45309] text-white font-bold shadow-lg shadow-[#D97706]/20">Create Alert</Button>
                      </div>
                    </div>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card className="p-5">
                    <h4 className="text-[11px] font-bold text-[#9CA3AF] uppercase mb-4">Quick Presets</h4>
                    <div className="space-y-2">
                      {[
                        "Institutional Order Flow",
                        "Dark Pool Activity",
                        "RSI Overbought (70+)",
                        "Golden Cross (50/200)",
                        "52-Week High Breakout"
                      ].map(p => (
                        <button key={p} className="w-full text-left p-3 rounded-lg border border-[#E2E6EA] text-xs font-medium hover:bg-[#FFFBEB] hover:border-[#FCD34D] transition-all flex items-center justify-between group">
                          {p} <Plus size={14} className="text-[#9CA3AF] group-hover:text-[#D97706]" />
                        </button>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "Alerts History" && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-4xl mx-auto space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold flex items-center gap-2"><History size={18} className="text-[#D97706]" /> Alerts History</h3>
                <div className="flex gap-2">
                  <div className="flex p-0.5 bg-[#F0F2F5] rounded-lg">
                    {["All", "Triggered", "Pending", "Expired"].map(s => (
                      <button key={s} className={cn("px-3 py-1 text-[10px] font-bold rounded transition-all", s === "All" ? "bg-white text-[#1A1D23] shadow-sm" : "text-[#6B7280]")}>{s}</button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { time: "14:24:05", symbol: "TSLA", condition: "Price Above 185.00", status: "Triggered", icon: ArrowUpRight, color: "#16A34A" },
                  { time: "13:12:42", symbol: "NVDA", condition: "Volume Spike > 2x Avg", status: "Triggered", icon: Zap, color: "#16A34A" },
                  { time: "11:05:18", symbol: "AAPL", condition: "RSI (14) < 30", status: "Expired", icon: Clock, color: "#9CA3AF" },
                  { time: "09:45:00", symbol: "MSFT", condition: "Institutional Buy Wall", status: "Triggered", icon: Monitor, color: "#16A34A" },
                ].map((a, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white border border-[#E2E6EA] rounded-xl hover:shadow-md transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#F8FAFC] flex items-center justify-center text-[#9CA3AF]">
                        <a.icon size={18} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-[#9CA3AF] tabular-nums">{a.time}</span>
                          <span className="bg-[#FFF7ED] text-[#D97706] text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">{a.symbol}</span>
                        </div>
                        <p className="text-sm font-bold mt-0.5 text-[#1F2937]">{a.condition}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <span className="text-[9px] font-bold uppercase tracking-wider block" style={{ color: a.color }}>{a.status}</span>
                        <span className="text-[10px] text-[#9CA3AF]">Jan 28, 2026</span>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-[#9CA3AF] hover:text-[#DC2626] hover:bg-[#FEE2E2] opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
