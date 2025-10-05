import { CheatTheme, ThemeStyle } from '@/types/cheat';

export const themes: Record<ThemeStyle, CheatTheme> = {
  astolfo: {
    name: 'Astolfo',
    style: 'astolfo',
    colors: {
      primary: '#FF006E',
      secondary: '#8338EC',
      accent: '#3A86FF',
      background: '#0A0E27'
    }
  },
  vape: {
    name: 'Vape V4',
    style: 'vape',
    colors: {
      primary: '#00D9FF',
      secondary: '#0099FF',
      accent: '#FFFFFF',
      background: 'rgba(0, 0, 0, 0.7)'
    }
  },
  nursultan: {
    name: 'Nursultan NextGen',
    style: 'nursultan',
    colors: {
      primary: '#9B59B6',
      secondary: '#E74C3C',
      accent: '#F39C12',
      background: '#1A1A2E'
    }
  },
  celestial: {
    name: 'Celestial Recode',
    style: 'celestial',
    colors: {
      primary: '#00FFFF',
      secondary: '#FF00FF',
      accent: '#FFFF00',
      background: '#0F0F23'
    }
  },
  raven: {
    name: 'Raven B++',
    style: 'raven',
    colors: {
      primary: '#FF4655',
      secondary: '#1E1E1E',
      accent: '#FFFFFF',
      background: '#121212'
    }
  },
  novoline: {
    name: 'Novoline',
    style: 'novoline',
    colors: {
      primary: '#00C9FF',
      secondary: '#92FE9D',
      accent: '#FFFFFF',
      background: 'rgba(20, 20, 20, 0.95)'
    }
  }
};

export const getTheme = (style: ThemeStyle): CheatTheme => themes[style];
