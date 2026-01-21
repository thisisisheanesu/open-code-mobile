import { useColorScheme as useRNColorScheme } from 'react-native';
import { useAppStore } from '@/store/app';

export function useColorScheme() {
  const systemColorScheme = useRNColorScheme();
  const theme = useAppStore((state) => state.theme);
  const setTheme = useAppStore((state) => state.setTheme);

  const resolvedTheme =
    theme === 'system' ? systemColorScheme || 'light' : theme;

  return {
    theme,
    resolvedTheme,
    setTheme,
    isDark: resolvedTheme === 'dark',
  };
}
