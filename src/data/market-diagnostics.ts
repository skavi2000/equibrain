// Normalized diagnostic and remediation data for all supported markets.
// Source: investx_diagnostic_v2*.json and investx_remediation_plan_v2*.json

export interface MarketScores {
  data_quality: number;
  trade_execution: number;
  agent_readiness: number;
  overall: number;
  scoring_notes: string[];
}

export interface MarketBlocker {
  code: string;
  severity: string;
  recommended_actions: string[];
  category: "DATA" | "EXECUTION" | "STRATEGY";
}

export interface MarketWarning {
  code: string;
  severity: string;
  details: string;
  category: "DATA" | "EXECUTION" | "STRATEGY";
}

export interface MarketAgent {
  agent_id: string;
  agent_type: string;
  status: string;
  reasons: string[];
  recommended_actions: string[];
  category: "DATA" | "EXECUTION" | "STRATEGY";
}

export interface MarketDiagnosticData {
  diagnostic_run: {
    run_id: string;
    overall_status: string;
    market_id: string;
  };
  scores: MarketScores;
  blockers: MarketBlocker[];
  warnings: MarketWarning[];
  agents: MarketAgent[];
}

export interface RemediationPhase {
  phase_name: string;
  duration_weeks: string;
  outcomes: string[];
}

export interface PostRemediationScore {
  target: number;
  range: [number, number];
}

export interface MarketRemediationData {
  objective: string;
  timeline_estimates: {
    fast_path_weeks: string;
    conservative_weeks: string;
  };
  phases: RemediationPhase[];
  expected_post_remediation_scores: {
    data_quality: PostRemediationScore;
    trade_execution: PostRemediationScore;
    agent_readiness: PostRemediationScore;
    overall: PostRemediationScore;
  };
  top_decisions_required_now: string[];
}

export interface MarketFullData {
  diagnostic: MarketDiagnosticData;
  remediation: MarketRemediationData;
}

// ===================== CSE (Colombo Stock Exchange) =====================
const CSE_DIAGNOSTIC: MarketDiagnosticData = {
  diagnostic_run: {
    run_id: "CSE_LK__BASELINE_V2",
    overall_status: "Pilot Ready (Controlled)",
    market_id: "CSE_LK",
  },
  scores: {
    data_quality: 88,
    trade_execution: 80,
    agent_readiness: 78,
    overall: 82,
    scoring_notes: [
      "Scores updated based on Verified Market Data Adjustment, operational News/Dividend pipelines with database archiving, and verified Order/Trade book tracking.",
      "Overall status is Pilot Ready (Controlled): Suitable for paper trading / limited-capital deployment with monitoring and guardrails; not yet 'set-and-forget' for cross-market portability.",
    ],
  },
  blockers: [],
  warnings: [
    { code: "Daily Timeframe Only", severity: "Medium", details: "Strategies and Learning Engines currently operate on Daily timeframes. Intraday scaling (if needed) requires schema extension and policy updates.", category: "STRATEGY" },
    { code: "Execution Realism Gaps", severity: "Medium", details: "Need to define/validate slippage, fees, partial fills, auction handling, and price gap behavior to improve production robustness.", category: "EXECUTION" },
    { code: "Portability Calibration Needed", severity: "Medium", details: "Cross-market portability requires benchmark mapping and liquidity threshold recalibration (e.g., turnover percentile rules).", category: "DATA" },
    { code: "Messaging Policy Unspecified", severity: "Low", details: "Chat ingestion method, retention, anonymization, and multilingual handling should be explicitly documented for compliance.", category: "DATA" },
  ],
  agents: [
    { agent_id: "Maverick Buying Strategy", agent_type: "Trading", status: "Pilot Ready (Controlled)", reasons: ["Benchmark Lock-in (ASI)", "Currency Scale Dependent Min Turnover"], recommended_actions: ["Replace absolute turnover threshold with percentile-based rule for portability.", "Define benchmark mapping contract for non-CSE markets."], category: "STRATEGY" },
    { agent_id: "Technical Analysis Buying Strategy", agent_type: "Trading", status: "Pilot Ready (Controlled)", reasons: ["Threshold Calibration Required for New Markets"], recommended_actions: ["Ensure thresholds are parameterized and stored per market regime if expanding beyond CSE."], category: "STRATEGY" },
    { agent_id: "Asset Allocation & Trend Follower (AATF)", agent_type: "Trading", status: "Ready (Daily)", reasons: ["Daily Timeframe Only"], recommended_actions: ["If intraday expansion is planned, extend contracts for multi-timeframe signals and execution cadence."], category: "STRATEGY" },
    { agent_id: "Meta-Learning Engine", agent_type: "Trading", status: "Ready (Daily)", reasons: ["Daily Timeframe Only"], recommended_actions: ["Add regime tagging and evaluation policy for non-stationary markets; extend to intraday only if required."], category: "STRATEGY" },
    { agent_id: "Trend Exit (DEMA)", agent_type: "Trading", status: "Ready", reasons: [], recommended_actions: ["Validate sell rule stability under different liquidity regimes."], category: "EXECUTION" },
    { agent_id: "Risk Protection (Stop Loss)", agent_type: "Trading", status: "Ready", reasons: [], recommended_actions: ["Document gap handling and order constraints per market."], category: "EXECUTION" },
    { agent_id: "Chart Pattern Agent", agent_type: "Trading", status: "Ready", reasons: [], recommended_actions: ["Ensure pattern params are versioned and reproducible across data vendors."], category: "EXECUTION" },
    { agent_id: "Social Sentiment Analyst (WA)", agent_type: "Non-Trading", status: "Partial", reasons: ["Policy & Connector Docs Incomplete"], recommended_actions: ["Document ingestion, retention, anonymization, and multilingual plan."], category: "DATA" },
    { agent_id: "Market Eye", agent_type: "Non-Trading", status: "Ready", reasons: [], recommended_actions: ["Maintain source registry health checks, deduplication, and entity-to-ticker mapping QA."], category: "DATA" },
    { agent_id: "Dividend Analytics Agent", agent_type: "Non-Trading", status: "Ready", reasons: [], recommended_actions: ["Automate periodic sampling cross-checks against disclosures."], category: "DATA" },
    { agent_id: "ASI Prediction Agent", agent_type: "Non-Trading", status: "Partial", reasons: ["Data Quality Metrics Not Declared for Model Pipeline"], recommended_actions: ["Implement benchmark data QA metrics (missingness/outliers) and publish model evaluation policy."], category: "DATA" },
    { agent_id: "EquiMind Chat Agent", agent_type: "Non-Trading", status: "Pilot Ready (Controlled)", reasons: ["Knowledge Base Governance Required"], recommended_actions: ["Define Knowledge Base refresh cadence, retrieval policy, and redaction/compliance rules for private data."], category: "STRATEGY" },
  ],
};

