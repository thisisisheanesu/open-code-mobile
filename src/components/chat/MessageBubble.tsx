import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { cn, formatRelativeTime, parseToolName } from '@/lib/utils';
import type { Message, MessagePart, ToolUsePart, ToolResultPart } from '@/types';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { useAppStore } from '@/store/app';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const showToast = useAppStore((state) => state.showToast);
  const isUser = message.role === 'user';
  const isStreaming = message.status === 'streaming';

  const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text);
    showToast('Copied to clipboard', 'success');
  };

  const getTextContent = () => {
    return message.parts
      .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
      .map((p) => p.text)
      .join('\n');
  };

  return (
    <View
      className={cn(
        'mb-4 px-4',
        isUser ? 'items-end' : 'items-start'
      )}
    >
      <View
        className={cn(
          'max-w-[90%] rounded-2xl p-4',
          isUser
            ? 'bg-primary rounded-br-sm'
            : 'bg-secondary rounded-bl-sm'
        )}
      >
        {/* Role indicator */}
        <View className="flex-row items-center mb-2">
          <Ionicons
            name={isUser ? 'person' : 'logo-electron'}
            size={14}
            color={isUser ? '#fff' : '#71717a'}
          />
          <Text
            className={cn(
              'ml-1 text-xs font-medium',
              isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
            )}
          >
            {isUser ? 'You' : 'Assistant'}
          </Text>
          {isStreaming && (
            <View className="ml-2 flex-row items-center">
              <View className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <Text className="ml-1 text-xs text-muted-foreground">
                Streaming...
              </Text>
            </View>
          )}
        </View>

        {/* Message parts */}
        {message.parts.map((part, index) => (
          <MessagePartRenderer
            key={index}
            part={part}
            isUser={isUser}
          />
        ))}

        {/* Footer */}
        <View className="flex-row items-center justify-between mt-2">
          <Text
            className={cn(
              'text-xs',
              isUser ? 'text-primary-foreground/50' : 'text-muted-foreground'
            )}
          >
            {formatRelativeTime(message.createdAt)}
          </Text>

          {!isUser && message.status === 'completed' && (
            <TouchableOpacity
              onPress={() => copyToClipboard(getTextContent())}
              className="p-1"
            >
              <Ionicons
                name="copy-outline"
                size={14}
                color={isUser ? '#fff' : '#71717a'}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

interface MessagePartRendererProps {
  part: MessagePart;
  isUser: boolean;
}

function MessagePartRenderer({ part, isUser }: MessagePartRendererProps) {
  const [expanded, setExpanded] = useState(false);

  switch (part.type) {
    case 'text':
      return (
        <Text
          className={cn(
            'text-base leading-6',
            isUser ? 'text-primary-foreground' : 'text-foreground'
          )}
          selectable
        >
          {part.text}
        </Text>
      );

    case 'thinking':
      return (
        <Pressable onPress={() => setExpanded(!expanded)}>
          <View className="mt-2 rounded-lg bg-muted/50 p-3">
            <View className="flex-row items-center">
              <Ionicons name="bulb-outline" size={14} color="#71717a" />
              <Text className="ml-1 text-xs font-medium text-muted-foreground">
                Thinking
              </Text>
              <Ionicons
                name={expanded ? 'chevron-up' : 'chevron-down'}
                size={14}
                color="#71717a"
                style={{ marginLeft: 'auto' }}
              />
            </View>
            {expanded && (
              <Text className="mt-2 text-sm text-muted-foreground">
                {part.text}
              </Text>
            )}
          </View>
        </Pressable>
      );

    case 'tool_use':
      return <ToolUseCard tool={part} />;

    case 'tool_result':
      return <ToolResultCard result={part} />;

    default:
      return null;
  }
}

function ToolUseCard({ tool }: { tool: ToolUsePart }) {
  const [expanded, setExpanded] = useState(false);
  const { icon, label } = parseToolName(tool.name);

  return (
    <Pressable onPress={() => setExpanded(!expanded)}>
      <View className="mt-2 rounded-lg border border-border bg-card p-3">
        <View className="flex-row items-center">
          <View className="rounded-md bg-primary/10 p-1.5">
            <Ionicons name="terminal" size={14} color="#18181b" />
          </View>
          <Text className="ml-2 flex-1 text-sm font-medium text-foreground">
            {label}
          </Text>
          <Badge variant="secondary">{tool.name}</Badge>
        </View>

        {expanded && (
          <View className="mt-3 rounded-md bg-muted p-2">
            <Text className="font-mono text-xs text-muted-foreground">
              {JSON.stringify(tool.input, null, 2)}
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

function ToolResultCard({ result }: { result: ToolResultPart }) {
  const [expanded, setExpanded] = useState(false);
  const isError = result.isError;
  const contentPreview = result.content.slice(0, 200);
  const hasMore = result.content.length > 200;

  return (
    <Pressable onPress={() => setExpanded(!expanded)}>
      <View
        className={cn(
          'mt-2 rounded-lg border p-3',
          isError ? 'border-destructive/30 bg-destructive/5' : 'border-border bg-card'
        )}
      >
        <View className="flex-row items-center">
          <Ionicons
            name={isError ? 'alert-circle' : 'checkmark-circle'}
            size={16}
            color={isError ? '#dc2626' : '#16a34a'}
          />
          <Text
            className={cn(
              'ml-2 text-sm font-medium',
              isError ? 'text-destructive' : 'text-success'
            )}
          >
            {isError ? 'Error' : 'Result'}
          </Text>
        </View>

        <View className="mt-2 rounded-md bg-muted/50 p-2">
          <Text className="font-mono text-xs text-foreground" numberOfLines={expanded ? undefined : 5}>
            {expanded ? result.content : contentPreview}
            {!expanded && hasMore && '...'}
          </Text>
        </View>

        {hasMore && (
          <Text className="mt-2 text-xs text-muted-foreground text-center">
            Tap to {expanded ? 'collapse' : 'expand'}
          </Text>
        )}
      </View>
    </Pressable>
  );
}
