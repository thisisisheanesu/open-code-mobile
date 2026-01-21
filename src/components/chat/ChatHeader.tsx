import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import type { Session } from '@/types';
import { Badge } from '../ui/Badge';
import { truncateText } from '@/lib/utils';

interface ChatHeaderProps {
  session: Session | null;
  isConnected: boolean;
  onNewSession: () => void;
  onOpenSettings: () => void;
}

export function ChatHeader({
  session,
  isConnected,
  onNewSession,
  onOpenSettings,
}: ChatHeaderProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View
      className="bg-background border-b border-border"
      style={{ paddingTop: insets.top }}
    >
      <View className="flex-row items-center justify-between px-4 py-3">
        {/* Left: Menu / Sessions */}
        <TouchableOpacity
          onPress={() => router.push('/sessions')}
          className="flex-row items-center"
          activeOpacity={0.7}
        >
          <Ionicons name="menu" size={24} color="#18181b" />
        </TouchableOpacity>

        {/* Center: Session Info */}
        <View className="flex-1 mx-4 items-center">
          {session ? (
            <>
              <Text className="text-base font-semibold text-foreground" numberOfLines={1}>
                {session.title || truncateText(session.directory.split('/').pop() || 'Session', 20)}
              </Text>
              <View className="flex-row items-center mt-1">
                <Badge
                  variant={session.status === 'idle' ? 'secondary' : session.status === 'busy' ? 'warning' : 'destructive'}
                >
                  {session.status}
                </Badge>
                <Text className="ml-2 text-xs text-muted-foreground">
                  {session.agent}
                </Text>
              </View>
            </>
          ) : (
            <Text className="text-base font-semibold text-foreground">
              OpenCode
            </Text>
          )}
        </View>

        {/* Right: Actions */}
        <View className="flex-row items-center">
          {/* Connection indicator */}
          <View
            className={`w-2 h-2 rounded-full mr-3 ${
              isConnected ? 'bg-success' : 'bg-destructive'
            }`}
          />

          {/* New session */}
          <TouchableOpacity
            onPress={onNewSession}
            className="mr-2 p-2"
            activeOpacity={0.7}
          >
            <Ionicons name="add-circle-outline" size={24} color="#18181b" />
          </TouchableOpacity>

          {/* Settings */}
          <TouchableOpacity
            onPress={onOpenSettings}
            className="p-2"
            activeOpacity={0.7}
          >
            <Ionicons name="settings-outline" size={24} color="#18181b" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
