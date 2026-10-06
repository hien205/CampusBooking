import React, { useEffect } from 'react';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import AppNavigator from './src/navigation/AppNavigator';
import { useBookingStore } from './src/store/bookingStore';
import { useAuthStore } from './src/store/authStore';
import { useThemeStore } from './src/store/themeStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
    },
  },
});

function AppContent() {
  const loadBookings = useBookingStore((state) => state.loadBookings);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  const isDark = useThemeStore((state) => state.isDark);

  useEffect(() => {
    loadBookings();

    const unsubscribe = initializeAuth();

    return unsubscribe;
  }, [loadBookings, initializeAuth]);

  return (
    <NavigationContainer
      theme={isDark ? DarkTheme : DefaultTheme}
    >
      <AppNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}