const CSE_REMEDIATION: MarketRemediationData = {
  objective: "Raise Execution Capability and System Readiness to 85+ while maintaining Data Integrity at 88+ by validating trade simulation accuracy, standardized portfolio management rules, and formalizing governance & portability controls.",
  timeline_estimates: { fast_path_weeks: "2-4", conservative_weeks: "4-6" },
  phases: [
    { phase_name: "Phase 1: Production Guardrails & Monitoring", duration_weeks: "1-2", outcomes: ["Data Freshness and Integrity Standards enforced daily with alerts", "Audit-grade run logs and evidence captured per run", "Operational playbook established for data feed failures"] },
    { phase_name: "Phase 2: Execution Realism & Portfolio Lifecycle", duration_weeks: "1-2", outcomes: ["Execution model accounts for slippage, fees, partial fills, and price gaps", "Portfolio Lifecycle Contract defined: Open/Add/Reduce/Close with sizing & risk caps", "Stop-loss and Trend Exit rules integrate cleanly into lifecycle"] },
    { phase_name: "Phase 3: Governance, Portability & Compliance", duration_weeks: "1-2", outcomes: ["Signal Contract enforced (Structure, Confidence, Horizon)", "Portability Layer defined (Benchmark mapping & Liquidity normalization)", "Governance documented for Social Data & Knowledge Base (Retention, Privacy, Access)"] },
  ],
  expected_post_remediation_scores: {
    data_quality: { target: 90, range: [88, 92] },
    trade_execution: { target: 88, range: [85, 92] },
    agent_readiness: { target: 86, range: [84, 90] },
    overall: { target: 88, range: [86, 91] },
  },
  top_decisions_required_now: [
    "Select the Execution Cost/Slippage Baseline Model (Conservative Fixed vs Volume-Participation based).",
    "Define Price Gap behavior (Market-on-Open, Limit Fallback, or Staged Exit).",
    "Set Portfolio Risk Caps (Max Risk per Trade, Max Position Size, Max Sector Exposure, Max Daily Loss).",
    "Decide Portability Priority: Target next market(s) and define Benchmark Mapping + Turnover Policy accordingly.",
    "Decide whether Daily-Only is sufficient for v1 Launch or whether Intraday Roadmap is required.",
  ],
};

