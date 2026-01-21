import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
  Session,
  Message,
  MessagePart,
  AppNotification,
  OpenCodeConfig,
  Theme,
  Todo,
} from '@/types';
import { openCodeClient } from '@/api/client';
import { generateId } from '@/lib/utils';

interface AppState {
  // Theme
  theme: Theme;
  setTheme: (theme: Theme) => void;

  // Connection
  isConnected: boolean;
  setConnected: (connected: boolean) => void;
  serverUrl: string;
  setServerUrl: (url: string) => void;
  password: string | undefined;
  setPassword: (password: string | undefined) => void;

  // Sessions
  sessions: Session[];
  currentSessionId: string | null;
  setSessions: (sessions: Session[]) => void;
  setCurrentSession: (sessionId: string | null) => void;
  addSession: (session: Session) => void;
  updateSession: (sessionId: string, data: Partial<Session>) => void;
  removeSession: (sessionId: string) => void;

  // Messages
  messages: Record<string, Message[]>;
  setMessages: (sessionId: string, messages: Message[]) => void;
  addMessage: (sessionId: string, message: Message) => void;
  updateMessage: (sessionId: string, messageId: string, data: Partial<Message>) => void;
  appendMessagePart: (
    sessionId: string,
    messageId: string,
    partIndex: number,
    delta: string
  ) => void;

  // Todos
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;

  // Streaming State
  isStreaming: boolean;
  setStreaming: (streaming: boolean) => void;
  abortController: AbortController | null;
  setAbortController: (controller: AbortController | null) => void;

  // Notifications
  notifications: AppNotification[];
  addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;

  // Toast
  toast: {
    visible: boolean;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
  };
  showToast: (
    message: string,
    type?: 'info' | 'success' | 'warning' | 'error'
  ) => void;
  hideToast: () => void;

  // API Actions
  fetchSessions: () => Promise<void>;
  fetchMessages: (sessionId: string) => Promise<void>;
  createSession: (directory: string, agent?: 'build' | 'plan') => Promise<Session | null>;
  sendMessage: (content: string) => Promise<void>;
  cancelStreaming: () => void;
  deleteSession: (sessionId: string) => Promise<void>;
  checkConnection: () => Promise<void>;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Theme
      theme: 'system',
      setTheme: (theme) => set({ theme }),

      // Connection
      isConnected: false,
      setConnected: (isConnected) => set({ isConnected }),
      serverUrl: 'http://localhost:4096',
      setServerUrl: (serverUrl) => {
        set({ serverUrl });
        openCodeClient.setConfig({ serverUrl });
      },
      password: undefined,
      setPassword: (password) => {
        set({ password });
        openCodeClient.setConfig({ password });
      },

