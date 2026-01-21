import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useOpenCode } from '@/hooks';
import { Button, Input, Card, CardContent } from '@/components/ui';
import { cn } from '@/lib/utils';

type AgentType = 'build' | 'plan';

export default function NewSessionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { newSession, isConnected } = useOpenCode();

  const [directory, setDirectory] = useState('/home/user/project');
  const [agent, setAgent] = useState<AgentType>('build');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!directory.trim()) return;

    setLoading(true);
    const session = await newSession(directory.trim(), agent);
    setLoading(false);

    if (session) {
      router.dismissAll();
    }
  };

  const agents: { type: AgentType; name: string; description: string; icon: string }[] = [
    {
      type: 'build',
      name: 'Build',
      description: 'Full tool access for active development work',
      icon: 'hammer-outline',
    },
    {
      type: 'plan',
      name: 'Plan',
      description: 'Read-only access for code analysis and planning',
      icon: 'map-outline',
    },
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

        <Text className="text-lg font-semibold text-foreground">New Session</Text>

        <View className="w-10" />
      </View>

      <ScrollView className="flex-1 px-4 py-6">
        {/* Directory Input */}
        <View className="mb-6">
          <Input
            label="Working Directory"
            placeholder="/path/to/project"
            value={directory}
            onChangeText={setDirectory}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Text className="mt-2 text-xs text-muted-foreground">
            The directory where OpenCode will operate
          </Text>
        </View>

        {/* Agent Selection */}
        <View className="mb-6">
          <Text className="mb-3 text-sm font-medium text-foreground">
            Select Agent
          </Text>

          {agents.map((item) => (
            <TouchableOpacity
              key={item.type}
              onPress={() => setAgent(item.type)}
              activeOpacity={0.7}
            >
              <Card
                className={cn(
                  'mb-3',
                  agent === item.type && 'border-primary bg-primary/5'
                )}
              >
                <CardContent className="flex-row items-center">
                  <View
                    className={cn(
                      'rounded-lg p-2.5 mr-4',
                      agent === item.type ? 'bg-primary' : 'bg-muted'
                    )}
                  >
                    <Ionicons
                      name={item.icon as any}
                      size={20}
                      color={agent === item.type ? '#fff' : '#71717a'}
                    />
                  </View>

                  <View className="flex-1">
                    <Text
                      className={cn(
                        'text-base font-semibold',
                        agent === item.type ? 'text-primary' : 'text-foreground'
                      )}
                    >
                      {item.name}
                    </Text>
                    <Text className="text-sm text-muted-foreground">
                      {item.description}
                    </Text>
                  </View>

                  <View
                    className={cn(
                      'w-5 h-5 rounded-full border-2',
                      agent === item.type
                        ? 'border-primary bg-primary'
                        : 'border-muted-foreground'
                    )}
                  >
                    {agent === item.type && (
                      <View className="flex-1 items-center justify-center">
                        <Ionicons name="checkmark" size={12} color="#fff" />
                      </View>
                    )}
                  </View>
                </CardContent>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        {/* Agent Permissions Info */}
        <Card className="mb-6 bg-muted/50">
          <CardContent>
            <View className="flex-row items-center mb-2">
              <Ionicons name="information-circle-outline" size={16} color="#71717a" />
              <Text className="ml-2 text-sm font-medium text-muted-foreground">
                Agent Permissions
              </Text>
            </View>
            {agent === 'build' ? (
              <View>
                <PermissionItem icon="terminal" label="Execute bash commands" allowed />
                <PermissionItem icon="create-outline" label="Edit files" allowed />
                <PermissionItem icon="document-text-outline" label="Write new files" allowed />
                <PermissionItem icon="globe-outline" label="Web requests" allowed />
              </View>
            ) : (
              <View>
                <PermissionItem icon="terminal" label="Execute bash commands" allowed={false} />
                <PermissionItem icon="create-outline" label="Edit files" allowed={false} />
                <PermissionItem icon="document-text-outline" label="Read files" allowed />
                <PermissionItem icon="search-outline" label="Search codebase" allowed />
              </View>
            )}
          </CardContent>
        </Card>
      </ScrollView>

      {/* Create Button */}
      <View className="px-4 pb-4" style={{ paddingBottom: insets.bottom + 16 }}>
        <Button
          onPress={handleCreate}
          loading={loading}
          disabled={!directory.trim() || !isConnected}
        >
          Create Session
        </Button>
        {!isConnected && (
          <Text className="mt-2 text-center text-sm text-destructive">
            Not connected to server
          </Text>
        )}
      </View>
    </View>
  );
}

function PermissionItem({
  icon,
  label,
  allowed,
}: {
  icon: string;
  label: string;
  allowed: boolean;
}) {
  return (
    <View className="flex-row items-center py-1">
      <Ionicons
        name={allowed ? 'checkmark-circle' : 'close-circle'}
        size={14}
        color={allowed ? '#16a34a' : '#dc2626'}
      />
      <Ionicons
        name={icon as any}
        size={12}
        color="#71717a"
        style={{ marginLeft: 8 }}
      />
      <Text className="ml-2 text-sm text-muted-foreground">{label}</Text>
    </View>
  );
}