// ===================== HKEX (Hong Kong Stock Exchange) =====================
const HKEX_DIAGNOSTIC: MarketDiagnosticData = {
  diagnostic_run: {
    run_id: "HKEX_HK__BASELINE_V1",
    overall_status: "Partial Readiness",
    market_id: "HKEX_HK",
  },
  scores: {
    data_quality: 52,
    trade_execution: 40,
    agent_readiness: 36,
    overall: 43,
    scoring_notes: [
      "Price Data Adjustment (Splits/Dividends) is Unknown for the current feed and must be verified per stock.",
      "No Corporate Actions source is configured; this blocks adjustment verification and dividend normalization.",
      "Market Depth (Orderbook) and Sales Data are pending subscription; currently treated as unavailable.",
      "Execution System is connected to Broker API but specific routing, fee models, and slippage controls are undefined.",
      "Short-selling is enabled but eligibility list and borrow/locate workflow are Unverified, reducing execution readiness.",
    ],
  },
  blockers: [
    { code: "Corporate Actions Source Missing", severity: "High", recommended_actions: ["Select a corporate actions source (splits/dividends/rights issues) and implement normalization.", "Use it to validate Price Data adjustment mode and stabilize indicators/backtests."], category: "DATA" },
    { code: "Broker Route Unspecified", severity: "High", recommended_actions: ["Select broker/execution route (IBKR / Moomoo API / Saxo) and define supported order types.", "Define broker-accurate fees schedule and minimum viable slippage model."], category: "EXECUTION" },
    { code: "Stop Loss Policy Unknown", severity: "High", recommended_actions: ["Choose baseline stop policy (Fixed % / Volatility-based / Trailing).", "Define price gap handling and stop recalculation schedule.", "Implement parameter schema with defaults."], category: "EXECUTION" },
    { code: "Trend Exit Parameters Unknown", severity: "High", recommended_actions: ["Define moving average periods and confirm with HKEX backtests by liquidity bucket.", "Store as required config; enforce validation."], category: "EXECUTION" },
    { code: "Trade Log Schema Unspecified", severity: "High", recommended_actions: ["Define trade log schema (Signal -> Order -> Fill -> Position Lifecycle, Fees, Slippage, Timestamps).", "Implement storage and replay to support evaluation and auditability."], category: "STRATEGY" },
    { code: "Chart Pattern List Unknown", severity: "High", recommended_actions: ["Define MVP pattern list and parameterization OR de-scope as non-gating until backtests are completed.", "Add backtest harness and acceptance thresholds."], category: "STRATEGY" },
  ],
  warnings: [
    { code: "Orderbook Pending Subscription", severity: "Medium", details: "Market Depth (L2) is desired but currently pending subscription; treat as unavailable for now.", category: "DATA" },
    { code: "Tradebook Pending Subscription", severity: "Medium", details: "Time & Sales data is desired but currently pending subscription; treat as unavailable for now.", category: "DATA" },
    { code: "News Sources Missing", severity: "Low", details: "No news sources configured for HKEX; Market Eye will be unavailable until connectors exist.", category: "DATA" },
    { code: "Liquidity Rule Undefined", severity: "Medium", details: "Liquidity threshold recalibration method is not defined; absolute thresholds are not portable across markets.", category: "STRATEGY" },
    { code: "Relative Strength Mapping Undefined", severity: "Low", details: "Relative strength benchmark mapping beyond HSI (HSCEI/HSTECH/sector indices) is not yet defined.", category: "DATA" },
  ],
  agents: [
    { agent_id: "Maverick Buying Strategy", agent_type: "Trading", status: "Partial", reasons: ["Price Adjustment Mode Unverified", "Corporate Actions Source Missing", "Liquidity Rule Undefined", "Relative Strength Mapping Undefined"], recommended_actions: ["Add corporate actions source and verify Price Data adjustment mode/coverage.", "Implement percentile-based liquidity rule for HKEX.", "Define relative strength benchmark mapping contract (HSI + HSCEI/HSTECH)."], category: "STRATEGY" },
    { agent_id: "Technical Analysis Buying Strategy", agent_type: "Trading", status: "Partial", reasons: ["Price Adjustment Mode Unverified", "Thresholds Incomplete", "Corporate Actions Source Missing"], recommended_actions: ["Add corporate actions source and verify adjusted/unadjusted mode per symbol.", "Finalize RSI/Volume/Trend thresholds for HKEX after backtests."], category: "STRATEGY" },
    { agent_id: "Asset Allocation & Trend Follower", agent_type: "Trading", status: "Partial", reasons: ["Input Contract Unspecified", "Output Contract Unspecified", "Broker Execution Route Unspecified"], recommended_actions: ["Define signal input contract (Confidence, Horizon, Invalidation, Evidence).", "Define portfolio action contract (Open/Add/Reduce/Close/Hold) with sizing + risk caps.", "Select broker route and map orders."], category: "STRATEGY" },
    { agent_id: "Meta-Learning Engine", agent_type: "Trading", status: "Blocked", reasons: ["Trade Log Schema Unspecified"], recommended_actions: ["Implement trade log schema + storage + replay.", "Define learning targets and evaluation policy."], category: "STRATEGY" },
    { agent_id: "Trend Exit (DEMA)", agent_type: "Trading", status: "Blocked", reasons: ["Trend Parameters Unknown", "Broker Execution Route Unspecified"], recommended_actions: ["Define moving average periods and validate via HKEX data.", "Define execution route so sell orders can be placed."], category: "EXECUTION" },
    { agent_id: "Stop Loss Protection", agent_type: "Trading", status: "Blocked", reasons: ["Stop Loss Rule Unknown", "Broker Execution Route Unspecified"], recommended_actions: ["Define stop-loss policy + parameters + gap handling.", "Implement order placement semantics per broker."], category: "EXECUTION" },
    { agent_id: "Chart Pattern Strategy", agent_type: "Trading", status: "Blocked", reasons: ["Pattern List Unknown", "Pattern Params Unknown"], recommended_actions: ["Establish pattern list + params; backtest by liquidity bucket and timeframe.", "Mark as Non-Gating until validated."], category: "EXECUTION" },
    { agent_id: "Market Eye (News)", agent_type: "Non-Trading", status: "Not Available", reasons: ["News Sources Missing"], recommended_actions: ["Implement source registry + connectors (RSS/API) + deduplication.", "Add entity-to-ticker mapping and impact scoring."], category: "DATA" },
    { agent_id: "Dividend Analytics", agent_type: "Non-Trading", status: "Not Available", reasons: ["Dividend & Corp Actions Sources Missing"], recommended_actions: ["Add dividend/corporate actions sources and normalization pipeline.", "Validate samples vs official disclosures where possible."], category: "DATA" },
    { agent_id: "EquiMind Chat Agent", agent_type: "Non-Trading", status: "Partial", reasons: ["Knowledge Base Pipeline Unspecified"], recommended_actions: ["Define HKEX Knowledge Base sources (strategy docs, filings, research notes) and refresh cadence.", "Define redaction/compliance rules for private data."], category: "STRATEGY" },
  ],
};

