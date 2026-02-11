import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatNumber } from "@/lib/utils";
import { StockPanelAPI } from '@/lib/api/stock-panel';
import { CompanyData } from '@/types/stock-panel';


function InfoRow({ label, value, color = "text-foreground", loading = false }: { label: string; value: string; color?: string; loading?: boolean }) {
    return (
        <div className="flex items-center justify-between text-[10px]">
            <span className="text-muted-foreground font-medium">{label}</span>
            {loading ? <Skeleton className="h-3 w-10" /> : <span className={cn("font-bold tabular-nums", color)}>{value}</span>}
        </div>
    );
}

export function CompanyDetails({ ticker }: { ticker: string }) {
    const [companyData, setCompanyData] = useState<CompanyData | null>(null);
    const [companyLoading, setCompanyLoading] = useState(false);

    useEffect(() => {
        const fetchCompanyData = async () => {
            if (!ticker) return;

            setCompanyLoading(true);
            try {
                const data = await StockPanelAPI.fetchCompanyInfo({ symbol: ticker });
                setCompanyData(data);
            } catch (error) {
                console.error('Failed to fetch company data:', error);
                setCompanyData(null);
            } finally {
                setCompanyLoading(false);
            }
        };

        fetchCompanyData();
    }, [ticker]);

    return (
        <div className="px-4 pb-2 shrink-0">
            <div className="grid grid-cols-2 gap-x-8 gap-y-1 py-3 ">
                <InfoRow
                    label="Sector"
                    value={companyData?.basic_info.sector || ''}
                    loading={companyLoading}
                />
                {/* <InfoRow
                    label="Dividend Yield"
                    value={companyData?.financial_metrics.dividend_yield ? `${companyData.financial_metrics.dividend_yield}%` : ''}
                    loading={companyLoading}
                /> */}
                <InfoRow
                    label="Market Cap"
                    value={companyData?.basic_info.market_cap_millions ? formatNumber(companyData.basic_info.market_cap_millions) : ''}
                    loading={companyLoading}
                />
                <InfoRow
                    label="Issued Quantity"
                    value={companyData?.basic_info.issued_qty_mn ? formatNumber(companyData.basic_info.issued_qty_mn) : ''}
                    loading={companyLoading}
                />
                <InfoRow
                    label="ROA"
                    value={companyData?.financial_metrics.return_on_assets ? `${companyData.financial_metrics.return_on_assets}%` : ''}
                    loading={companyLoading}
                />
                <InfoRow
                    label="ROE"
                    value={companyData?.financial_metrics.return_on_equity ? `${companyData.financial_metrics.return_on_equity}%` : ''}
                    loading={companyLoading}
                />
                <InfoRow
                    label="P/E Ratio"
                    value={companyData?.calculated_metrics.per_ratio ? companyData.calculated_metrics.per_ratio.toFixed(2) : ''}
                    loading={companyLoading}
                />
                <InfoRow
                    label="P/B Ratio"
                    value={companyData?.calculated_metrics.pbv_ratio ? companyData.calculated_metrics.pbv_ratio.toFixed(2) : ''}
                    loading={companyLoading}
                />
            </div>
        </div>
    );
}