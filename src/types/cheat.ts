export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export type SettingType = 'toggle' | 'slider' | 'mode' | 'color' | 'keybind';

export interface Setting {
  type: SettingType;
  name: string;
  value: number | boolean | string;
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
}

export type ModuleCategory = 'Combat' | 'Movement' | 'Player' | 'Render' | 'World' | 'Misc' | 'Exploit';

export interface CheatFeature {
  name: string;
  enabled: boolean;
  category: ModuleCategory;
  settings: Record<string, Setting>;
  description?: string;
  bypass?: string[];
}

export type ThemeStyle = 'astolfo' | 'vape' | 'nursultan' | 'celestial' | 'raven' | 'novoline';

export interface CheatTheme {
  name: string;
  style: ThemeStyle;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
}