const HKEX_REMEDIATION: MarketRemediationData = {
  objective: "Raise Execution Capability and System Readiness to 85+ while bringing Data Integrity to 85+ by validating Price Data coverage (requires Corporate Actions source), selecting a Broker Connection, implementing realistic trade simulation (Fees/Slippage), and establishing compliance controls for HKEX (including Short Selling).",
  timeline_estimates: { fast_path_weeks: "7-12", conservative_weeks: "12-16" },
  phases: [
    { phase_name: "Phase 1: Data Truth, Coverage & Market Protocols", duration_weeks: "3-4", outcomes: ["Corporate Actions source selected and normalization pipeline built", "Price Data coverage verified for HKEX universe", "Price Adjustment mode identified (Unadjusted vs Splits vs Splits+Dividends)", "Data Quality metrics and alerts operational"] },
    { phase_name: "Phase 2: Execution Foundation & Risk Controls", duration_weeks: "3-5", outcomes: ["Broker Connection selected and Adapter Contract implemented", "Execution Realism Model in place (Fees, Slippage, Partial Fills)", "Portfolio Lifecycle Contract enforced: Open/Add/Reduce/Close", "Short Selling workflow scaffolding implemented (if in scope)"] },
    { phase_name: "Phase 3: System Contracts & Portability", duration_weeks: "2-4", outcomes: ["Signal Contract enforced across strategies", "Trade Audit Logs implemented", "Asset Allocation Policy implemented", "Portability Layer defined (Benchmarks & Liquidity normalization)", "Strategy Calibration initiated for HKEX"] },
  ],
  expected_post_remediation_scores: {
    data_quality: { target: 86, range: [84, 90] },
    trade_execution: { target: 86, range: [85, 90] },
    agent_readiness: { target: 85, range: [84, 89] },
    overall: { target: 86, range: [85, 90] },
  },
  top_decisions_required_now: [
    "Select the Broker Connection for HKEX (Primary Execution Gate).",
    "Select Corporate Actions Source (Critical for Data Integrity).",
    "Choose the Stop-Loss Baseline to calibrate first (Fixed % vs Volatility-based).",
    "Define the Minimum Viable Execution Realism Model (Fees/Slippage) for V1.",
    "Define Liquidity Rule Approach for HKEX (Percentile Turnover Policy recommended).",
    "Confirm if Short Selling is in-scope for V1 or deferred.",
    "Decide if Pattern Strategy is Gating or Non-Gating.",
  ],
};

