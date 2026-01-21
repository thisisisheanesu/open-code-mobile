import React from 'react';
import {
  Modal as RNModal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  type ModalProps as RNModalProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cn } from '@/lib/utils';

interface ModalProps extends Omit<RNModalProps, 'children'> {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  showCloseButton = true,
  ...props
}: ModalProps) {
  return (
    <RNModal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
      {...props}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 items-center justify-center bg-black/50 px-4">
          <TouchableWithoutFeedback>
            <View className="w-full max-w-md rounded-xl bg-card p-6">
              {(title || showCloseButton) && (
                <View className="mb-4 flex-row items-start justify-between">
                  <View className="flex-1">
                    {title && (
                      <Text className="text-lg font-semibold text-card-foreground">
                        {title}
                      </Text>
                    )}
                    {description && (
                      <Text className="mt-1 text-sm text-muted-foreground">
                        {description}
                      </Text>
                    )}
                  </View>
                  {showCloseButton && (
                    <TouchableOpacity
                      onPress={onClose}
                      className="ml-2 rounded-full p-1"
                      activeOpacity={0.7}
                    >
                      <Ionicons name="close" size={24} color="#71717a" />
                    </TouchableOpacity>
                  )}
                </View>
              )}
              {children}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
}

interface AlertDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
}

export function AlertDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
}: AlertDialogProps) {
  return (
    <Modal open={open} onClose={onClose} showCloseButton={false}>
      <Text className="text-lg font-semibold text-card-foreground">{title}</Text>
      <Text className="mt-2 text-sm text-muted-foreground">{description}</Text>
      <View className="mt-6 flex-row justify-end gap-3">
        <TouchableOpacity
          onPress={onClose}
          className="rounded-lg border border-border px-4 py-2"
          activeOpacity={0.7}
        >
          <Text className="font-medium text-foreground">{cancelText}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onConfirm();
            onClose();
          }}
          className={cn(
            'rounded-lg px-4 py-2',
            variant === 'destructive' ? 'bg-destructive' : 'bg-primary'
          )}
          activeOpacity={0.7}
        >
          <Text
            className={cn(
              'font-medium',
              variant === 'destructive'
                ? 'text-destructive-foreground'
                : 'text-primary-foreground'
            )}
          >
            {confirmText}
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}