      // Sessions
      sessions: [],
      currentSessionId: null,
      setSessions: (sessions) => set({ sessions }),
      setCurrentSession: (currentSessionId) => set({ currentSessionId }),
      addSession: (session) =>
        set((state) => ({ sessions: [session, ...state.sessions] })),
      updateSession: (sessionId, data) =>
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === sessionId ? { ...s, ...data } : s
          ),
        })),
      removeSession: (sessionId) =>
        set((state) => ({
          sessions: state.sessions.filter((s) => s.id !== sessionId),
          currentSessionId:
            state.currentSessionId === sessionId ? null : state.currentSessionId,
        })),

      // Messages
      messages: {},
      setMessages: (sessionId, messages) =>
        set((state) => ({
          messages: { ...state.messages, [sessionId]: messages },
        })),
      addMessage: (sessionId, message) =>
        set((state) => ({
          messages: {
            ...state.messages,
            [sessionId]: [...(state.messages[sessionId] || []), message],
          },
        })),
      updateMessage: (sessionId, messageId, data) =>
        set((state) => ({
          messages: {
            ...state.messages,
            [sessionId]: (state.messages[sessionId] || []).map((m) =>
              m.id === messageId ? { ...m, ...data } : m
            ),
          },
        })),
      appendMessagePart: (sessionId, messageId, partIndex, delta) =>
        set((state) => {
          const sessionMessages = state.messages[sessionId] || [];
          const messageIndex = sessionMessages.findIndex((m) => m.id === messageId);
          if (messageIndex === -1) return state;

          const message = sessionMessages[messageIndex];
          const parts = [...message.parts];

          if (parts[partIndex] && 'text' in parts[partIndex]) {
            const part = parts[partIndex] as { type: 'text' | 'thinking'; text: string };
            parts[partIndex] = { ...part, text: part.text + delta };
          }

          const updatedMessages = [...sessionMessages];
          updatedMessages[messageIndex] = { ...message, parts };

          return {
            messages: {
              ...state.messages,
              [sessionId]: updatedMessages,
            },
          };
        }),

      // Todos
      todos: [],
      setTodos: (todos) => set({ todos }),

      // Streaming State
      isStreaming: false,
      setStreaming: (isStreaming) => set({ isStreaming }),
      abortController: null,
      setAbortController: (abortController) => set({ abortController }),

      // Notifications
      notifications: [],
      addNotification: (notification) =>
        set((state) => ({
          notifications: [
            {
              ...notification,
              id: generateId(),
              timestamp: new Date(),
              read: false,
            },
            ...state.notifications,
          ],
        })),
      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),
      clearNotifications: () => set({ notifications: [] }),

      // Toast
      toast: { visible: false, message: '', type: 'info' },
      showToast: (message, type = 'info') =>
        set({ toast: { visible: true, message, type } }),
      hideToast: () =>
        set((state) => ({ toast: { ...state.toast, visible: false } })),

      // API Actions
      fetchSessions: async () => {
        const response = await openCodeClient.listSessions();
        if (response.data) {
          set({ sessions: response.data });
        } else if (response.error) {
          get().showToast(response.error.message, 'error');
        }
      },

      fetchMessages: async (sessionId) => {
        const response = await openCodeClient.getMessages(sessionId);
        if (response.data) {
          set((state) => ({
            messages: { ...state.messages, [sessionId]: response.data! },
          }));
        } else if (response.error) {
          get().showToast(response.error.message, 'error');
        }
      },

      createSession: async (directory, agent) => {
        const response = await openCodeClient.createSession(directory, agent);
        if (response.data) {
          get().addSession(response.data);
          get().setCurrentSession(response.data.id);
          get().showToast('Session created', 'success');
          return response.data;
        } else if (response.error) {
          get().showToast(response.error.message, 'error');
        }
        return null;
      },

      sendMessage: async (content) => {
        const { currentSessionId } = get();
        if (!currentSessionId) {
          get().showToast('No session selected', 'error');
          return;
        }

        // Create user message
        const userMessage: Message = {
          id: generateId(),
          sessionId: currentSessionId,
          role: 'user',
          status: 'completed',
          parts: [{ type: 'text', text: content }],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        get().addMessage(currentSessionId, userMessage);

        // Create assistant message placeholder
        const assistantMessage: Message = {
          id: generateId(),
          sessionId: currentSessionId,
          role: 'assistant',
          status: 'streaming',
          parts: [{ type: 'text', text: '' }],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        get().addMessage(currentSessionId, assistantMessage);

        const abortController = new AbortController();
        set({ isStreaming: true, abortController });

        try {
          await openCodeClient.sendMessage(
            currentSessionId,
            content,
            (event) => {
              const state = get();
              const sessionId = state.currentSessionId;
              if (!sessionId) return;

              switch (event.type) {
                case 'message.part.updated': {
                  const delta = event.data as {
                    messageId: string;
                    partIndex: number;
                    delta: { type: string; text: string };
                  };
                  state.appendMessagePart(
                    sessionId,
                    assistantMessage.id,
                    delta.partIndex,
                    delta.delta.text
                  );
                  break;
                }
                case 'message.updated': {
                  const message = event.data as Message;
                  state.updateMessage(sessionId, message.id, message);
                  break;
                }
                case 'todo.updated': {
                  const todos = event.data as Todo[];
                  state.setTodos(todos);
                  break;
                }
                case 'session.updated': {
                  const session = event.data as Session;
                  state.updateSession(session.id, session);
                  break;
                }
              }
            },
            abortController
          );

          get().updateMessage(currentSessionId, assistantMessage.id, {
            status: 'completed',
          });
        } catch (error) {
          if ((error as Error).name !== 'AbortError') {
            get().showToast('Failed to send message', 'error');
            get().updateMessage(currentSessionId, assistantMessage.id, {
              status: 'error',
            });
          }
        } finally {
          set({ isStreaming: false, abortController: null });
        }
      },

      cancelStreaming: () => {
        const { abortController } = get();
        if (abortController) {
          abortController.abort();
          set({ isStreaming: false, abortController: null });
          get().showToast('Request cancelled', 'info');
        }
      },

      deleteSession: async (sessionId) => {
        const response = await openCodeClient.deleteSession(sessionId);
        if (!response.error) {
          get().removeSession(sessionId);
          get().showToast('Session deleted', 'success');
        } else {
          get().showToast(response.error.message, 'error');
        }
      },

      checkConnection: async () => {
        const connected = await openCodeClient.healthCheck();
        set({ isConnected: connected });
        if (!connected) {
          get().showToast('Cannot connect to server', 'error');
        }
      },
    }),
    {
      name: 'opencode-mobile-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        theme: state.theme,
        serverUrl: state.serverUrl,
        password: state.password,
        currentSessionId: state.currentSessionId,
      }),
    }
  )
);