// ===================== SGX (Singapore Exchange) =====================
const SGX_DIAGNOSTIC: MarketDiagnosticData = {
  diagnostic_run: {
    run_id: "SGX_SG__BASELINE_V1",
    overall_status: "Partial Readiness",
    market_id: "SGX_SG",
  },
  scores: {
    data_quality: 55,
    trade_execution: 42,
    agent_readiness: 38,
    overall: 45,
    scoring_notes: [
      "Market Data Adjustment (Splits/Dividends) is Unknown for the current data feed and must be verified per stock.",
      "Market Depth (Orderbook) and Sales Data are pending subscription; currently treated as unavailable.",
      "Execution System is connected to Broker API but specific routing, fee models, and slippage controls are undefined.",
      "Short-selling is enabled but Compliance Rules and Borrowing Workflows are unverified, reducing execution readiness.",
    ],
  },
  blockers: [
    { code: "Broker Route Unspecified", severity: "High", recommended_actions: ["Select broker/execution route (IBKR / Moomoo API / Saxo) and define supported order types.", "Define fees model (broker-accurate schedule) and minimum viable slippage model."], category: "EXECUTION" },
    { code: "Stop Loss Policy Unknown", severity: "High", recommended_actions: ["Choose baseline stop policy (Fixed % / Volatility-based / Trailing).", "Define price gap handling and stop recalculation schedule.", "Implement parameter schema with defaults."], category: "EXECUTION" },
    { code: "Trend Exit Parameters Unknown", severity: "High", recommended_actions: ["Define moving average periods and confirm with SGX backtests by liquidity bucket.", "Store as required config; enforce validation."], category: "EXECUTION" },
    { code: "Trade Log Schema Unspecified", severity: "High", recommended_actions: ["Define trade log schema (Signal -> Order -> Fill -> Position Lifecycle, Fees, Slippage, Timestamps).", "Implement storage and replay to support evaluation and auditability."], category: "STRATEGY" },
    { code: "Chart Pattern List Unknown", severity: "High", recommended_actions: ["Define MVP pattern list and parameterization OR de-scope as non-gating until backtests are completed.", "Add backtest harness and acceptance thresholds."], category: "STRATEGY" },
  ],
  warnings: [
    { code: "Orderbook Pending Subscription", severity: "Medium", details: "Market Depth (L2) marked as desired but currently pending subscription; treat as unavailable for now.", category: "DATA" },
    { code: "Tradebook Pending Subscription", severity: "Medium", details: "Time & Sales data marked as desired but currently pending subscription; treat as unavailable for now.", category: "DATA" },
    { code: "News Sources Missing", severity: "Low", details: "No news sources configured for SGX; Market Eye will be unavailable until connectors exist.", category: "DATA" },
    { code: "Corporate Actions Sources Missing", severity: "Medium", details: "No dividend/corporate actions sources configured; adjustment verification and dividend analytics will be degraded.", category: "DATA" },
    { code: "Liquidity Rule Undefined", severity: "Medium", details: "Liquidity threshold recalibration method is not defined; absolute thresholds are not portable across markets.", category: "STRATEGY" },
    { code: "Relative Strength Mapping Undefined", severity: "Low", details: "Relative strength benchmark mapping beyond STI (sector indices) is not yet defined; sector analytics portability may be degraded.", category: "DATA" },
  ],
  agents: [
    { agent_id: "Maverick Buying Strategy", agent_type: "Trading", status: "Partial", reasons: ["Price Adjustment Mode Unverified", "Liquidity Rule Undefined", "Relative Strength Mapping Undefined"], recommended_actions: ["Verify Price Adjustment mode and symbol coverage.", "Implement percentile-based liquidity rule for SGX.", "Define relative strength benchmark mapping contract (STI + sector indices)."], category: "STRATEGY" },
    { agent_id: "Technical Analysis Buying Strategy", agent_type: "Trading", status: "Partial", reasons: ["Price Adjustment Mode Unverified", "Thresholds Incomplete"], recommended_actions: ["Verify Price Adjustment mode and symbol coverage.", "Finalize RSI/Volume/Trend thresholds for SGX after backtests."], category: "STRATEGY" },
    { agent_id: "Asset Allocation & Trend Follower", agent_type: "Trading", status: "Partial", reasons: ["Input Contract Unspecified", "Output Contract Unspecified", "Broker Execution Route Unspecified"], recommended_actions: ["Define signal input contract (Confidence, Horizon, Invalidation, Evidence).", "Define portfolio action contract (Open/Add/Reduce/Close/Hold) with sizing + risk caps.", "Select broker route and map orders."], category: "STRATEGY" },
    { agent_id: "Meta-Learning Engine", agent_type: "Trading", status: "Blocked", reasons: ["Trade Log Schema Unspecified"], recommended_actions: ["Define and implement trade log schema + storage.", "Define learning targets (Expectancy, Drawdown, Hit-Rate) and evaluation policy."], category: "STRATEGY" },
    { agent_id: "Trend Exit (DEMA)", agent_type: "Trading", status: "Blocked", reasons: ["Trend Parameters Unknown", "Broker Execution Route Unspecified"], recommended_actions: ["Define moving average periods and validate.", "Define execution route so sell orders can be expressed."], category: "EXECUTION" },
    { agent_id: "Stop Loss Protection", agent_type: "Trading", status: "Blocked", reasons: ["Stop Loss Rule Unknown", "Broker Execution Route Unspecified"], recommended_actions: ["Define stop policy, parameters, and gap handling.", "Implement order placement semantics per broker."], category: "EXECUTION" },
    { agent_id: "Chart Pattern Strategy", agent_type: "Trading", status: "Blocked", reasons: ["Pattern List Unknown", "Pattern Params Unknown"], recommended_actions: ["Establish pattern list + params; backtest by liquidity bucket and timeframe.", "If not ready, mark as Non-Gating so it doesn't block overall execution readiness."], category: "EXECUTION" },
    { agent_id: "Market Eye (News)", agent_type: "Non-Trading", status: "Not Available", reasons: ["News Sources Missing"], recommended_actions: ["Implement source registry + connectors (RSS/API) + deduplication.", "Add entity-to-ticker mapping and impact scoring."], category: "DATA" },
    { agent_id: "Dividend Analytics", agent_type: "Non-Trading", status: "Not Available", reasons: ["Dividend & Corp Actions Sources Missing"], recommended_actions: ["Add dividend/corp-actions sources and normalization pipeline.", "Use official disclosures where possible; validate samples."], category: "DATA" },
    { agent_id: "Index Prediction Agent (STI)", agent_type: "Non-Trading", status: "Not Applicable", reasons: ["Market Changed to SGX"], recommended_actions: ["Replace with STI Prediction Agent if benchmark forecasting is required."], category: "DATA" },
    { agent_id: "EquiMind Chat Agent", agent_type: "Non-Trading", status: "Partial", reasons: ["Knowledge Base Pipeline Unspecified"], recommended_actions: ["Define SGX Knowledge Base ingestion sources (Research Notes, Filings, Strategy Docs) and refresh cadence.", "Define redaction/compliance rules for any private data."], category: "STRATEGY" },
  ],
};

