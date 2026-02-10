"use client";

import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import {
    ShieldCheck,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
} from "recharts";
import * as LightweightCharts from "lightweight-charts";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { OrderBookAPI, StockPanelAPI } from "@/lib/api/stock-panel";
import { NotificationMgrAPI } from "@/lib/api/notification-mgr";
import { PreparedTradesResponse, TradeOverview, ScenarioFlags, OHLCVDailyData, VolumeByDateData } from "@/types/stock-panel";
import { Alert } from "@/types/notification-mgr";

export function OrderBookTab({ ticker }: { ticker: string }) {
    const [tradesData, setTradesData] = useState<PreparedTradesResponse | null>(null);
    const [tradeOverview, setTradeOverview] = useState<TradeOverview | null>(null);
    const [scenarioFlags, setScenarioFlags] = useState<ScenarioFlags | null>(null);
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [ohlcvData, setOhlcvData] = useState<OHLCVDailyData[]>([]);
    const [volumeByDateData, setVolumeByDateData] = useState<Array<{ date: string; buy: number; sell: number }>>([]);

    const fetchData = useCallback(async () => {
        if (!ticker) return;

        try {
            const [trades, overview, flags, alertsData, ohlcv, volumeByDate] = await Promise.all([
                OrderBookAPI.fetchTodayTrades({ symbol: ticker }),
                StockPanelAPI.fetchTradeOverview({ symbol: ticker }),
                StockPanelAPI.fetchScenarioFlags({ symbol: ticker }),
                NotificationMgrAPI.fetchOrderBookAlertData({ symbol: ticker }),
                StockPanelAPI.fetchOHLCVForNDays({ symbol: ticker, days: 50 }),
                StockPanelAPI.fetchVolumeByDate({ symbol: ticker, limit: 15 })
            ]);
            setTradesData(trades);
            setTradeOverview(overview);
            setScenarioFlags(flags);
            setAlerts(alertsData.alerts);
            setOhlcvData(ohlcv);
            // Format volume by date data for the chart (convert 'day' to 'date')
            setVolumeByDateData(volumeByDate.map(item => ({
                date: item.day,
                buy: item.buy,
                sell: item.sell
            })));
        } catch (error) {
            console.error('Failed to fetch data:', error);
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

    const { inflow, outflow, buyPercent, sellPercent } = useMemo(() => {
        if (!tradesData) return { inflow: 0, outflow: 0, buyPercent: 0, sellPercent: 0 };
        const inflow = tradesData.prepared_trades.reduce((sum, trade) => sum + (trade.side === 'buy' ? trade.qty : 0), 0);
        const outflow = tradesData.prepared_trades.reduce((sum, trade) => sum + (trade.side === 'sell' ? trade.qty : 0), 0);
        const total = inflow + outflow;
        const buyPercent = total > 0 ? (inflow / total) * 100 : 0;
        const sellPercent = total > 0 ? (outflow / total) * 100 : 0;
        return { inflow, outflow, buyPercent, sellPercent };
    }, [tradesData]);

    const volumeByPrice = useMemo(() => {
        if (!tradesData) return [];
        const priceMap = new Map<number, { buy: number; sell: number }>();
        tradesData.prepared_trades.forEach(trade => {
            const price = trade.price;
            if (!priceMap.has(price)) {
                priceMap.set(price, { buy: 0, sell: 0 });
            }
            const entry = priceMap.get(price)!;
            if (trade.side === 'buy') {
                entry.buy += trade.qty;
            } else {
                entry.sell += trade.qty;
            }
        });
        return Array.from(priceMap.entries()).map(([price, { buy, sell }]) => ({ price, buy, sell })).sort((a, b) => a.price - b.price);
    }, [tradesData]);

    const tradeOverviewData = useMemo(() => {
        if (!tradeOverview) return [];
        return [
            { name: "XL Inflow", value: tradeOverview.inflow.XL / 1000, color: "#16A34A" },
            { name: "L Inflow", value: tradeOverview.inflow.L / 1000, color: "#16A34A" },
            { name: "M Inflow", value: tradeOverview.inflow.M / 1000, color: "#16A34A" },
            { name: "S Inflow", value: tradeOverview.inflow.S / 1000, color: "#16A34A" },
            { name: "XL Outflow", value: tradeOverview.outflow.XL / 1000, color: "#DC2626" },
            { name: "L Outflow", value: tradeOverview.outflow.L / 1000, color: "#DC2626" },
            { name: "M Outflow", value: tradeOverview.outflow.M / 1000, color: "#DC2626" },
            { name: "S Outflow", value: tradeOverview.outflow.S / 1000, color: "#DC2626" },
        ];
    }, [tradeOverview]);

    const flagsArray = useMemo(() => {
        if (!scenarioFlags) return [];
        return [
            { name: 'Hidden Liquidity Bid', value: scenarioFlags.hidden_liquidity_bid },
            { name: 'Hidden Liquidity Ask', value: scenarioFlags.hidden_liquidity_ask },
            { name: 'Crossings Today', value: scenarioFlags.crossings_occurred_today },
            { name: 'Demand Imbalance Bid', value: scenarioFlags.demand_supply_imbalance_bid },
            { name: 'Demand Imbalance Ask', value: scenarioFlags.demand_supply_imbalance_ask },
            { name: 'Supply & Demand Ask', value: scenarioFlags.supply_and_demand_ask },
            { name: 'Supply & Demand Bid', value: scenarioFlags.supply_and_demand_bid },
        ];
    }, [scenarioFlags]);

    const formatVolume = (vol: number) => {
        const abs = Math.abs(vol);
        let formatted;
        if (abs >= 1e6) formatted = `${(abs / 1e6).toFixed(2)}M`;
        else if (abs >= 1e3) formatted = `${(abs / 1e3).toFixed(2)}k`;
        else formatted = abs.toString();
        return vol < 0 ? `-${formatted}` : formatted;
    };

    return (
        <div className="p-4 space-y-4 pb-10">
            <div className="mb-4 rounded-xl overflow-hidden border border-border bg-background relative pt-10 pb-2 px-2 shadow-sm">
                <div className="absolute top-3 left-4 text-[10px] font-bold text-muted-foreground z-10 uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    PRICE (LKR)
                </div>
                <div className="h-50 w-full relative">
                    <TradingViewWidget data={ohlcvData} />
                </div>
            </div>

            <Card className="p-4 border border-border bg-secondary/10">
                <h3 className="text-sm font-bold mb-3">
                    Tradebook (Today)
                </h3>
                <div className="flex h-5 rounded-full overflow-hidden mb-3 border border-border/50">
                    <div className="bg-gain flex items-center justify-center text-white text-[10px] font-bold" style={{ width: `${buyPercent}%` }}>{Math.round(buyPercent)}%</div>
                    <div className="bg-loss flex items-center justify-center text-white text-[10px] font-bold" style={{ width: `${sellPercent}%` }}>{Math.round(sellPercent)}%</div>
                </div>
                <div className="flex items-center justify-center gap-2 text-[11px] font-bold">
                    <span className="text-gain">INFLOW: {formatVolume(inflow)}</span>
                    <span className="text-muted-foreground">|</span>
                    <span className="text-loss">OUTFLOW: {formatVolume(outflow)}</span>
                </div>
            </Card>

            <Card className="p-4 border border-border bg-secondary/10">
                <h3 className="text-sm font-bold mb-3">Latest 10 trades</h3>
                <div className="space-y-1">
                    {tradesData?.prepared_trades.slice(0, 10).map((trade, i) => {
                        const time = new Date(trade.ts).toLocaleTimeString('en-US', { hour12: false });
                        return (
                            <div key={i} className="flex items-center justify-between text-[11px] py-2 px-2 bg-card rounded-md border border-border/30">
                                <span className="text-muted-foreground w-16">{time}</span>
                                <span className="font-bold w-12 text-center">{trade.price.toString()}</span>
                                <span className="font-bold flex-1 text-center">{trade.qty.toLocaleString()}</span>
                                <span className={cn("font-bold w-10 text-right", trade.side === "buy" ? "text-gain" : "text-loss")}>{trade.side.toUpperCase()}</span>
                            </div>
                        );
                    })}
                </div>
            </Card>

            <Card className="p-4 border border-border bg-secondary/10">
                <h3 className="text-sm font-bold mb-3">Volume by price</h3>
                <div className="h-50 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={volumeByPrice}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                            <XAxis dataKey="price" fontSize={9} tickLine={false} axisLine={false} />
                            <YAxis fontSize={9} tickLine={false} axisLine={false} width={35} tickFormatter={formatVolume} />
                            <Bar dataKey="buy" fill="var(--gain)" stackId="a" />
                            <Bar dataKey="sell" fill="var(--loss)" stackId="a" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            <Card className="p-5 border border-border bg-card rounded-2xl shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-foreground">Trade Overview</h3>
                    {/* <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Unit:K</span> */}
                </div>
                <div className="flex items-center gap-2 mb-8">
                    <span className="text-xs font-medium text-muted-foreground">Net Inflow:</span>
                    <span className={cn("text-sm font-bold", tradeOverview && tradeOverview.values.netflow < 0 ? "text-loss" : "text-gain")}>{tradeOverview ? formatVolume(tradeOverview.values.netflow) : '0'}</span>
                </div>
                <div className="flex flex-col items-center mb-8">
                    <div className="h-44 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={tradeOverviewData} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={2} dataKey="value" stroke="none">
                                    {tradeOverviewData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="w-full space-y-3 mt-6">
                        <TradeBar label="XL" inflow={tradeOverview ? tradeOverview.inflow.XL : 0} outflow={tradeOverview ? tradeOverview.outflow.XL : 0} formatVolume={formatVolume} />
                        <TradeBar label="L" inflow={tradeOverview ? tradeOverview.inflow.L : 0} outflow={tradeOverview ? tradeOverview.outflow.L : 0} formatVolume={formatVolume} />
                        <TradeBar label="M" inflow={tradeOverview ? tradeOverview.inflow.M : 0} outflow={tradeOverview ? tradeOverview.outflow.M : 0} formatVolume={formatVolume} />
                        <TradeBar label="S" inflow={tradeOverview ? tradeOverview.inflow.S : 0} outflow={tradeOverview ? tradeOverview.outflow.S : 0} formatVolume={formatVolume} />
                    </div>
                </div>
            </Card>


            {volumeByDateData.length > 0 && (
                <Card className="p-4 border border-border bg-secondary/10">
                    <h3 className="text-sm font-bold mb-3">Volume by date</h3>
                    <div className="h-45 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={volumeByDateData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                                <XAxis dataKey="date" fontSize={9} tickLine={false} axisLine={false} />
                                <Bar dataKey="buy" fill="var(--gain)" stackId="a" />
                                <Bar dataKey="sell" fill="var(--loss)" stackId="a" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            )}

            <Card className="p-4 border border-border bg-secondary/10">
                <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                    <ShieldCheck size={16} className="text-primary" />
                    Scenario Flags
                </h3>
                <div className="grid grid-cols-3 gap-2">
                    {flagsArray.map((flag, index) => (
                        <div key={index} className="flex flex-col items-center gap-1.5 p-3 bg-card rounded-xl border border-border/50 shadow-sm">
                            <span className="text-[10px] font-bold text-muted-foreground text-center leading-tight">{flag.name}</span>
                            <div className={cn("w-5 h-5 rounded-full flex items-center justify-center transition-all shadow-inner", flag.value ? "bg-gain-bg text-gain" : "bg-secondary text-muted-foreground/30")}>
                                {flag.value ? <CheckCircle2 size={12} /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            <Card className="p-4 border border-border bg-secondary/10">
                <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                    <AlertCircle size={16} className="text-primary" />
                    Order Book Alerts
                </h3>
                <div className="space-y-2">
                    {alerts.length === 0 ? (
                        <div className="text-[10px] text-muted-foreground text-center py-4">
                            No alerts
                        </div>
                    ) : (
                        alerts.map((alert) => (
                            <div key={alert.id} className="p-2 bg-card rounded border border-border/50">
                                <div className="flex justify-between items-start">
                                    <span className="text-xs font-bold">{alert.message}</span>
                                    <span className={`text-xs px-2 py-1 rounded ${alert.severity === 'warning' ? 'bg-loss-bg text-loss' : 'bg-secondary text-muted-foreground'}`}>
                                        {alert.severity}
                                    </span>
                                </div>
                                <div className="text-[10px] text-muted-foreground mt-1">
                                    {new Date(alert.timestamp).toLocaleString()}
                                </div>
                                {alert.data && (
                                    <div className="text-[10px] mt-1">
                                        {alert.data.total_bids !== undefined ? `Total bids: ${alert.data.total_bids.toLocaleString()}, Visible: ${alert.data.visible_bids?.toLocaleString()}` : `Total asks: ${alert.data.total_asks?.toLocaleString()}, Visible: ${alert.data.visible_asks?.toLocaleString()}`}
                                        {alert.data.type && ` (${alert.data.type})`}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </Card>
        </div>
    );
}

function TradingViewWidget({ data }: { data: OHLCVDailyData[] }) {
    const chartContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!chartContainerRef.current || data.length === 0) return;
        const container = chartContainerRef.current;

        const chart = LightweightCharts.createChart(container, {
            layout: { background: { type: LightweightCharts.ColorType.Solid, color: "transparent" }, textColor: "#6B7280" },
            grid: { vertLines: { visible: false }, horzLines: { color: "#E5E7EB", style: 2 } },
            width: container.clientWidth || 300,
            height: 200,
            handleScroll: true,
            handleScale: true,
            timeScale: { visible: true, timeVisible: false, secondsVisible: false },
            rightPriceScale: { visible: false },
            leftPriceScale: { visible: true }
        });

        const candlestickSeries = chart.addSeries(LightweightCharts.CandlestickSeries, {
            upColor: "#16A34A",
            downColor: "#DC2626",
            borderUpColor: "#16A34A",
            borderDownColor: "#DC2626",
            wickUpColor: "#16A34A",
            wickDownColor: "#DC2626",
        });

        const chartData = data.map(d => ({
            time: d.date,
            open: d.open,
            high: d.high,
            low: d.low,
            close: d.close,
        })).sort((a, b) => a.time.localeCompare(b.time));

        candlestickSeries.setData(chartData);
        chart.timeScale().fitContent();

        const handleResize = () => chart.applyOptions({ width: container.clientWidth });
        window.addEventListener("resize", handleResize);
        return () => { window.removeEventListener("resize", handleResize); chart.remove(); };
    }, [data]);

    return <div ref={chartContainerRef} className="w-full h-full" />;
}

function TradeBar({ label, inflow, outflow, formatVolume }: { label: string; inflow: number; outflow: number; formatVolume: (vol: number) => string }) {
    const max = Math.max(inflow, outflow, 20);
    return (
        <div className="flex items-center gap-3 text-[11px] font-bold">
            <span className="w-10 text-right tabular-nums text-foreground/90">{formatVolume(inflow)}</span>
            <div className="flex-1 flex gap-0.5 h-1.5 bg-secondary rounded-full overflow-hidden">
                <div className="bg-gain h-full rounded-l-full transition-all duration-500" style={{ width: `${(inflow / max) * 50}%`, marginLeft: "auto" }} />
                <div className="bg-loss h-full rounded-r-full transition-all duration-500" style={{ width: `${(outflow / max) * 50}%` }} />
            </div>
            <span className="w-6 text-center text-muted-foreground text-[10px] font-black">{label}</span>
            <span className="w-10 text-left tabular-nums text-foreground/90">{formatVolume(outflow)}</span>
        </div>
    );
}

function InfoRow({ label, value, color = "text-foreground" }: { label: string; value: string; color?: string }) {
    return (
        <div className="flex items-center justify-between text-[10px]">
            <span className="text-muted-foreground font-medium">{label}</span>
            <span className={cn("font-bold tabular-nums", color)}>{value}</span>
        </div>
    );
}