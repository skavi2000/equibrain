"use client";

import React, { useState } from "react";
import {
  Bot,
  Layers,
  Cpu,
  TrendingUp,
  Sparkles,
  Wrench,
  FlaskConical,
  Blocks
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type AgentsTab = "Investment Agents" | "Trading Agents" | "Analyst Agents" | "Create Agents";

const TAB_CONFIG: Record<AgentsTab, { icon: React.ReactNode; title: string; description: string; color: string; bgColor: string }> = {
  "Investment Agents": {
    icon: <Layers size={40} strokeWidth={1.5} />,
    title: "Investment Agents",
    description: "Autonomous investment analysis and portfolio allocation agents are being engineered. Institutional-grade tracking, risk parity models, and smart rebalancing — coming soon.",
    color: "#7C3AED",
    bgColor: "#F5F3FF",
  },
  "Trading Agents": {
    icon: <TrendingUp size={40} strokeWidth={1.5} />,
    title: "Trading Agents",
    description: "Real-time execution bots, signal generators, and automated order management systems are under active development. Expect HFT, swing, and scalp agent archetypes.",
    color: "#2563EB",
    bgColor: "#EFF6FF",
  },
  "Analyst Agents": {
    icon: <FlaskConical size={40} strokeWidth={1.5} />,
    title: "Analyst Agents",
    description: "AI-powered research analysts for fundamental screening, sentiment analysis, and macro event detection are being built. Deep financial modeling meets machine learning.",
    color: "#0891B2",
    bgColor: "#ECFEFF",
  },
  "Create Agents": {
    icon: <Blocks size={40} strokeWidth={1.5} />,
    title: "Agent Builder",
    description: "A visual workflow engine for designing custom autonomous agents from scratch — drag-and-drop triggers, conditions, and actions. Your strategy, codified.",
    color: "#D97706",
    bgColor: "#FFFBEB",
  },
};

export function AgentsModule() {
  const [activeTab, setActiveTab] = useState<AgentsTab>("Investment Agents");

  const tabs: AgentsTab[] = ["Investment Agents", "Trading Agents", "Analyst Agents", "Create Agents"];
  const config = TAB_CONFIG[activeTab];

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
              activeTab === tab ? "text-[#7C3AED]" : "text-[#6B7280] hover:text-[#1A1D23]"
            )}
          >
            {tab}
            {activeTab === tab && (
              <motion.div
                layoutId="activeAgentTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7C3AED]"
              />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center max-w-md"
          >
            {/* Animated icon container */}
            <div className="relative mb-8">
              {/* Outer pulsing ring */}
              <div
                className="absolute inset-0 rounded-full animate-ping opacity-10"
                style={{ backgroundColor: config.color }}
              />
              {/* Decorative orbit ring */}
              <motion.div
                className="absolute -inset-4 rounded-full border-2 border-dashed opacity-15"
                style={{ borderColor: config.color }}
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              {/* Main icon circle */}
              <div
                className="relative w-24 h-24 rounded-full flex items-center justify-center"
                style={{ backgroundColor: config.bgColor, color: config.color }}
              >
                {config.icon}
              </div>
              {/* Small floating badge */}
              <motion.div
                className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-white shadow-lg border border-[#E2E6EA] flex items-center justify-center"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Wrench size={14} className="text-[#9CA3AF]" />
              </motion.div>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-[#1A1D23] mb-2">{config.title}</h3>

            {/* Under Development badge */}
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#E2E6EA] bg-white shadow-sm mb-5">
              <Sparkles size={14} style={{ color: config.color }} />
              <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Under Development</span>
            </div>

            {/* Description */}
            <p className="text-sm text-[#6B7280] leading-relaxed mb-8">
              {config.description}
            </p>

            {/* Progress indicator */}
            <div className="w-full max-w-xs">
              <div className="flex justify-between text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-2">
                <span>Progress</span>
                <span>Building...</span>
              </div>
              <div className="h-1.5 bg-[#F1F3F5] rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: config.color }}
                  initial={{ width: "0%" }}
                  animate={{ width: ["0%", "65%", "45%", "65%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