const SGX_REMEDIATION: MarketRemediationData = {
  objective: "Raise Execution Capability and System Readiness to 85+ while bringing Data Integrity to 85+ by validating Price Data coverage, selecting a Broker Connection, implementing realistic trade simulation (Fees/Slippage), and establishing compliance controls for SGX (including Stock Borrowing).",
  timeline_estimates: { fast_path_weeks: "6-10", conservative_weeks: "10-14" },
  phases: [
    { phase_name: "Phase 1: Data Truth, Coverage & Market Protocols", duration_weeks: "2-3", outcomes: ["Price Data coverage verified for STI constituents", "Price Adjustment mode identified (Unadjusted vs Splits vs Splits+Dividends)", "Data Quality metrics and alerts operational", "SGX Session Rules encoded (Continuous Trading + Auctions)"] },
    { phase_name: "Phase 2: Execution Foundation & Risk Controls", duration_weeks: "3-4", outcomes: ["Broker Connection selected and Adapter Contract implemented", "Execution Realism Model in place (Fees, Slippage, Partial Fills)", "Portfolio Lifecycle Contract enforced: Open/Add/Reduce/Close", "Stop-Loss & Trend Exit rules implemented as execution constraints"] },
    { phase_name: "Phase 3: System Contracts & Portability", duration_weeks: "2-4", outcomes: ["Signal Contract enforced across strategies", "Trade Audit Logs implemented", "Asset Allocation Policy implemented", "Portability Layer defined (Benchmarks & Liquidity normalization)", "Strategy Calibration initiated for SGX"] },
  ],
  expected_post_remediation_scores: {
    data_quality: { target: 86, range: [84, 90] },
    trade_execution: { target: 86, range: [85, 90] },
    agent_readiness: { target: 85, range: [84, 89] },
    overall: { target: 86, range: [85, 90] },
  },
  top_decisions_required_now: [
    "Select the Broker Connection for SGX (Primary Execution Gate).",
    "Choose the Stop-Loss Baseline to calibrate first (Fixed % vs Volatility-based).",
    "Decide the Minimum Viable Execution Realism Model (Fees/Slippage) for V1.",
    "Define Liquidity Rule Approach for SGX (Percentile Turnover Policy recommended).",
    "Confirm if Short Selling is in-scope for V1 or deferred.",
    "Confirm if Intraday is required for V1 (Daily-only speeds up readiness).",
    "Decide if Pattern Strategy is Gating or Non-Gating.",
  ],
};

