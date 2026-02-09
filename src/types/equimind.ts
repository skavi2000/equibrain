export interface Message {
  id: string;
  session_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  tokens_used?: number;
  metadata?: Record<string, any>;
}

export interface ActivityFeedItem {
  type: 'search' | 'analysis' | 'generation' | 'alert_creation' | 'error';
  message: string;
  timestamp: string;
  metadata?: Record<string, any>;
  activity_type?: string; 
}

export interface ChatSession {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  message_count: number;
  last_message_preview?: string;
  is_active?: boolean;
}

export interface ChatSessionDetails extends ChatSession {
  messages: Message[];
  metadata?: Record<string, any>;
}

export interface CreateSessionRequest {
  title?: string;
  metadata?: Record<string, any>;
}

export interface ChatRequest {
  message: string;
  session_id?: string | null;
  context_mode?: 'web_internal' | 'internal_only';
  reasoning_mode?: 'quick' | 'deep';
  create_alert?: boolean;
}

export interface ChatResponse {
  session_id: string;
  message: Message;
  activity_feed: ActivityFeedItem[];
  alert_created?: any;
}

export interface Alert {
  id: string;
  ticker: string;
  condition: string;
  threshold: number;
  created_at: string;
  status: 'active' | 'triggered' | 'disabled';
}

export interface CreateAlertRequest {
  ticker: string;
  condition: string;
  threshold: number;
}
