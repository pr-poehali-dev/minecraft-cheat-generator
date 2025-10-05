export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export interface CheatFeature {
  name: string;
  enabled: boolean;
  category: 'Combat' | 'Movement' | 'Player' | 'Render' | 'World';
  settings: Record<string, number | boolean>;
}
