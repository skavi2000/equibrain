"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ExternalLink,
  TrendingUp,
  Clock,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { StockPanelAPI } from '@/lib/api/stock-panel';
import { OHLCVData } from '@/types/stock-panel';
import { StockHeader } from './stock-details-components/stock-header';
import { OrderBookTab } from './stock-details-components/order-book-tab';
import { NewsTab } from './stock-details-components/news-tab';
import { CompanyDetails } from './stock-details-components/company-details';

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
  const [stockData, setStockData] = useState<OHLCVData | null>(null);

  const fetchData = useCallback(async () => {
    if (!ticker) return;

    try {
      const data = await StockPanelAPI.fetchOhlcv({ symbol: ticker });
      setStockData(data);
    } catch (error) {
      console.error('Failed to fetch stock data:', error);
    }
  }, [ticker]);

  useEffect(() => {
    // Initial fetch
    fetchData();

    // Set up interval to refresh data every minute
    const interval = setInterval(fetchData, 60000); // 60000ms = 1 minute

    // Cleanup interval on unmount or ticker change
    return () => clearInterval(interval);
  }, [fetchData]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex flex-col h-full overflow-hidden bg-card text-foreground"
    >
      {showHeader && (
        <StockHeader ticker={ticker} onClose={onClose} stockData={stockData} />
      )}
      <CompanyDetails ticker={ticker} />
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
        {activeMainTab === "Order Book" && <OrderBookTab ticker={ticker} />}
        {activeMainTab === "News" && <NewsTab ticker={ticker} />}
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
