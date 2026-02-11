export interface OHLCVData {
  high: number;
  low: number;
  open: number;
  close: number;
  volume: number;
  prev_close: number;
  change: number;
  change_pct: number;
  market: string;
  symbol: string;
}

export interface OHLCVDailyData {
  date: string;
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
}

export interface VolumeByDateData {
  day: string;
  buy: number;
  sell: number;
  total: number;
}

export interface TradeOverview {
  inflow: {
    S: number;
    M: number;
    L: number;
    XL: number;
  };
  outflow: {
    S: number;
    M: number;
    L: number;
    XL: number;
  };
  values: {
    inflow: number;
    outflow: number;
    netflow: number;
  };
}

export interface Trade {
  ts: string;
  symbol: string;
  price: number;
  qty: number;
  side: string;
  buy_volume: number;
  sell_volume: number;
  net_change: number;
  dup_seq: number;
}

export interface PreparedTradesResponse {
  symbol: string;
  prepared_trades: Trade[];
}

export interface ScenarioFlags {
  hidden_liquidity_bid: boolean;
  hidden_liquidity_ask: boolean;
  crossings_occurred_today: boolean;
  demand_supply_imbalance_bid: boolean;
  demand_supply_imbalance_ask: boolean;
  supply_and_demand_ask: boolean;
  supply_and_demand_bid: boolean;
}

export interface NewsAlert {
  id: number;
  timestamp: string;
  stock_ticker: string;
  sector: string;
  news_source: string;
  llm_sentiment: string;
  llm_relevance_score: number;
  llm_summary: string;
  impacted_nature: string;
  impacted_sectors_text: string;
  risk_assessment_text: string;
  published_at: string;
}

export interface EMAAnalysis {
  alerts: {
    alert_level: string;
    divergence_alert: string;
    primary_alert: string;
    volume_alert: string;
  };
  key_metrics: {
    price_vs_ema10: {
      distance_percent: number;
      ema_10_value: number;
      position: string;
      status: string;
    };
    price_vs_ema20: {
      distance_percent: number;
      ema_20_value: number;
      position: string;
      status: string;
    };
    volume_status: {
      activity_level: string;
      current_volume: number;
      vs_20d_avg: number;
      vs_5d_avg: number;
    };
  };
  market_context: {
    market_correlation: {
      correlation_level: string;
      correlation_value: number;
      independence: string;
      interpretation: string;
      volatility: number;
    };
    sector_performance: {
      interpretation: string;
      market_performance: number;
      relative_strength: number;
      sector_trend: string;
      status: string;
      stock_performance: number;
    };
  };
  quick_summary: {
    key_concerns: string[];
    key_strengths: string[];
    next_watch_levels: {
      resistance: number;
      support: number;
    };
    overall_sentiment: string;
  };
  raw_data: {
    enhanced_ema_analysis: {
      ema_alignment: string;
      ema_crossover_signal: string;
      ema_trend: string;
    };
    enhanced_volume_analysis: {
      confidence: number;
      details: string;
      ma_status: string;
      price_behavior: string;
      signal: string;
      volume_data: {
        current_volume: number;
        vol_20d_avg: number;
        vol_5d_avg: number;
        volume_vs_20d: number;
        volume_vs_5d: number;
      };
      volume_trend: string;
    };
    legacy_analysis: {
      bearish_signals: number;
      below_ema_10: boolean;
      below_ema_20: boolean;
      bullish_signals: number;
      divergence_trend: string;
      ema_trend: string;
      overall_recommendation: string;
      overall_trend: string;
      rsi_divergence: string;
      volume_trend: string;
    };
  };
  recommendation: {
    action: string;
    analysis_breakdown: {
      flow_score: number;
      market_score: number;
      technical_score: number;
    };
    confidence: number;
    detailed_analysis: string[];
    factors_considered: {
      market_correlation: string;
      money_flow: string;
      sector_performance: string;
      support_resistance: string;
      trend_analysis: string;
      volume_analysis: string;
    };
    key_reasons: string[];
    reasoning: string;
    risk_level: string;
    score: number;
    suggested_action: string;
  };
  status: string;
  stock_info: {
    current_price: number;
    date: string;
    symbol: string;
  };
  technical_analysis: {
    money_flow: {
      direction: string;
      interpretation: string;
      signal: string;
      strength: number;
      trend: string;
    };
    support_resistance: {
      current_position: string;
      interpretation: string;
      key_levels: {
        resistance_levels: number[];
        support_levels: number[];
      };
      nearest_resistance: number;
      nearest_support: number;
      resistance_distance: number;
      support_distance: number;
    };
    trend_analysis: {
      consistency: number;
      direction: string;
      interpretation: string;
      price_change_20d: number;
      strength: string;
    };
  };
  timestamp: string;
}

