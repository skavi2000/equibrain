import { cn } from "@/lib/utils";
import { ChartCandlePatternsData } from '@/types/stock-panel';
import { StockPanelAPI } from '@/lib/api/stock-panel';
import { useState, useEffect } from 'react';
import { Skeleton } from "@/components/ui/skeleton";

interface PatternAnalysisProps {
    ticker: string;
}

function InfoRow({ label, value, color = "text-foreground", loading = false }: { label: string; value: string; color?: string; loading?: boolean }) {
    return (
        <div className="flex items-center justify-between text-[10px]">
            <span className="text-muted-foreground font-medium">{label}</span>
            {loading ? <div className="h-3 w-10 bg-muted animate-pulse rounded" /> : <span className={cn("font-bold tabular-nums", color)}>{value}</span>}
        </div>
    );
}

export function PatternAnalysis({ ticker }: PatternAnalysisProps) {
    const [candlePatterns, setCandlePatterns] = useState<ChartCandlePatternsData | null>(null);
    const [candlePatternsLoading, setCandlePatternsLoading] = useState(false);

    useEffect(() => {
        const fetchCandlePatterns = async () => {
            if (!ticker) return;

            setCandlePatternsLoading(true);
            try {
                const data = await StockPanelAPI.fetchChartCandlePatterns({ symbol: ticker });
                console.log('Fetched candle patterns:', data);
                console.log('Chart pattern keys:', Object.keys(data?.chart_pattern || {}));
                console.log('Candlestick pattern keys:', Object.keys(data?.candlestick_pattern || {}));
                setCandlePatterns(data);
            } catch (error) {
                console.error('Failed to fetch candle patterns:', error);
                setCandlePatterns(null);
            } finally {
                setCandlePatternsLoading(false);
            }
        };

        fetchCandlePatterns();
    }, [ticker]);

    return (
        <div className="px-4 pb-2 border-b border-border shrink-0">
            {candlePatternsLoading ? (
                <div className="py-3 border-t border-border/50">
                    <Skeleton className="h-20 w-full" />
                </div>
            ) : candlePatterns && (Object.keys(candlePatterns.chart_pattern).length > 0 || (candlePatterns.candlestick_pattern && Object.keys(candlePatterns.candlestick_pattern).length > 0)) ? (
                <div className="py-3 border-t border-border/50">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-foreground">Pattern Analysis</span>
                        <span className="text-xs text-muted-foreground">{candlePatterns.analysis_date}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-1 mb-2">
                        <InfoRow label="Sentiment" value={candlePatterns.overall_sentiment} color={candlePatterns.overall_sentiment === 'Bearish' ? 'text-loss' : 'text-gain'} loading={candlePatternsLoading} />
                        <InfoRow label="Current Price" value={candlePatterns.current_price?.toFixed(2) || 'N/A'} loading={candlePatternsLoading} />
                        <InfoRow label="Entry Price" value={candlePatterns.entry_price?.toFixed(2) || 'N/A'} loading={candlePatternsLoading} />
                        <InfoRow label="Stop Loss" value={candlePatterns.stop_loss?.toFixed(2) || 'N/A'} color="text-loss" loading={candlePatternsLoading} />
                        <InfoRow label="Target Price" value={candlePatterns.target_price?.toFixed(2) || 'N/A'} color="text-gain" loading={candlePatternsLoading} />
                    </div>
                    {candlePatterns.candlestick_pattern && Object.keys(candlePatterns.candlestick_pattern).length > 0 && (
                        <div className="mt-2 p-2 bg-muted/50 rounded-md mb-1">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-medium">{candlePatterns.candlestick_pattern.pattern_name} ( Candlestick )</span>
                                <span className={cn("text-xs font-bold", candlePatterns.candlestick_pattern.direction === 'Bearish' ? 'text-loss' : 'text-gain')}>
                                    {candlePatterns.candlestick_pattern.direction}
                                </span>
                            </div>
                            {/* <p className="text-xs text-muted-foreground mb-1">{candlePatterns.candlestick_pattern.rationale}</p> */}
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                                <span>Confidence: {candlePatterns.candlestick_pattern.signal_confidence}%</span>
                                <span>Action: {candlePatterns.candlestick_pattern.suggested_action}</span>
                                <span>Hit Rate: {(candlePatterns.candlestick_pattern.backtest_hit_rate * 100).toFixed(1)}%</span>
                                <span>Occurrences: {candlePatterns.candlestick_pattern.backtest_occurrences}</span>
                            </div>
                        </div>
                    )}
                    {candlePatterns.chart_pattern && Object.keys(candlePatterns.chart_pattern).length > 0 && candlePatterns.chart_pattern.pattern_name && (
                        <div className="mt-2 p-2 bg-muted/50 rounded-md">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-medium">{candlePatterns.chart_pattern.pattern_name}</span>
                                <span className={cn("text-xs font-bold", candlePatterns.chart_pattern.direction === 'Bearish' ? 'text-loss' : 'text-gain')}>
                                    {candlePatterns.chart_pattern.direction}
                                </span>
                            </div>
                            {/* <p className="text-xs text-muted-foreground mb-1">{candlePatterns.chart_pattern.rationale}</p> */}
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                                <span>Confidence: {candlePatterns.chart_pattern.signal_confidence}%</span>
                                <span>Action: {candlePatterns.chart_pattern.suggested_action}</span>
                                <span>Hit Rate: {candlePatterns.chart_pattern.backtest_hit_rate ? (candlePatterns.chart_pattern.backtest_hit_rate * 100).toFixed(1) : 'N/A'}%</span>
                                <span>Occurrences: {candlePatterns.chart_pattern.backtest_occurrences}</span>
                            </div>
                        </div>
                    )}
                    {/* <div className="mt-2 text-xs text-muted-foreground">
                        <p>{candlePatterns.recommended_action}</p>
                    </div> */}
                </div>
            ) : null}
        </div>
    );
}