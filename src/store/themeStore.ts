import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import {
  createJSONStorage,
  persist,
} from 'zustand/middleware';

type ThemeState = {
  isDark: boolean;

  toggleTheme: () => void;

  setDark: (value: boolean) => void;
};

export const useThemeStore =
  create<ThemeState>()(
    persist(
      (set) => ({
        isDark: false,

        toggleTheme: () =>
          set((state) => ({
            isDark: !state.isDark,
          })),

        setDark: (value) =>
          set({
            isDark: value,
          }),
      }),
      {
        name: 'campusbooking-theme',

        storage:
          createJSONStorage(
            () => AsyncStorage
          ),
      }
    )
  );