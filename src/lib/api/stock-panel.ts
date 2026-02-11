import {
  OHLCVData,
  OHLCVDailyData,
  PreparedTradesResponse,
  TradeOverview,
  ScenarioFlags,
  NewsAlert,
  EMAAnalysis,
  InvestXTechnicalAnalyst,
  AnalysisData,
  CompanyData,
  DividendData,
  VolumeByDateData,
  ChartCandlePatternsData,
} from "@/types/stock-panel";

const API_Base_URL = process.env.NEXT_PUBLIC_API_BACKEND_URL || "";
const ORDERBOOK_BASE_URL = process.env.NEXT_PUBLIC_ORDERBOOK_BACKEND_URL || "";
const TRADE_ANALYSIS_BE = process.env.NEXT_PUBLIC_TRADE_ANALYSIS_API_URL || "";

type SymbolData = {
  symbol: string;
};

async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit,
  base: string = API_Base_URL,
): Promise<T> {
  const url = `${base}${endpoint}`;
  console.log(`[EquiMindAPI] Requesting: ${url}`);

  // Add default headers
  const defaultHeaders: HeadersInit = {};
  // Only add JSON content type for methods that typically have a body
  if (
    options?.method &&
    options.method !== "GET" &&
    options.method !== "HEAD"
  ) {
    defaultHeaders["Content-Type"] = "application/json";
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options?.headers,
      },
    });

    if (!res.ok) {
      // Try to read error body, but be safe if CORS blocks it
      let errorData = {};
      try {
        errorData = await res.json();
      } catch (e) {
        console.warn(
          "Could not read error JSON (likely CORS on error response)",
          e,
        );
      }
      console.error(`[EquiMindAPI] Error ${res.status}:`, errorData);
      throw new Error(
        (errorData as any).detail ||
          (errorData as any).message ||
          `API Error: ${res.status} ${res.statusText}`,
      );
    }

    return res.json();
  } catch (error) {
    console.error(`[EquiMindAPI] Fetch failed for ${url}`, error);
    throw error;
  }
}

export const StockPanelAPI = {
  fetchOhlcv: async (data: SymbolData) => {
    return fetchAPI<OHLCVData>(
      `/api/v1/stock-info/symbol-info/${data.symbol}`,
      {
        method: "GET",
      },
    );
  },
  fetchTradeOverview: async (data: SymbolData) => {
    return fetchAPI<TradeOverview>(
      `/api/v1/stock-info/trade-overview/${data.symbol}`,
      {
        method: "GET",
      },
    );
  },
  fetchScenarioFlags: async (data: SymbolData) => {
    return fetchAPI<ScenarioFlags>(
      `/api/v1/stock-info/orderbook-states/${data.symbol}`,
      {
        method: "GET",
      },
    );
  },
  fetchLatestNewsBySymbol: async (data: SymbolData) => {
    return fetchAPI<NewsAlert[]>(
      `/api/v1/stock-info/market-eye/${data.symbol}`,
      {
        method: "GET",
      },
    );
  },
  fetchEmaAnalysisBySymbol: async (data: SymbolData) => {
    return fetchAPI<EMAAnalysis>(
      `/api/v1/stock-info/ema-analysis/${data.symbol}`,
      {
        method: "GET",
      },
    );
  },
  fetchInvestXTechnicalAnalyst: async (data: SymbolData) => {
    return fetchAPI<InvestXTechnicalAnalyst>(
      `/api/v1/stock-info/investx-technical-analyst/${data.symbol}`,
      {
        method: "GET",
      },
    );
  },
  fetchAnalysisData: async (data: SymbolData) => {
    return fetchAPI<AnalysisData>(
      `/api/v1/stock-info/analysis-data/${data.symbol}`,
      {
        method: "GET",
      },
    );
  },
  fetchCompanyInfo: async (data: SymbolData) => {
    const formattedSymbol = data.symbol.split(".")[0];
    return fetchAPI<CompanyData>(
      `/api/v1/stock-info/financial-metrics?symbol=${formattedSymbol}`,
      {
        method: "GET",
      },
    );
  },
  fetchOHLCVForNDays: async (data: SymbolData & { days: number }) => {
    return fetchAPI<OHLCVDailyData[]>(
      `/api/v1/stock-info/ohlcv/${data.symbol}?days=${data.days}`,
      {
        method: "GET",
      },
    );
  },
  fetchVolumeByDate: async (data: SymbolData & { limit: number }) => {
    return fetchAPI<VolumeByDateData[]>(
      `/api/v1/stock-info/volume-by-date/${data.symbol}?limit=${data.limit}`,
      {
        method: "GET",
      },
    );
  },
  fetchChartCandlePatterns: async (data: SymbolData) => {
    return fetchAPI<ChartCandlePatternsData>(
      `/api/v1/stock-info/top-cnc-patterns/${data.symbol}`,
      {
        method: "GET",
      },
    );
  },
};

export const OrderBookAPI = {
  fetchTodayTrades: async (data: SymbolData) => {
    return fetchAPI<PreparedTradesResponse>(
      `/prepare_trades/${data.symbol}`,
      {
        method: "GET",
      },
      ORDERBOOK_BASE_URL,
    );
  },
};

export const TradeAnalysisAPI = {
  fetchDividendData: async (data: SymbolData) => {
    return fetchAPI<DividendData[]>(
      `/api/dividend-history/history/${data.symbol}`,
      {
        method: "GET",
      },
      TRADE_ANALYSIS_BE,
    );
  },
};