// ===================== US (US Equity Market - NYSE) =====================
const US_DIAGNOSTIC: MarketDiagnosticData = {
  diagnostic_run: {
    run_id: "US_USA__BASELINE_V1",
    overall_status: "Partial Readiness",
    market_id: "US_USA",
  },
  scores: {
    data_quality: 56,
    trade_execution: 44,
    agent_readiness: 41,
    overall: 47,
    scoring_notes: [
      "Price Data source assumed TradingView (same as SGX-style setup); adjustment mode is Unknown and must be verified per symbol.",
      "Orderbook (L2) and Time & Sales data are intended via Moomoo but subscription/availability is Pending; treated as Unavailable for readiness scoring.",
      "Execution System is marked Broker API Ready but Moomoo route is not Verified; order types, fees, slippage, and partial-fill behavior are unspecified.",
      "Short selling is Out of Scope for V1 (no method found); compliance dependencies are treated as non-blocking.",
    ],
  },
  blockers: [
    { code: "Broker Route Unverified", severity: "High", recommended_actions: ["Verify Moomoo execution route: supported order types, API auth, rate limits, and market access.", "Define fees model (broker-accurate schedule) and minimum slippage/partial-fill assumptions."], category: "EXECUTION" },
    { code: "Stop Loss Policy Unknown", severity: "High", recommended_actions: ["Choose baseline stop policy (Fixed % / Volatility-based / Trailing).", "Define gap handling and stop recalculation schedule.", "Implement parameter schema with defaults."], category: "EXECUTION" },
    { code: "Trend Exit Parameters Unknown", severity: "High", recommended_actions: ["Define moving average periods and confirm with US backtests by liquidity bucket.", "Store as required config; enforce validation."], category: "EXECUTION" },
    { code: "Trade Log Schema Unspecified", severity: "High", recommended_actions: ["Define trade log schema (Signal -> Order -> Fill -> Position Lifecycle, Fees, Slippage, Timestamps).", "Implement storage and replay for auditability and evaluation."], category: "STRATEGY" },
    { code: "Chart Pattern List Unknown", severity: "High", recommended_actions: ["Define MVP pattern list and parameterization OR de-scope as non-gating until backtests are completed.", "Add backtest harness and acceptance thresholds."], category: "STRATEGY" },
  ],
  warnings: [
    { code: "Orderbook Pending Verification", severity: "Medium", details: "Market Depth (L2) is intended via Moomoo but access/connector is not verified; treat as unavailable.", category: "DATA" },
    { code: "Tradebook Pending Verification", severity: "Medium", details: "Time & Sales data is intended via Moomoo but access/connector is not verified; treat as unavailable.", category: "DATA" },
    { code: "Corporate Actions Source Unspecified", severity: "Medium", details: "No explicit corporate actions source declared; required to verify Price Data adjustment mode and stabilize indicator/backtests.", category: "DATA" },
    { code: "Liquidity Rule Undefined", severity: "Medium", details: "Liquidity threshold recalibration method is not defined; absolute thresholds are not portable across markets.", category: "STRATEGY" },
    { code: "Full Universe Scope Risk", severity: "Low", details: "Full Market Scope increases compute, noise, and false positives; consider Liquid Universe or S&P 500 only for V1.", category: "STRATEGY" },
  ],
  agents: [
    { agent_id: "Maverick Buying Strategy", agent_type: "Trading", status: "Partial", reasons: ["Price Adjustment Mode Unverified", "Liquidity Rule Undefined", "Full Universe Scope Risk"], recommended_actions: ["Verify Price Data adjustment mode and symbol coverage.", "Implement percentile-based liquidity rule using dollar volume.", "Consider reducing scope to Liquid Universe for V1 stability."], category: "STRATEGY" },
    { agent_id: "Technical Analysis Buying Strategy", agent_type: "Trading", status: "Partial", reasons: ["Price Adjustment Mode Unverified", "Thresholds Incomplete Declaration"], recommended_actions: ["Verify Price Data adjustment mode and symbol coverage.", "Finalize RSI/Volume/Trend thresholds using US backtests."], category: "STRATEGY" },
    { agent_id: "Asset Allocation & Trend Follower", agent_type: "Trading", status: "Partial", reasons: ["Input Contract Unspecified", "Output Contract Unspecified", "Broker Execution Route Unverified"], recommended_actions: ["Define signal input contract (Confidence, Horizon, Invalidation, Evidence).", "Define portfolio action contract (Open/Add/Reduce/Close/Hold) with sizing + risk caps.", "Verify Moomoo execution and map actions to supported order types."], category: "STRATEGY" },
    { agent_id: "Meta-Learning Engine", agent_type: "Trading", status: "Blocked", reasons: ["Trade Log Schema Unspecified"], recommended_actions: ["Implement trade log schema + storage + replay.", "Define learning targets (Expectancy, Hit-Rate, Drawdown) and evaluation policy."], category: "STRATEGY" },
    { agent_id: "Trend Exit (DEMA)", agent_type: "Trading", status: "Blocked", reasons: ["Trend Parameters Unknown", "Broker Execution Route Unverified"], recommended_actions: ["Define moving average periods and validate via US data.", "Verify execution route so exits can be expressed reliably."], category: "EXECUTION" },
    { agent_id: "Stop Loss Protection", agent_type: "Trading", status: "Blocked", reasons: ["Stop Loss Rule Unknown", "Broker Execution Route Unverified"], recommended_actions: ["Define stop-loss policy + parameters + gap handling.", "Implement order placement semantics per Moomoo capabilities."], category: "EXECUTION" },
    { agent_id: "Chart Pattern Strategy", agent_type: "Trading", status: "Blocked", reasons: ["Pattern List Unknown", "Pattern Params Unknown"], recommended_actions: ["Establish MVP pattern list + params and backtest on US liquid universe.", "Keep as Non-Gating until validated."], category: "EXECUTION" },
    { agent_id: "Market Eye (News)", agent_type: "Non-Trading", status: "Not Available", reasons: ["News Sources Missing"], recommended_actions: ["Implement source registry + connectors (RSS/API) + deduplication.", "Add entity-to-ticker mapping and impact scoring."], category: "DATA" },
    { agent_id: "Dividend Analytics", agent_type: "Non-Trading", status: "Not Available", reasons: ["Corporate Actions Source Unspecified"], recommended_actions: ["Add corporate actions/dividend sources and normalization pipeline.", "Use it to validate adjustment mode and improve indicator reliability."], category: "DATA" },
    { agent_id: "EquiMind Chat Agent", agent_type: "Non-Trading", status: "Partial", reasons: ["Knowledge Base Pipeline Unspecified"], recommended_actions: ["Define US Knowledge Base sources (strategy docs, research notes) and refresh cadence.", "Define redaction/compliance rules for private data."], category: "STRATEGY" },
  ],
};

