import { useThemeStore } from '../store/themeStore';
import { lightColors } from './colors';
import { darkColors } from './darkColors';

export function useAppTheme() {
  const isDark = useThemeStore(
    (state) => state.isDark
  );

  const colors = isDark
    ? darkColors
    : lightColors;

  return {
    colors,
    isDark,
  };
}