import React, { useRef, useEffect, useState } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useOpenCode } from '@/hooks';
import {
  ChatHeader,
  ChatInput,
  MessageBubble,
  TodoList,
  TypingIndicator,
} from '@/components/chat';
import { EmptyState } from '@/components/ui';
import type { Message } from '@/types';

export default function ChatScreen() {
  const router = useRouter();
  const flatListRef = useRef<FlatList<Message>>(null);

  const {
    isConnected,
    currentSession,
    messages,
    send,
    cancel,
    isStreaming,
    todos,
    refresh,
    refreshMessages,
  } = useOpenCode();

  const [refreshing, setRefreshing] = useState(false);
  const [showTodos, setShowTodos] = useState(true);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshMessages();
    setRefreshing(false);
  };

  const handleNewSession = () => {
    router.push('/new-session');
  };

  const handleOpenSettings = () => {
    router.push('/settings');
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <MessageBubble message={item} />
  );

  const renderEmpty = () => {
    if (!isConnected) {
      return (
        <EmptyState
          icon="cloud-offline-outline"
          title="Not Connected"
          description="Connect to an OpenCode server to get started"
          actionLabel="Open Settings"
          onAction={() => router.push('/settings')}
        />
      );
    }

    if (!currentSession) {
      return (
        <EmptyState
          icon="chatbubble-ellipses-outline"
          title="No Session"
          description="Create a new session to start chatting"
          actionLabel="New Session"
          onAction={handleNewSession}
        />
      );
    }

    return (
      <EmptyState
        icon="chatbubble-outline"
        title="Start a Conversation"
        description="Type a message below to begin"
      />
    );
  };

  const renderFooter = () => {
    if (isStreaming) {
      return <TypingIndicator visible={true} />;
    }
    return null;
  };

  return (
    <View className="flex-1 bg-background">
      <ChatHeader
        session={currentSession}
        isConnected={isConnected}
        onNewSession={handleNewSession}
        onOpenSettings={handleOpenSettings}
      />

      {/* Todo List */}
      <TodoList
        todos={todos}
        visible={showTodos}
        onToggle={() => setShowTodos(!showTodos)}
      />

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          flexGrow: 1,
          paddingVertical: 16,
        }}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#71717a"
          />
        }
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => {
          if (messages.length > 0) {
            flatListRef.current?.scrollToEnd({ animated: false });
          }
        }}
      />

      <ChatInput
        onSend={send}
        onCancel={cancel}
        isStreaming={isStreaming}
        disabled={!isConnected || !currentSession}
        placeholder={
          !isConnected
            ? 'Connect to server first...'
            : !currentSession
            ? 'Create a session first...'
            : 'Ask anything...'
        }
      />
    </View>
  );
}
