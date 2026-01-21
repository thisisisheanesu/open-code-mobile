import type {
  Session,
  Message,
  OpenCodeConfig,
  SSEEvent,
  SSEEventType,
  ApiResponse,
  ApiError,
} from '@/types';

const DEFAULT_CONFIG: OpenCodeConfig = {
  serverUrl: 'http://localhost:4096',
};

class OpenCodeClient {
  private config: OpenCodeConfig;
  private eventSource: EventSource | null = null;
  private eventListeners: Map<SSEEventType, Set<(data: unknown) => void>> = new Map();

  constructor(config?: Partial<OpenCodeConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  setConfig(config: Partial<OpenCodeConfig>) {
    this.config = { ...this.config, ...config };
  }

  getConfig(): OpenCodeConfig {
    return { ...this.config };
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.config.password) {
      headers['Authorization'] = `Basic ${btoa(`:${this.config.password}`)}`;
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.config.serverUrl}${endpoint}`, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers,
        },
      });

      if (!response.ok) {
        const error: ApiError = {
          code: response.status.toString(),
          message: response.statusText || 'Request failed',
        };
        return { error };
      }

      const data = await response.json();
      return { data };
    } catch (err) {
      const error: ApiError = {
        code: 'NETWORK_ERROR',
        message: err instanceof Error ? err.message : 'Network error',
      };
      return { error };
    }
  }

  // Session Methods
  async createSession(directory: string, agent?: 'build' | 'plan'): Promise<ApiResponse<Session>> {
    return this.request<Session>('/session', {
      method: 'POST',
      body: JSON.stringify({ directory, agent }),
    });
  }

  async getSession(sessionId: string): Promise<ApiResponse<Session>> {
    return this.request<Session>(`/session/${sessionId}`);
  }

  async listSessions(): Promise<ApiResponse<Session[]>> {
    return this.request<Session[]>('/session');
  }

  async updateSession(
    sessionId: string,
    data: Partial<Pick<Session, 'title' | 'agent'>>
  ): Promise<ApiResponse<Session>> {
    return this.request<Session>(`/session/${sessionId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteSession(sessionId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/session/${sessionId}`, {
      method: 'DELETE',
    });
  }

  // Message Methods
  async getMessages(sessionId: string): Promise<ApiResponse<Message[]>> {
    return this.request<Message[]>(`/session/${sessionId}/messages`);
  }

  async getMessage(sessionId: string, messageId: string): Promise<ApiResponse<Message>> {
    return this.request<Message>(`/session/${sessionId}/message/${messageId}`);
  }

  async deleteMessage(sessionId: string, messageId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/session/${sessionId}/message/${messageId}`, {
      method: 'DELETE',
    });
  }

  // Streaming Message
  async sendMessage(
    sessionId: string,
    content: string,
    onEvent: (event: SSEEvent) => void,
    abortController?: AbortController
  ): Promise<void> {
    const response = await fetch(`${this.config.serverUrl}/session/${sessionId}/message`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ content, stream: true }),
      signal: abortController?.signal,
    });

    if (!response.ok) {
      throw new Error(`Failed to send message: ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('event: ')) {
          const eventType = line.slice(7).trim() as SSEEventType;
          const dataLine = lines[lines.indexOf(line) + 1];
          if (dataLine?.startsWith('data: ')) {
            try {
              const data = JSON.parse(dataLine.slice(6));
              onEvent({ type: eventType, data });
            } catch {
              // Ignore parse errors
            }
          }
        } else if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            onEvent({ type: 'message.updated', data });
          } catch {
            // Ignore parse errors
          }
        }
      }
    }
  }

  // Server-Sent Events for Real-time Updates
  subscribeToEvents(sessionId?: string): void {
    if (this.eventSource) {
      this.eventSource.close();
    }

    const url = sessionId
      ? `${this.config.serverUrl}/event?sessionId=${sessionId}`
      : `${this.config.serverUrl}/global/event`;

    this.eventSource = new EventSource(url);

    this.eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const eventType = data.type as SSEEventType;
        const listeners = this.eventListeners.get(eventType);
        if (listeners) {
          listeners.forEach((listener) => listener(data));
        }
      } catch {
        // Ignore parse errors
      }
    };

    this.eventSource.onerror = (error) => {
      console.error('SSE Error:', error);
      // Attempt to reconnect after a delay
      setTimeout(() => {
        if (this.eventSource?.readyState === EventSource.CLOSED) {
          this.subscribeToEvents(sessionId);
        }
      }, 5000);
    };
  }

  addEventListener<T = unknown>(
    eventType: SSEEventType,
    listener: (data: T) => void
  ): () => void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, new Set());
    }

    this.eventListeners.get(eventType)!.add(listener as (data: unknown) => void);

    return () => {
      this.eventListeners.get(eventType)?.delete(listener as (data: unknown) => void);
    };
  }

  unsubscribeFromEvents(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    this.eventListeners.clear();
  }

  // Config Methods
  async getServerConfig(): Promise<ApiResponse<Record<string, unknown>>> {
    return this.request<Record<string, unknown>>('/config');
  }

  async updateServerConfig(config: Record<string, unknown>): Promise<ApiResponse<void>> {
    return this.request<void>('/config', {
      method: 'PUT',
      body: JSON.stringify(config),
    });
  }

  // Health Check
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.serverUrl}/doc`, {
        headers: this.getHeaders(),
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const openCodeClient = new OpenCodeClient();

// Export class for testing/multiple instances
export { OpenCodeClient };
