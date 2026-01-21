import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeIn,
  FadeOut,
  Layout,
} from 'react-native-reanimated';
import { cn } from '@/lib/utils';
import type { Todo } from '@/types';

interface TodoListProps {
  todos: Todo[];
  visible: boolean;
  onToggle: () => void;
}

export function TodoList({ todos, visible, onToggle }: TodoListProps) {
  if (todos.length === 0) return null;

  const completedCount = todos.filter((t) => t.status === 'completed').length;
  const progress = (completedCount / todos.length) * 100;

  return (
    <View className="border-b border-border bg-card">
      <TouchableOpacity
        onPress={onToggle}
        className="flex-row items-center justify-between px-4 py-3"
        activeOpacity={0.7}
      >
        <View className="flex-row items-center">
          <Ionicons name="checkbox-outline" size={18} color="#71717a" />
          <Text className="ml-2 text-sm font-medium text-foreground">
            Tasks
          </Text>
          <View className="ml-2 px-2 py-0.5 rounded-full bg-muted">
            <Text className="text-xs text-muted-foreground">
              {completedCount}/{todos.length}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center">
          {/* Progress bar */}
          <View className="w-20 h-1.5 rounded-full bg-muted mr-2">
            <View
              className="h-full rounded-full bg-success"
              style={{ width: `${progress}%` }}
            />
          </View>
          <Ionicons
            name={visible ? 'chevron-up' : 'chevron-down'}
            size={18}
            color="#71717a"
          />
        </View>
      </TouchableOpacity>

      {visible && (
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
          layout={Layout.springify()}
          className="px-4 pb-3"
        >
          {todos.map((todo, index) => (
            <TodoItem key={todo.id || index} todo={todo} />
          ))}
        </Animated.View>
      )}
    </View>
  );
}

function TodoItem({ todo }: { todo: Todo }) {
  const getStatusIcon = () => {
    switch (todo.status) {
      case 'completed':
        return { name: 'checkmark-circle', color: '#16a34a' };
      case 'in_progress':
        return { name: 'ellipsis-horizontal-circle', color: '#f59e0b' };
      default:
        return { name: 'ellipse-outline', color: '#71717a' };
    }
  };

  const icon = getStatusIcon();

  return (
    <View className="flex-row items-center py-2">
      <Ionicons
        name={icon.name as any}
        size={16}
        color={icon.color}
      />
      <Text
        className={cn(
          'ml-2 text-sm',
          todo.status === 'completed'
            ? 'text-muted-foreground line-through'
            : todo.status === 'in_progress'
            ? 'text-warning font-medium'
            : 'text-foreground'
        )}
      >
        {todo.status === 'in_progress' ? todo.activeForm : todo.content}
      </Text>
    </View>
  );
}
