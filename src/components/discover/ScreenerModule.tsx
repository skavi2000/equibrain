"use client";

import React, { useState } from "react";
import {
  Filter,
  Plus,
  Search,
  Play,
  Settings,
  Trash2,
  ChevronRight,
  FileText,
  Download,
  LayoutGrid,
  List,
  Save,
  RotateCcw,
  PlusCircle,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type ScreenerTab = "Create Screen" | "View Screen";

export function ScreenerModule() {
  const [activeTab, setActiveTab] = useState<ScreenerTab>("Create Screen");
  const [selectedMarket, setSelectedMarket] = useState("United States");
  const [filters, setFilters] = useState([
    { id: 1, field: "Exchange", operator: "IN", value: "NYSE, AMEX, Nasdaq" },
    { id: 2, field: "Volume", operator: "Intraday Today", value: "10000 - 1000000" },
    { id: 3, field: "Free Float", operator: "Between", value: "1000 - 20000" }
  ]);

  const tabs: ScreenerTab[] = ["Create Screen", "View Screen"];

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
              activeTab === tab ? "text-[#2563EB]" : "text-[#6B7280] hover:text-[#1A1D23]"
            )}
          >
            {tab}
            {activeTab === tab && (
              <motion.div
                layoutId="activeScreenerTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563EB]"
              />
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar for Screener */}
        <div className="w-64 border-r border-[#E2E6EA] bg-white flex flex-col">
          <div className="p-4 border-b border-[#E2E6EA]">
             <div className="flex p-0.5 bg-[#F0F2F5] rounded-lg">
                <button className="flex-1 py-1 text-[10px] font-bold bg-white text-[#1A1D23] rounded shadow-sm">Stocks</button>
                <button className="flex-1 py-1 text-[10px] font-bold text-[#6B7280]">Options</button>
             </div>
             <Button className="w-full mt-4 h-9 bg-white border border-[#E2E6EA] text-[#1A1D23] hover:bg-[#F8FAFC] font-bold text-xs shadow-none">
               <Plus size={14} className="mr-2" /> New Screener
             </Button>
          </div>
          <div className="flex-1 overflow-auto p-2 space-y-1">
            {[
              "High-Activity Trading Stocks",
              "Day Trade",
              "High Profits",
              "Growth Over 20%",
              "Oversold RSI"
            ].map(s => (
              <button
                key={s}
                className={cn(
                  "w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium transition-all",
                  s === "Day Trade" ? "bg-[#F0F4FF] text-[#2563EB] font-bold" : "text-[#6B7280] hover:bg-[#F8FAFC]"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Main Workspace */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          <div className="h-14 border-b border-[#E2E6EA] px-6 flex items-center justify-between shrink-0">
            <h2 className="text-sm font-bold">Day Trade</h2>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-[#6B7280]"><Save size={16} /></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-[#6B7280]"><Download size={16} /></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-[#6B7280]"><RotateCcw size={16} /></Button>
              <div className="w-[1px] h-4 bg-[#E2E6EA] mx-1" />
              <Button variant="ghost" size="icon" className="h-8 w-8 text-[#6B7280]"><Settings size={16} /></Button>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-6 space-y-8">
            {/* Filter Section */}
            <div className="space-y-4">
               <div className="flex items-center gap-8">
                 <div className="flex items-center gap-2">
                   <span className="text-[11px] font-bold text-[#6B7280]">Market</span>
                   <select
                     className="bg-[#F0F2F5] border-none rounded-md px-2 py-1 text-[11px] font-bold outline-none"
                     value={selectedMarket}
                     onChange={(e) => setSelectedMarket(e.target.value)}
                   >
                     <option>United States</option>
                     <option>Hong Kong</option>
                     <option>China</option>
                   </select>
                 </div>
                 <label className="flex items-center gap-2 cursor-pointer">
                   <input type="checkbox" className="w-3.5 h-3.5 border-[#E2E6EA] rounded accent-[#2563EB]" />
                   <span className="text-[11px] font-bold text-[#6B7280]">Watchlists Only</span>
                 </label>
               </div>

               <div className="space-y-3">
                 {filters.map((f) => (
                   <div key={f.id} className="flex items-center gap-4 animate-in fade-in slide-in-from-left-2 duration-300">
                     <div className="w-6 flex justify-center">
                        <button className="text-[#9CA3AF] hover:text-[#DC2626]"><Trash2 size={14} /></button>
                     </div>
                     <div className="w-32">
                       <div className="bg-[#F8FAFC] border border-[#E2E6EA] rounded-md px-3 py-1.5 text-[11px] font-bold">
                         {f.field}
                       </div>
                     </div>
                     <div className="w-40">
                        <div className="bg-[#F0F2F5] border border-transparent rounded-md px-3 py-1.5 text-[11px] font-medium flex justify-between items-center cursor-pointer">
                          {f.operator}
                          <ChevronRight size={12} className="rotate-90 text-[#9CA3AF]" />
                        </div>
                     </div>
                     <div className="flex-1">
                        <Input
                          defaultValue={f.value}
                          className="h-8 bg-[#F0F2F5] border-transparent text-[11px] font-bold"
                        />
                     </div>
                   </div>
                 ))}

                 <button className="flex items-center gap-2 text-[#2563EB] text-[11px] font-bold ml-10 hover:underline mt-2">
                   <PlusCircle size={14} /> Add Filter
                 </button>
               </div>
            </div>

            {/* Results Section */}
            <div className="space-y-4 pt-6 border-t border-[#E2E6EA]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-[#1A1D23]">19 matches found</span>
                  <div className="flex p-0.5 bg-[#F0F2F5] rounded-md">
                    <button className="p-1 bg-white text-[#1A1D23] rounded shadow-sm"><List size={14} /></button>
                    <button className="p-1 text-[#6B7280]"><LayoutGrid size={14} /></button>
                  </div>
                </div>
                <div className="flex gap-2">
                   <Button variant="ghost" size="sm" className="h-8 text-[11px] font-bold">Columns</Button>
                   <Button variant="ghost" size="sm" className="h-8 text-[11px] font-bold text-[#2563EB]">Run Screen</Button>
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-[#E2E6EA]">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#F8FAFC] border-b border-[#E2E6EA]">
                    <tr>
                      <th className="px-4 py-3 text-[10px] font-bold text-[#9CA3AF] uppercase">Symbol</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-[#9CA3AF] uppercase">Name</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-[#9CA3AF] uppercase text-right">Price</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-[#9CA3AF] uppercase text-right">Chg</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-[#9CA3AF] uppercase text-right">% Chg</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-[#9CA3AF] uppercase text-right">Mkt Cap</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-[#9CA3AF] uppercase text-right">Volume</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0F2F5]">
                    {[
                      { s: "MRNO", n: "Murano Global Inv", p: 1.510, c: 0.35, pc: 30.17, m: "119.7M", v: "15.8M" },
                      { s: "FUSE", n: "Fusemachines", p: 2.700, c: 1.12, pc: 70.89, m: "78.1M", v: "198.0M" },
                      { s: "KXIN", n: "Kaixin Holdings", p: 1.180, c: -0.02, pc: -1.67, m: "29.2M", v: "13.1M" },
                      { s: "FATN", n: "FatPipe", p: 1.840, c: 0.06, pc: 3.37, m: "25.6M", v: "16.2M" },
                      { s: "SWVL", n: "Swvl Holdings", p: 2.140, c: 0.33, pc: 18.23, m: "21.3M", v: "43.0M" },
                    ].map((stock) => (
                      <tr key={stock.s} className="hover:bg-[#F9FBFF] group transition-colors cursor-pointer">
                        <td className="px-4 py-3 font-bold text-xs text-[#2563EB]">{stock.s}</td>
                        <td className="px-4 py-3 text-xs text-[#6B7280]">{stock.n}</td>
                        <td className="px-4 py-3 text-xs font-bold text-right tabular-nums">{stock.p.toFixed(3)}</td>
                        <td className={cn("px-4 py-3 text-xs font-bold text-right tabular-nums", stock.c >= 0 ? "text-[#16A34A]" : "text-[#DC2626]")}>
                          {stock.c >= 0 ? "+" : ""}{stock.c.toFixed(2)}
                        </td>
                        <td className={cn("px-4 py-3 text-xs font-bold text-right tabular-nums", stock.pc >= 0 ? "text-[#16A34A]" : "text-[#DC2626]")}>
                          {stock.pc >= 0 ? "+" : ""}{stock.pc.toFixed(2)}%
                        </td>
                        <td className="px-4 py-3 text-xs text-[#6B7280] text-right">{stock.m}</td>
                        <td className="px-4 py-3 text-xs text-[#6B7280] text-right">{stock.v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
