import { AppButton } from '@/components/AppButton';
import { useRouter } from 'expo-router';
import React from 'react';

export function BackButton() {
  const router = useRouter();
  return <AppButton title="Back" onPress={() => router.back()} />;
}
