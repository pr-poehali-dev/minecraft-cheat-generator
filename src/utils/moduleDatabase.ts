import { CheatFeature } from '@/types/cheat';

export const moduleDatabase: Record<string, { name: string; category: CheatFeature['category']; settings: any }> = {
  'killaura': { name: 'KillAura', category: 'Combat', settings: { range: 4.2, aps: 12, rotations: true, autoBlock: true } },
  'velocity': { name: 'Velocity', category: 'Combat', settings: { horizontal: 0, vertical: 0, chance: 100 } },
  'criticals': { name: 'Criticals', category: 'Combat', settings: { delay: 500 } },
  'автоблок': { name: 'AutoBlock', category: 'Combat', settings: {} },
  'fly': { name: 'Fly', category: 'Movement', settings: { speed: 1.0, mode: 0, antiKick: true } },
  'speed': { name: 'Speed', category: 'Movement', settings: { speed: 1.5, mode: 0 } },
  'scaffold': { name: 'Scaffold', category: 'World', settings: { delay: 100, tower: true, safeWalk: true } },
  'sprint': { name: 'Sprint', category: 'Movement', settings: { omniSprint: true } },
  'nofall': { name: 'NoFall', category: 'Movement', settings: { mode: 0 } },
  'step': { name: 'Step', category: 'Movement', settings: { height: 1.0, mode: 0 } },
  'longjump': { name: 'LongJump', category: 'Movement', settings: { boost: 2.0 } },
  'esp': { name: 'ESP', category: 'Render', settings: { box: true, health: true, armor: true, range: 128 } },
  'tracers': { name: 'Tracers', category: 'Render', settings: { thickness: 2, range: 128 } },
  'chams': { name: 'Chams', category: 'Render', settings: { textured: false } },
  'fullbright': { name: 'FullBright', category: 'Render', settings: {} },
  'xray': { name: 'XRay', category: 'Render', settings: {} },
  'nuker': { name: 'Nuker', category: 'World', settings: { radius: 4.5, delay: 50 } },
  'chestESP': { name: 'ChestESP', category: 'Render', settings: { range: 128 } },
  'автоклик': { name: 'AutoClicker', category: 'Combat', settings: { minCPS: 10, maxCPS: 14 } },
  'клик': { name: 'AutoClicker', category: 'Combat', settings: { minCPS: 10, maxCPS: 14 } },
  'jesus': { name: 'Jesus', category: 'Movement', settings: {} },
  'anti': { name: 'AntiKnockback', category: 'Combat', settings: { horizontal: 0, vertical: 0 } },
  'aimbot': { name: 'AimBot', category: 'Combat', settings: { fov: 90, smoothness: 5, ignoreTeam: true } },
  'targetstrafe': { name: 'TargetStrafe', category: 'Movement', settings: { radius: 2.0, autoJump: true } },
  'antibot': { name: 'AntiBot', category: 'Combat', settings: {} }
};

export const extractFeatures = (text: string): CheatFeature[] => {
  const features: CheatFeature[] = [];
  const lowerText = text.toLowerCase();

  Object.entries(moduleDatabase).forEach(([key, data]) => {
    if (lowerText.includes(key)) {
      features.push({ 
        name: data.name, 
        category: data.category,
        enabled: true,
        settings: data.settings
      });
    }
  });

  return features;
};

export const generateResponse = (userInput: string, features: CheatFeature[]): string => {
  if (features.length === 0) {
    return '❌ Не нашёл модулей в запросе!\n\nПопробуй: "добавь killaura и velocity" или "создай чит с fly, speed и esp"';
  }

  const byCategory = features.reduce((acc, f) => {
    if (!acc[f.category]) acc[f.category] = [];
    acc[f.category].push(f.name);
    return acc;
  }, {} as Record<string, string[]>);

  const categoryList = Object.entries(byCategory)
    .map(([cat, mods]) => `• ${cat}: ${mods.join(', ')}`)
    .join('\n');

  return `✅ Добавлены профессиональные модули (${features.length})\n\n${categoryList}\n\n🎯 Теперь можешь:\n• Настроить каждый модуль (кликни на него)\n• Скачать готовый Forge мод с GUI меню\n• Получить полный исходный код проекта`;
};