const US_REMEDIATION: MarketRemediationData = {
  objective: "Raise Data Integrity, Execution Capability, and System Readiness to 85+ by verifying Price Data adjustment/coverage, verifying Moomoo execution route, defining risk/exit policies, enforcing system contracts, and establishing portable liquidity + benchmark mapping rules for US scale.",
  timeline_estimates: { fast_path_weeks: "6-10", conservative_weeks: "10-14" },
  phases: [
    { phase_name: "Phase 1: Data Truth, Coverage & Corporate Actions", duration_weeks: "2-3", outcomes: ["Price Data coverage verified (daily + intraday where used)", "Adjustment Mode identified per symbol (unadjusted vs splits vs splits+dividends)", "Data Quality metrics and alerts operational", "Indicator Stability certified for RSI/DEMA/pattern computations"] },
    { phase_name: "Phase 2: Execution Foundation (Verification + Realism)", duration_weeks: "2-3", outcomes: ["Moomoo Execution Route verified and Adapter Contract implemented", "Broker-accurate Fees configured (or conservative approximation approved)", "Slippage + Partial-Fill assumptions defined and logged", "Basic Execution Failure Handling implemented (retries/idempotency)"] },
    { phase_name: "Phase 3: Risk/Exit Policies + Portfolio Lifecycle + Contracts", duration_weeks: "2-4", outcomes: ["Stop-Loss and Trend Exits implemented and configurable", "Portfolio Action Lifecycle Contract enforced (Open/Add/Reduce/Close/Hold)", "Signal Schema standardized; Asset Allocation resolution operational", "Trade Logs implemented for auditability and learning readiness"] },
    { phase_name: "Phase 4: US-Scale Portability + Calibration", duration_weeks: "2-3", outcomes: ["Liquidity Rule recalibrated for US scale using Dollar Volume Percentiles", "Universe Risk reduced (Optional Liquid Universe fallback)", "Pattern Agent Catalog established via backtests OR kept Non-Gating"] },
  ],
  expected_post_remediation_scores: {
    data_quality: { target: 86, range: [84, 90] },
    trade_execution: { target: 86, range: [85, 90] },
    agent_readiness: { target: 85, range: [84, 89] },
    overall: { target: 86, range: [85, 90] },
  },
  top_decisions_required_now: [
    "Confirm whether V1 should remain Full Market Scope or shift to Liquid Universe for stability.",
    "Choose the Stop-Loss Baseline to calibrate first (Fixed % vs Volatility-based).",
    "Define initial Trend Exit period(s) for exit logic.",
    "Confirm Corporate Actions Source Selection (needed to close adjustment verification).",
    "Decide whether Pattern Agent is Non-Gating until backtests are complete.",
  ],
};

// ===================== Market data lookup =====================
const MARKET_DATA: Record<string, MarketFullData> = {
  cse: { diagnostic: CSE_DIAGNOSTIC, remediation: CSE_REMEDIATION },
  hkg: { diagnostic: HKEX_DIAGNOSTIC, remediation: HKEX_REMEDIATION },
  sgx: { diagnostic: SGX_DIAGNOSTIC, remediation: SGX_REMEDIATION },
  nyse: { diagnostic: US_DIAGNOSTIC, remediation: US_REMEDIATION },
};

export function getMarketDiagnosticData(marketId: string): MarketFullData | null {
  return MARKET_DATA[marketId] ?? null;
}

export function hasMarketDiagnosticData(marketId: string): boolean {
  return marketId in MARKET_DATA;
}
