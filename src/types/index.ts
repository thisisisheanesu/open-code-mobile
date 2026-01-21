// OpenCode Mobile Types

// Session Types
export interface Session {
  id: string;
  directory: string;
  title?: string;
  agent: 'build' | 'plan';
  model?: string;
  createdAt: string;
  updatedAt: string;
  status: SessionStatus;
  usage?: UsageStats;
}

export type SessionStatus = 'idle' | 'busy' | 'error';

export interface UsageStats {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  cost?: number;
}

// Message Types
export interface Message {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant' | 'system';
  status: MessageStatus;
  parts: MessagePart[];
  createdAt: string;
  updatedAt: string;
  usage?: UsageStats;
}

export type MessageStatus = 'pending' | 'streaming' | 'completed' | 'error';

export type MessagePart =
  | TextPart
  | ToolUsePart
  | ToolResultPart
  | ThinkingPart
  | FilePart
  | SnapshotPart;

export interface TextPart {
  type: 'text';
  text: string;
}

export interface ToolUsePart {
  type: 'tool_use';
  id: string;
  name: string;
  input: Record<string, unknown>;
}

export interface ToolResultPart {
  type: 'tool_result';
  toolUseId: string;
  content: string;
  isError?: boolean;
}

export interface ThinkingPart {
  type: 'thinking';
  text: string;
}

export interface FilePart {
  type: 'file';
  path: string;
  content?: string;
}

export interface SnapshotPart {
  type: 'snapshot';
  data: unknown;
}

// SSE Event Types
export type SSEEventType =
  | 'session.created'
  | 'session.updated'
  | 'session.status'
  | 'message.created'
  | 'message.updated'
  | 'message.part.updated'
  | 'message.deleted'
  | 'todo.updated'
  | 'error';

export interface SSEEvent<T = unknown> {
  type: SSEEventType;
  data: T;
}

export interface MessagePartDelta {
  messageId: string;
  partIndex: number;
  delta: {
    type: 'text_delta' | 'thinking_delta';
    text: string;
  };
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
}

// Config Types
export interface OpenCodeConfig {
  serverUrl: string;
  password?: string;
  model?: string;
  smallModel?: string;
  providers?: Record<string, ProviderConfig>;
}

export interface ProviderConfig {
  apiKey?: string;
  baseURL?: string;
  disabled?: boolean;
}

// Tool Types
export interface Tool {
  name: string;
  description: string;
  permission: 'allow' | 'ask' | 'deny';
}

// Todo Types
export interface Todo {
  id: string;
  content: string;
  status: 'pending' | 'in_progress' | 'completed';
  activeForm: string;
}

// Notification Types
export interface AppNotification {
  id: string;
  title: string;
  body: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  sessionId?: string;
}

// Theme Types
export type Theme = 'light' | 'dark' | 'system';
