import { useEffect, useCallback } from 'react';
import { useAppStore } from '@/store/app';
import { openCodeClient } from '@/api/client';
import type { Session, Message, SSEEventType } from '@/types';

export function useOpenCode() {
  const {
    isConnected,
    serverUrl,
    password,
    sessions,
    currentSessionId,
    messages,
    isStreaming,
    todos,
    fetchSessions,
    fetchMessages,
    createSession,
    sendMessage,
    cancelStreaming,
    deleteSession,
    checkConnection,
    setServerUrl,
    setPassword,
    setCurrentSession,
    updateSession,
    addNotification,
    setTodos,
  } = useAppStore();

  // Initialize client config on mount
  useEffect(() => {
    openCodeClient.setConfig({ serverUrl, password });
  }, [serverUrl, password]);

  // Check connection on mount and when serverUrl changes
  useEffect(() => {
    checkConnection();
  }, [serverUrl]);

  // Fetch sessions when connected
  useEffect(() => {
    if (isConnected) {
      fetchSessions();
    }
  }, [isConnected]);

  // Subscribe to SSE events when connected
  useEffect(() => {
    if (!isConnected) return;

    openCodeClient.subscribeToEvents();

    const unsubscribeSession = openCodeClient.addEventListener<Session>(
      'session.updated',
      (session) => {
        updateSession(session.id, session);
      }
    );

    const unsubscribeSessionStatus = openCodeClient.addEventListener<{
      sessionId: string;
      status: string;
    }>('session.status', (data) => {
      updateSession(data.sessionId, { status: data.status as Session['status'] });
    });

    const unsubscribeTodo = openCodeClient.addEventListener<unknown[]>(
      'todo.updated',
      (todos) => {
        setTodos(todos as any);
      }
    );

    return () => {
      unsubscribeSession();
      unsubscribeSessionStatus();
      unsubscribeTodo();
      openCodeClient.unsubscribeFromEvents();
    };
  }, [isConnected]);

  // Fetch messages when current session changes
  useEffect(() => {
    if (currentSessionId && isConnected) {
      fetchMessages(currentSessionId);
    }
  }, [currentSessionId, isConnected]);

  const currentSession = sessions.find((s) => s.id === currentSessionId) || null;
  const currentMessages = currentSessionId ? messages[currentSessionId] || [] : [];

  const connect = useCallback(
    async (url: string, pwd?: string) => {
      setServerUrl(url);
      if (pwd) setPassword(pwd);
      await checkConnection();
    },
    [setServerUrl, setPassword, checkConnection]
  );

  const selectSession = useCallback(
    (sessionId: string | null) => {
      setCurrentSession(sessionId);
    },
    [setCurrentSession]
  );

  const newSession = useCallback(
    async (directory: string, agent?: 'build' | 'plan') => {
      const session = await createSession(directory, agent);
      if (session) {
        addNotification({
          title: 'New Session',
          body: `Session created in ${directory}`,
          type: 'success',
        });
      }
      return session;
    },
    [createSession, addNotification]
  );

  const send = useCallback(
    async (content: string) => {
      if (!content.trim()) return;
      await sendMessage(content);
    },
    [sendMessage]
  );

  const cancel = useCallback(() => {
    cancelStreaming();
  }, [cancelStreaming]);

  const removeSession = useCallback(
    async (sessionId: string) => {
      await deleteSession(sessionId);
    },
    [deleteSession]
  );

  return {
    // Connection
    isConnected,
    serverUrl,
    connect,

    // Sessions
    sessions,
    currentSession,
    selectSession,
    newSession,
    removeSession,

    // Messages
    messages: currentMessages,
    send,
    cancel,
    isStreaming,

    // Todos
    todos,

    // Refresh
    refresh: fetchSessions,
    refreshMessages: () => currentSessionId && fetchMessages(currentSessionId),
  };
}
