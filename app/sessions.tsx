import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useOpenCode } from '@/hooks';
import { Card, Badge, EmptyState, AlertDialog, Separator } from '@/components/ui';
import { formatRelativeTime, truncateText } from '@/lib/utils';
import type { Session } from '@/types';

export default function SessionsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { sessions, currentSession, selectSession, removeSession, refresh } = useOpenCode();

  const [refreshing, setRefreshing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const handleSelectSession = (sessionId: string) => {
    selectSession(sessionId);
    router.back();
  };

  const handleDeleteSession = (sessionId: string) => {
    setSessionToDelete(sessionId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (sessionToDelete) {
      await removeSession(sessionToDelete);
      setSessionToDelete(null);
    }
  };

  const renderSession = ({ item }: { item: Session }) => {
    const isSelected = currentSession?.id === item.id;

    return (
      <TouchableOpacity
        onPress={() => handleSelectSession(item.id)}
        activeOpacity={0.7}
      >
        <Card
          className={`mx-4 mb-3 ${isSelected ? 'border-primary' : ''}`}
        >
          <View className="flex-row items-start justify-between">
            <View className="flex-1">
              <View className="flex-row items-center">
                <Ionicons
                  name="folder-outline"
                  size={16}
                  color="#71717a"
                />
                <Text className="ml-2 text-base font-semibold text-foreground" numberOfLines={1}>
                  {item.title || truncateText(item.directory.split('/').pop() || 'Session', 25)}
                </Text>
              </View>
              <Text className="mt-1 text-sm text-muted-foreground" numberOfLines={1}>
                {item.directory}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => handleDeleteSession(item.id)}
              className="p-2 ml-2"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="trash-outline" size={18} color="#dc2626" />
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center mt-3">
            <Badge
              variant={
                item.status === 'idle'
                  ? 'secondary'
                  : item.status === 'busy'
                  ? 'warning'
                  : 'destructive'
              }
            >
              {item.status}
            </Badge>
            <View className="ml-2 px-2 py-0.5 rounded-full bg-muted">
              <Text className="text-xs text-muted-foreground">
                {item.agent}
              </Text>
            </View>
            <Text className="ml-auto text-xs text-muted-foreground">
              {formatRelativeTime(item.updatedAt)}
            </Text>
          </View>

          {item.usage && (
            <View className="flex-row items-center mt-2 pt-2 border-t border-border">
              <Ionicons name="speedometer-outline" size={12} color="#71717a" />
              <Text className="ml-1 text-xs text-muted-foreground">
                {item.usage.totalTokens.toLocaleString()} tokens
              </Text>
              {item.usage.cost !== undefined && (
                <>
                  <Text className="mx-1 text-xs text-muted-foreground">•</Text>
                  <Text className="text-xs text-muted-foreground">
                    ${item.usage.cost.toFixed(4)}
                  </Text>
                </>
              )}
            </View>
          )}
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-border">
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2 -ml-2"
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={24} color="#18181b" />
        </TouchableOpacity>

        <Text className="text-lg font-semibold text-foreground">Sessions</Text>

        <TouchableOpacity
          onPress={() => router.push('/new-session')}
          className="p-2 -mr-2"
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={24} color="#18181b" />
        </TouchableOpacity>
      </View>

      {/* Sessions List */}
      <FlatList
        data={sessions}
        renderItem={renderSession}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          flexGrow: 1,
          paddingVertical: 16,
        }}
        ListEmptyComponent={
          <EmptyState
            icon="folder-open-outline"
            title="No Sessions"
            description="Create a new session to get started"
            actionLabel="New Session"
            onAction={() => router.push('/new-session')}
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#71717a"
          />
        }
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View className="h-0" />}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Session"
        description="Are you sure you want to delete this session? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </View>
  );
}
