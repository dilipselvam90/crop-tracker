import React from 'react';
import { GestureResponderEvent, Pressable, StyleSheet, Text } from 'react-native';

type Props = {
  title: string;
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
};

export function AppButton({ title, onPress, disabled }: Props) {
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      style={[styles.button, disabled ? styles.disabled : styles.active]}
      accessibilityRole="button"
      disabled={disabled}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  active: {
    backgroundColor: '#2563eb',
  },
  disabled: {
    backgroundColor: '#9ca3af',
  },
  text: {
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: '600',
  },
});