export interface InvestXTechnicalAnalyst {
  analysis_date: string;
  analysis_details: {
    ema_trend: string;
    has_volume_divergence: boolean;
    price_behavior: string;
    volume_signal: string;
    volume_trend: string;
  };
  analyst_name: string;
  comparison: {
    primary_difference: string;
    rating_change: string;
    score_difference: number;
  };
  created_at: string;
  current_system: {
    confidence: number;
    recommendation: string;
    risk_level: string;
    score: number;
  };
  detailed_analysis: string[];
  factor_breakdown: {
    ema_trend: {
      score: number;
      status: string;
    };
    market_correlation: {
      score: number;
      status: string;
    };
    money_flow: {
      score: number;
      status: string;
    };
    sector_performance: {
      score: number;
      status: string;
    };
    support_resistance: {
      score: number;
      status: string;
    };
    trend_strength: {
      score: number;
      status: string;
    };
    volume_divergence: {
      has_divergence: boolean;
      score: number;
      status: string;
    };
    volume_pattern: {
      score: number;
      status: string;
    };
  };
  investx_system: {
    confidence: number;
    recommendation: string;
    risk_level: string;
    score: number;
    suggested_action: string;
  };
  key_signals: string[];
  status: string;
  symbol: string;
}

export interface AnalysisDataItem {
  change_pct: string;
  closing_price: string;
  date: string;
  ema_100: string;
  ema_20: string;
  ema_200: string;
  ema_50: string;
  id: number;
  last_updated: string;
  prev_close: string;
  relative_strength: string;
  rsi: string;
  rsi_divergence: string;
  symbol: string;
  turnover: string;
  vol_avg_20d: string;
  vol_avg_5d: string;
  volume: number;
  volume_analysis: string;
}

export interface AnalysisData {
  data: AnalysisDataItem[];
  status: string;
}

export interface CompanyData {
  basic_info: {
    company_code: string;
    sector: string;
    current_market_price: number;
    issued_qty_mn: number;
    market_cap_millions: number;
  };
  financial_metrics: {
    revenue_3m: number;
    revenue_3m_growth: number;
    cumulative_revenue_2025_26: number;
    cumulative_revenue_growth: number;
    profit_3m: number;
    profit_3m_growth: number;
    cumulative_profit_2025_26: number;
    cumulative_profit_growth: number;
    return_on_equity: number;
    return_on_assets: number;
    dividend_yield: number;
    earnings_per_share: number;
    trailing_eps: number;
    net_asset_value: number;
    total_assets_bn: number;
    total_equity_bn: number;
    dividend_cash: number;
    dividend_scrip: null;
  };
  calculated_metrics: {
    current_stock_price: number;
    market_cap_millions: number;
    per_ratio: number;
    pbv_ratio: number;
  };
  report_type: string;
  last_updated: string;
}

export interface DividendItem {
  announcement_date: string;
  rate_of_dividend: number;
  xd_date: string;
}

export interface DividendStats {
  consecutive_years: number;
  total_dividend_years: number;
  dividend_years: number[];
  current_streak_active: boolean;
  cagr_3yr: number;
  naive_cagr_5y: number;
  adjusted_cagr_5y: number;
  last_5_dividends: DividendItem[];
  dividend_yield: number;
  latest_price: number;
  ttm_dividend: number;
}

export interface DividendData {
  id: number;
  company_code: string;
  announcement_date: string;
  rate_of_dividend: number;
  xd_date: string;
  stats?: DividendStats;
}

export interface CandlestickPattern {
  id: number;
  pattern_analysis_id: number;
  pattern_type: string;
  pattern_name: string;
  occurring_date: string;
  detection_reliability: number;
  direction: string;
  suggested_action: string;
  action_price_level: number;
  signal_confidence: number;
  rationale: string;
  backtest_occurrences: number;
  backtest_last_occurrence: string;
  backtest_hit_rate: number;
  backtest_avg_max_gain: number;
  backtest_avg_max_drawdown: number;
  backtest_forward_window_days: number;
  backtest_success_threshold: number;
}

export interface ChartPattern {
  id?: number;
  pattern_analysis_id?: number;
  pattern_type?: string;
  pattern_name?: string;
  occurring_date?: string;
  detection_reliability?: number;
  direction?: string;
  suggested_action?: string;
  action_price_level?: number;
  signal_confidence?: number;
  rationale?: string;
  backtest_occurrences?: number;
  backtest_last_occurrence?: string;
  backtest_hit_rate?: number;
  backtest_avg_max_gain?: number;
  backtest_avg_max_drawdown?: number;
  backtest_forward_window_days?: number;
  backtest_success_threshold?: number;
}

export interface ChartCandlePatternsData {
  analysis_date: string;
  overall_sentiment: string;
  recommended_action: string;
  stop_loss: number | null;
  target_price: number | null;
  entry_price: number | null;
  current_price: number | null;
  symbol: string;
  chart_pattern: ChartPattern;
  candlestick_pattern: CandlestickPattern;
}
