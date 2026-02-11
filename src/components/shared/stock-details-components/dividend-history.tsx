import { DividendData } from '@/types/stock-panel';
import { StockPanelAPI, TradeAnalysisAPI } from '@/lib/api/stock-panel';
import { useState, useEffect, useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface DividendHistoryProps {
    ticker: string;
}

function InfoRow({ label, value, loading = false }: { label: string; value: string; loading?: boolean }) {
    return (
        <div className="flex items-center justify-between text-[10px]">
            <span className="text-muted-foreground font-medium">{label}</span>
            {loading ? <Skeleton className="h-3 w-10" /> : <span className="font-bold tabular-nums">{value}</span>}
        </div>
    );
}

export function DividendHistory({ ticker }: DividendHistoryProps) {
    const [dividendData, setDividendData] = useState<DividendData[] | null>(null);
    const [dividendLoading, setDividendLoading] = useState(false);

    useEffect(() => {
        const fetchDividendData = async () => {
            if (!ticker) return;

            setDividendLoading(true);
            try {
                const data = await TradeAnalysisAPI.fetchDividendData({ symbol: ticker });
                console.log('Fetched dividend data:', data);
                setDividendData(data);
            } catch (error) {
                console.error('Failed to fetch dividend data:', error);
                setDividendData(null);
            } finally {
                setDividendLoading(false);
            }
        };

        fetchDividendData();
    }, [ticker]);

    const data = useMemo(() => {
        try {
            if (dividendData && dividendData.length > 0) {
                const sortedData = [...dividendData].sort((a, b) => {
                    const aDate = a.stats?.last_5_dividends?.[0]?.xd_date;
                    const bDate = b.stats?.last_5_dividends?.[0]?.xd_date;
                    if (!aDate && !bDate) return 0;
                    if (!aDate) return 1;
                    if (!bDate) return -1;
                    return new Date(bDate).getTime() - new Date(aDate).getTime();
                });
                return sortedData[0];
            }
            return null
        } catch (error) {
            console.error('Error processing dividend data:', error);
            return null;
        }
    }, [dividendData]);

    return (
        <div className="px-4 pb-2 border-b border-border shrink-0">
            {dividendLoading ? (
                <div className="py-3 border-t border-border/50">
                    <Skeleton className="h-20 w-full" />
                </div>
            ) : data ? (
                <div className="py-3 border-t border-border/50">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-foreground">Dividend History</span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-1 mb-2">
                        <InfoRow label="Dividend Yield" value={data.stats?.dividend_yield ? `${data.stats.dividend_yield.toFixed(2)}%` : 'N/A'} loading={dividendLoading} />
                        <InfoRow label="TTM Dividend" value={data.stats?.ttm_dividend ? data.stats.ttm_dividend.toFixed(2) : 'N/A'} loading={dividendLoading} />
                    </div>
                    {data.stats?.last_5_dividends && data.stats.last_5_dividends.length > 0 && (
                        <div className="mt-2">
                            <span className="text-xs font-medium text-foreground mb-1 block">Latest Dividend</span>
                            <div className="flex flex-col items-start justify-start text-xs bg-muted/50 p-2 rounded-md">
                                <span>Announced Date : {data.stats.last_5_dividends[0]?.announcement_date ? new Date(data.stats.last_5_dividends[0].announcement_date).toLocaleDateString() : 'N/A'}</span>
                                <span className="font-medium pt-1">Rate : {data.stats.last_5_dividends[0]?.rate_of_dividend ? data.stats.last_5_dividends[0].rate_of_dividend.toFixed(2) : 'N/A'}</span>
                                <span className="pt-1">XD Date : {data.stats.last_5_dividends[0]?.xd_date ? new Date(data.stats.last_5_dividends[0].xd_date).toLocaleDateString() : 'N/A'}</span>
                            </div>
                        </div>
                    )}
                </div>
            ) : null}
        </div>
    );
}