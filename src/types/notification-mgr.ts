export interface Alert {
  id: number;
  timestamp: string;
  symbol: string;
  message: string;
  account: string | null;
  severity: string;
  data: {
    total_bids?: number;
    visible_bids?: number;
    total_asks?: number;
    visible_asks?: number;
    type?: string;
  };
  state: boolean;
  detection_type: string;
}

export interface OrderBookAlertResponse {
  alerts: Alert[];
}
