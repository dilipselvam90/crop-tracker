import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { AppProvider } from '@/context/AppContext';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AppProvider>
        <Stack
          screenOptions={{
            headerShown: true,
            headerStyle: {
              backgroundColor: '#ffffff',
            },
            headerTitleStyle: {
              fontWeight: '600',
            },
            headerTintColor: '#007bff',
          }}
        >
          <Stack.Screen name="index" />
        </Stack>
      </AppProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
