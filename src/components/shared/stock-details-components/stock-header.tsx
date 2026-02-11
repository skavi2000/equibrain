import { ArrowLeft, Heart, Bell, Sparkles, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { OHLCVData, AnalysisData } from '@/types/stock-panel';
import { Skeleton } from '@/components/ui/skeleton';
import { StockPanelAPI } from '@/lib/api/stock-panel';
import { useState, useEffect } from 'react';
import { PatternAnalysis } from './pattern-analysis';
import { DividendHistory } from './dividend-history';

interface StockHeaderProps {
    ticker: string;
    onClose?: () => void;
    stockData: OHLCVData | null;
}

function InfoRow({ label, value, color = "text-foreground", loading = false }: { label: string; value: string; color?: string; loading?: boolean }) {
    return (
        <div className="flex items-center justify-between text-[10px]">
            <span className="text-muted-foreground font-medium">{label}</span>
            {loading ? <Skeleton className="h-3 w-10" /> : <span className={cn("font-bold tabular-nums", color)}>{value}</span>}
        </div>
    );
}

export function StockHeader({ ticker, onClose, stockData }: StockHeaderProps) {
    const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
    const [analysisLoading, setAnalysisLoading] = useState(false);

    useEffect(() => {
        const fetchAnalysisData = async () => {
            if (!ticker) return;

            setAnalysisLoading(true);
            try {
                const data = await StockPanelAPI.fetchAnalysisData({ symbol: ticker });
                setAnalysisData(data);
            } catch (error) {
                console.error('Failed to fetch analysis data:', error);
                setAnalysisData(null);
            } finally {
                setAnalysisLoading(false);
            }
        };

        fetchAnalysisData();
    }, [ticker]);
    return (
        <div className="px-4 pt-4 pb-2 border-b border-border shrink-0">
            <div className="flex items-center justify-between mb-2">
                <ArrowLeft
                    size={18}
                    className="text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                    onClick={onClose}
                />
                <div className="flex items-center gap-4">
                    <Heart size={18} className="text-muted-foreground cursor-pointer hover:text-loss transition-colors" />
                    <div className="w-8 h-8 flex items-center justify-center opacity-0 pointer-events-none">
                        <Bell size={18} />
                    </div>
                </div>
            </div>
            <div className="flex items-baseline gap-2 mb-1">
                <h2 className="text-2xl font-bold tracking-tight">{ticker}</h2>
                <span className="text-sm text-muted-foreground font-medium truncate">Institutional Analysis Feed</span>
            </div>
            <div className="flex items-center gap-4 mb-2">
                {stockData ? <span className="text-4xl font-bold text-gain tabular-nums tracking-tighter">{stockData.close.toFixed(2)}</span> : <Skeleton className="h-10 w-24" />}
                <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                        {stockData ? (
                            stockData.change >= 0 ? (
                                <TrendingUp size={16} className="text-gain" />
                            ) : (
                                <TrendingDown size={16} className="text-loss" />
                            )
                        ) : (
                            <Skeleton className="h-4 w-4" />
                        )}
                        {stockData ? <span className={cn("text-sm font-bold", stockData.change >= 0 ? "text-gain" : "text-loss")}>{stockData.change > 0 ? '+' : ''}{stockData.change.toFixed(2)}</span> : <Skeleton className="h-4 w-12" />}
                        {stockData ? <span className={cn("text-sm font-bold", stockData.change_pct >= 0 ? "text-gain" : "text-loss")}>{stockData.change_pct > 0 ? '+' : ''}{(stockData.change_pct).toFixed(2)}%</span> : <Skeleton className="h-4 w-10" />}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                            {stockData ? <span className="bg-primary px-1 rounded-[2px] text-[8px] text-white font-bold uppercase">{stockData.market}</span> : <Skeleton className="h-3 w-8" />}
                            <Sparkles size={10} className="text-primary" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-1 py-3 border-t border-border/50">
                <InfoRow label="High" value={stockData?.high.toFixed(2) || ''} color="text-gain" loading={!stockData} />
                <InfoRow label="Low" value={stockData?.low.toFixed(2) || ''} color="text-loss" loading={!stockData} />
                <InfoRow label="Open" value={stockData?.open.toFixed(2) || ''} loading={!stockData} />
                <InfoRow label="Prev Close" value={stockData?.prev_close.toFixed(2) || ''} loading={!stockData} />
                <InfoRow label="Volume" value={stockData?.volume.toString() || ''} loading={!stockData} />
                <InfoRow label="Turnover" value={analysisData?.data[0]?.turnover ? parseFloat(analysisData.data[0].turnover).toFixed(0) : ''} loading={analysisLoading} />
            </div>
            <div className="grid grid-cols-1 gap-x-8 gap-y-1 py-3 border-t border-border/50">
                <InfoRow
                    label="RSI"
                    value={analysisData?.data[0]?.rsi || ''}
                    color={(() => { const rsi = parseFloat(analysisData?.data[0]?.rsi || '0'); return rsi >= 30 && rsi <= 70 ? 'text-gain' : 'text-loss'; })()}
                    loading={analysisLoading}
                />
                <InfoRow
                    label="Divergence"
                    value={analysisData?.data[0]?.rsi_divergence || ''}
                    color={analysisData?.data[0]?.rsi_divergence?.includes('No') ? 'text-loss' : 'text-gain'}
                    loading={analysisLoading}
                />
                <InfoRow
                    label="Volume Analysis"
                    value={analysisData?.data[0]?.volume_analysis || ''}
                    loading={analysisLoading}
                />
            </div>
        </div>
    );
}