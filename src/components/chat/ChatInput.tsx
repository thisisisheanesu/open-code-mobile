import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSend: (message: string) => void;
  onCancel: () => void;
  isStreaming: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  onCancel,
  isStreaming,
  disabled = false,
  placeholder = 'Ask anything...',
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const inputRef = useRef<TextInput>(null);

  const handleSend = () => {
    if (!message.trim() || disabled) return;
    onSend(message.trim());
    setMessage('');
  };

  const handleCancel = () => {
    if (isStreaming) {
      onCancel();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View className="border-t border-border bg-background px-4 py-3">
        <View className="flex-row items-end rounded-2xl bg-secondary p-2">
          <TextInput
            ref={inputRef}
            className="flex-1 max-h-32 px-3 py-2 text-base text-foreground"
            placeholder={placeholder}
            placeholderTextColor="#71717a"
            value={message}
            onChangeText={setMessage}
            multiline
            editable={!disabled}
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />

          {isStreaming ? (
            <TouchableOpacity
              onPress={handleCancel}
              className="ml-2 rounded-full bg-destructive p-3"
              activeOpacity={0.7}
            >
              <Ionicons name="stop" size={20} color="#fff" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handleSend}
              disabled={!message.trim() || disabled}
              className={cn(
                'ml-2 rounded-full p-3',
                message.trim() && !disabled
                  ? 'bg-primary'
                  : 'bg-muted'
              )}
              activeOpacity={0.7}
            >
              <Ionicons
                name="send"
                size={20}
                color={message.trim() && !disabled ? '#fff' : '#71717a'}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
