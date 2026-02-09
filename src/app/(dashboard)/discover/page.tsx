"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Bot,
  Bell,
  Settings,
  Search,
  Activity,
  Filter,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AgentsModule } from "@/components/discover/AgentsModule";
import { ScreenerModule } from "@/components/discover/ScreenerModule";
import { AlertsModule } from "@/components/discover/AlertsModule";
import { DiagnosticModule } from "@/components/discover/DiagnosticModule";

type DiscoverTab = "Agents" | "Screener" | "Alerts" | "Diagnostic Tool";

const TAB_MAP: Record<string, DiscoverTab> = {
  agents: "Agents",
  screener: "Screener",
  alerts: "Alerts",
  "diagnostic-tool": "Diagnostic Tool",
};

export default function DiscoverPage() {
  return (
    <Suspense fallback={<div className="h-full flex items-center justify-center bg-[#FAFBFC]"><span className="text-sm text-[#9CA3AF]">Loading...</span></div>}>
      <DiscoverContent />
    </Suspense>
  );
}

function DiscoverContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") || "agents";
  const initialTab = TAB_MAP[tabParam] || "Agents";
  const [activeTab, setActiveTab] = useState<DiscoverTab>(initialTab);

  useEffect(() => {
    const mapped = TAB_MAP[tabParam];
    if (mapped) {
      setActiveTab(mapped);
    }
  }, [tabParam]);

  const tabs: { id: DiscoverTab; icon: React.ElementType; label: string }[] = [
    { id: "Agents", icon: Bot, label: "Agents" },
    { id: "Screener", icon: Filter, label: "Screener" },
    { id: "Alerts", icon: Bell, label: "Alerts" },
    { id: "Diagnostic Tool", icon: Activity, label: "Diagnostic Tool" },
  ];

  return (
    <div className="h-full flex flex-col bg-[#FAFBFC]">
      {/* Top Navigation Bar */}
      <div className="h-14 border-b border-[#E2E6EA] bg-white flex items-center px-6 gap-8 shrink-0">
        <div className="flex h-full items-center">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "h-full px-4 flex items-center gap-2 text-[13px] font-bold transition-all relative",
                  isActive ? "text-[#2563EB]" : "text-[#6B7280] hover:text-[#1A1D23]"
                )}
              >
                <Icon size={16} />
                {tab.label}
                {isActive && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563EB]"
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="ml-auto flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#F0F2F5] px-3 py-1.5 rounded-lg border border-[#E2E6EA]">
            <Search size={14} className="text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="Search features..."
              className="bg-transparent border-none outline-none text-xs font-medium w-40"
            />
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-[#6B7280]">
            <Settings size={18} />
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {activeTab === "Agents" && <AgentsModule />}
            {activeTab === "Screener" && <ScreenerModule />}
            {activeTab === "Alerts" && <AlertsModule />}
            {activeTab === "Diagnostic Tool" && <DiagnosticModule />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
