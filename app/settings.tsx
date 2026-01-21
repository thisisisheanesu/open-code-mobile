import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '@/store/app';
import { useColorScheme, useOpenCode } from '@/hooks';
import {
  Button,
  Input,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Switch,
  Separator,
} from '@/components/ui';
import type { Theme } from '@/types';

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { theme, setTheme, isDark } = useColorScheme();
  const { isConnected, serverUrl, connect } = useOpenCode();
  const password = useAppStore((state) => state.password);
  const checkConnection = useAppStore((state) => state.checkConnection);

  const [url, setUrl] = useState(serverUrl);
  const [pwd, setPwd] = useState(password || '');
  const [connecting, setConnecting] = useState(false);

  const handleConnect = async () => {
    setConnecting(true);
    await connect(url, pwd || undefined);
    setConnecting(false);
  };

  const themeOptions: { value: Theme; label: string; icon: string }[] = [
    { value: 'light', label: 'Light', icon: 'sunny-outline' },
    { value: 'dark', label: 'Dark', icon: 'moon-outline' },
    { value: 'system', label: 'System', icon: 'phone-portrait-outline' },
  ];

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

        <Text className="text-lg font-semibold text-foreground">Settings</Text>

        <View className="w-10" />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Server Connection */}
        <Card className="mb-4">
          <CardHeader>
            <View className="flex-row items-center">
              <Ionicons
                name="server-outline"
                size={20}
                color={isConnected ? '#16a34a' : '#71717a'}
              />
              <CardTitle className="ml-2">Server Connection</CardTitle>
              <View
                className={`ml-auto w-2.5 h-2.5 rounded-full ${
                  isConnected ? 'bg-success' : 'bg-destructive'
                }`}
              />
            </View>
          </CardHeader>
          <CardContent>
            <Input
              label="Server URL"
              placeholder="http://localhost:4096"
              value={url}
              onChangeText={setUrl}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
              containerClassName="mb-4"
            />

            <Input
              label="Password (optional)"
              placeholder="Enter server password"
              value={pwd}
              onChangeText={setPwd}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              containerClassName="mb-4"
            />

            <Button onPress={handleConnect} loading={connecting}>
              {isConnected ? 'Reconnect' : 'Connect'}
            </Button>

            {isConnected && (
              <Text className="mt-3 text-sm text-success text-center">
                Connected to OpenCode server
              </Text>
            )}
          </CardContent>
        </Card>

        {/* Theme */}
        <Card className="mb-4">
          <CardHeader>
            <View className="flex-row items-center">
              <Ionicons name="color-palette-outline" size={20} color="#71717a" />
              <CardTitle className="ml-2">Appearance</CardTitle>
            </View>
          </CardHeader>
          <CardContent>
            <Text className="mb-3 text-sm text-muted-foreground">Theme</Text>
            <View className="flex-row">
              {themeOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => setTheme(option.value)}
                  className={`flex-1 items-center py-3 rounded-lg mx-1 ${
                    theme === option.value
                      ? 'bg-primary'
                      : 'bg-muted'
                  }`}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={option.icon as any}
                    size={20}
                    color={theme === option.value ? '#fff' : '#71717a'}
                  />
                  <Text
                    className={`mt-1 text-sm ${
                      theme === option.value
                        ? 'text-primary-foreground'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="mb-4">
          <CardHeader>
            <View className="flex-row items-center">
              <Ionicons name="notifications-outline" size={20} color="#71717a" />
              <CardTitle className="ml-2">Notifications</CardTitle>
            </View>
          </CardHeader>
          <CardContent>
            <TouchableOpacity
              onPress={() => router.push('/notifications')}
              className="flex-row items-center justify-between py-2"
              activeOpacity={0.7}
            >
              <Text className="text-base text-foreground">View Notifications</Text>
              <Ionicons name="chevron-forward" size={20} color="#71717a" />
            </TouchableOpacity>
          </CardContent>
        </Card>

        {/* About */}
        <Card className="mb-4">
          <CardHeader>
            <View className="flex-row items-center">
              <Ionicons name="information-circle-outline" size={20} color="#71717a" />
              <CardTitle className="ml-2">About</CardTitle>
            </View>
          </CardHeader>
          <CardContent>
            <View className="py-2">
              <Text className="text-sm text-muted-foreground">Version</Text>
              <Text className="text-base text-foreground">1.0.0</Text>
            </View>

            <Separator className="my-2" />

            <TouchableOpacity
              onPress={() => Linking.openURL('https://opencode.ai')}
              className="flex-row items-center justify-between py-2"
              activeOpacity={0.7}
            >
              <Text className="text-base text-foreground">OpenCode Website</Text>
              <Ionicons name="open-outline" size={20} color="#71717a" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => Linking.openURL('https://github.com/sst/opencode')}
              className="flex-row items-center justify-between py-2"
              activeOpacity={0.7}
            >
              <Text className="text-base text-foreground">GitHub Repository</Text>
              <Ionicons name="logo-github" size={20} color="#71717a" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => Linking.openURL('https://opencode.ai/docs')}
              className="flex-row items-center justify-between py-2"
              activeOpacity={0.7}
            >
              <Text className="text-base text-foreground">Documentation</Text>
              <Ionicons name="book-outline" size={20} color="#71717a" />
            </TouchableOpacity>
          </CardContent>
        </Card>
      </ScrollView>
    </View>
  );
}
