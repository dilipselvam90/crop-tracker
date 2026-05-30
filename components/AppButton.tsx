import React from 'react';
import { GestureResponderEvent, Pressable, StyleSheet, Text } from 'react-native';

type ButtonVariant = 'primary' | 'secondary' | 'danger';

type Props = {
  title: string;
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  variant?: ButtonVariant;
};

export function AppButton({ title, onPress, disabled, variant = 'primary' }: Props) {
  const buttonStyle = disabled
    ? styles.disabled
    : variant === 'secondary'
    ? styles.secondary
    : variant === 'danger'
    ? styles.danger
    : styles.primary;

  const textStyle = variant === 'secondary' && !disabled ? styles.secondaryText : styles.text;

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      style={[styles.button, buttonStyle]}
      accessibilityRole="button"
      disabled={disabled}
    >
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  primary: {
    backgroundColor: '#ff9946',
  },
  secondary: {
    backgroundColor: '#0f8925',
  },
  danger: {
    backgroundColor: '#dc2626',
  },
  disabled: {
    backgroundColor: '#9ca3af',
  },
  text: {
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: '600',
  },
  secondaryText: {
    color: '#ffffff',
  },
});
