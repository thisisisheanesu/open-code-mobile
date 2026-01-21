import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '@/store/app';
import { Card, EmptyState, Button } from '@/components/ui';
import { formatRelativeTime, cn } from '@/lib/utils';
import type { AppNotification } from '@/types';

export default function NotificationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const notifications = useAppStore((state) => state.notifications);
  const markNotificationRead = useAppStore((state) => state.markNotificationRead);
  const clearNotifications = useAppStore((state) => state.clearNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotificationPress = (notification: AppNotification) => {
    markNotificationRead(notification.id);
    if (notification.sessionId) {
      router.dismiss();
    }
  };

  const getNotificationIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'success':
        return { name: 'checkmark-circle', color: '#16a34a' };
      case 'warning':
        return { name: 'warning', color: '#f59e0b' };
      case 'error':
        return { name: 'alert-circle', color: '#dc2626' };
      default:
        return { name: 'information-circle', color: '#3b82f6' };
    }
  };

  const renderNotification = ({ item }: { item: AppNotification }) => {
    const icon = getNotificationIcon(item.type);

    return (
      <TouchableOpacity
        onPress={() => handleNotificationPress(item)}
        activeOpacity={0.7}
      >
        <Card
          className={cn(
            'mx-4 mb-3',
            !item.read && 'border-primary/30 bg-primary/5'
          )}
        >
          <View className="flex-row items-start">
            <View
              className="rounded-full p-2 mr-3"
              style={{ backgroundColor: `${icon.color}15` }}
            >
              <Ionicons
                name={icon.name as any}
                size={20}
                color={icon.color}
              />
            </View>

            <View className="flex-1">
              <View className="flex-row items-center">
                <Text
                  className={cn(
                    'flex-1 text-base font-semibold',
                    !item.read ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {item.title}
                </Text>
                {!item.read && (
                  <View className="w-2 h-2 rounded-full bg-primary ml-2" />
                )}
              </View>
              <Text className="text-sm text-muted-foreground mt-1">
                {item.body}
              </Text>
              <Text className="text-xs text-muted-foreground mt-2">
                {formatRelativeTime(item.timestamp)}
              </Text>
            </View>
          </View>
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

        <View className="flex-row items-center">
          <Text className="text-lg font-semibold text-foreground">
            Notifications
          </Text>
          {unreadCount > 0 && (
            <View className="ml-2 px-2 py-0.5 rounded-full bg-primary">
              <Text className="text-xs font-medium text-primary-foreground">
                {unreadCount}
              </Text>
            </View>
          )}
        </View>

        {notifications.length > 0 && (
          <TouchableOpacity
            onPress={clearNotifications}
            className="p-2 -mr-2"
            activeOpacity={0.7}
          >
            <Ionicons name="trash-outline" size={22} color="#dc2626" />
          </TouchableOpacity>
        )}
        {notifications.length === 0 && <View className="w-10" />}
      </View>

      {/* Notifications List */}
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          flexGrow: 1,
          paddingVertical: 16,
        }}
        ListEmptyComponent={
          <EmptyState
            icon="notifications-off-outline"
            title="No Notifications"
            description="You're all caught up!"
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
