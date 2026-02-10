"use client";

import { useState, useEffect } from "react";
import { ExternalLink, Clock } from "lucide-react";
import { StockPanelAPI } from "@/lib/api/stock-panel";
import { NewsAlert } from "@/types/stock-panel";

interface NewsItem {
    id: string;
    title: string;
    description: string;
    source: string;
    publishedAt: string;
    url: string;
}

export function NewsTab({ ticker }: { ticker: string }) {
    const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true);
            try {
                const newsData = await StockPanelAPI.fetchLatestNewsBySymbol({ symbol: ticker });

                // Transform NewsAlert[] to NewsItem[]
                const transformedNews: NewsItem[] = newsData.map((alert: NewsAlert) => ({
                    id: alert.id.toString(),
                    title: alert.llm_summary.length > 100
                        ? alert.llm_summary.substring(0, 100) + "..."
                        : alert.llm_summary,
                    description: alert.risk_assessment_text || alert.llm_summary,
                    source: alert.news_source.includes('http')
                        ? new URL(alert.news_source).hostname.replace('www.', '')
                        : alert.news_source,
                    publishedAt: alert.published_at,
                    url: alert.news_source.includes('http') ? alert.news_source : "#"
                }));

                setNewsItems(transformedNews);
            } catch (error) {
                console.error('Failed to fetch news:', error);
                setNewsItems([]);
            } finally {
                setLoading(false);
            }
        };

        if (ticker) {
            fetchNews();
        }
    }, [ticker]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return "1 day ago";
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="p-4 space-y-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="animate-pulse">
                        <div className="h-4 bg-muted rounded mb-2"></div>
                        <div className="h-3 bg-muted rounded w-3/4 mb-1"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                ))}
            </div>
        );
    }

    const handleNewsClick = (url: string) => {
        if (url && url !== "#") {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 space-y-3 overflow-y-auto scrollbar-hide">
                {newsItems.map((item) => (
                    <div
                        key={item.id}
                        className="group border border-border rounded-lg p-3 hover:bg-muted/50 transition-all cursor-pointer"
                        onClick={() => handleNewsClick(item.url)}
                    >
                        <div className="flex items-start justify-between gap-2 mb-2">
                            <h4 className="text-xs font-medium text-foreground leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                                {item.title}
                            </h4>
                            <ExternalLink
                                size={12}
                                className="text-muted-foreground hover:text-primary transition-colors shrink-0 mt-0.5"
                            />
                        </div>

                        <p className="text-[11px] text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
                            {item.description}
                        </p>

                        <div className="flex items-center justify-between text-[10px]">
                            <span className="text-primary font-medium">{item.source}</span>
                            <div className="flex items-center gap-1 text-muted-foreground">
                                <Clock size={10} />
                                <span>{formatDate(item.publishedAt)}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {newsItems.length === 0 && !loading && (
                <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
                    No news available for {ticker}
                </div>
            )}
        </div>
    );
}