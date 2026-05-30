import React from 'react';
import { StyleSheet, Text, type TextProps } from 'react-native';

type TypographyProps = TextProps & {
  children: React.ReactNode;
};

export function Title({ children, style, ...props }: TypographyProps) {
  return (
    <Text style={[styles.title, style]} {...props}>
      {children}
    </Text>
  );
}

export function Subtitle({ children, style, ...props }: TypographyProps) {
  return (
    <Text style={[styles.subtitle, style]} {...props}>
      {children}
    </Text>
  );
}

export function Label({ children, style, ...props }: TypographyProps) {
  return (
    <Text style={[styles.label, style]} {...props}>
      {children}
    </Text>
  );
}

export function Value({ children, style, ...props }: TypographyProps) {
  return (
    <Text style={[styles.value, style]} {...props}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },
  value: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
  },
});
