import { CheatFeature, Setting } from '@/types/cheat';

const createSetting = (
  type: Setting['type'],
  name: string,
  value: number | boolean | string,
  options?: { min?: number; max?: number; step?: number; options?: string[] }
): Setting => ({
  type,
  name,
  value,
  ...options
});

export const moduleDatabase: CheatFeature[] = [
  {
    name: 'KillAura',
    enabled: false,
    category: 'Combat',
    description: 'Автоматически атакует врагов в радиусе',
    bypass: ['Hypixel', 'Matrix', 'Vulcan'],
    settings: {
      range: createSetting('slider', 'Range', 4.2, { min: 3, max: 6, step: 0.1 }),
      aps: createSetting('slider', 'APS', 12, { min: 1, max: 20, step: 1 }),
      rotations: createSetting('toggle', 'Rotations', true),
      raytrace: createSetting('toggle', 'Raytrace', true),
      autoblock: createSetting('toggle', 'AutoBlock', true),
      targetMode: createSetting('mode', 'Target Mode', 'Distance', { options: ['Distance', 'Health', 'Angle', 'Hurt Time'] }),
      attackMode: createSetting('mode', 'Attack Mode', 'Single', { options: ['Single', 'Multi', 'Switch'] }),
      rotationMode: createSetting('mode', 'Rotation Mode', 'Smooth', { options: ['Smooth', 'Instant', 'Snap', 'Predict'] })
    }
  },
  {
    name: 'Velocity',
    enabled: false,
    category: 'Combat',
    description: 'Снижает откидывание при ударах',
    bypass: ['Hypixel', 'Matrix', 'NCP'],
    settings: {
      horizontal: createSetting('slider', 'Horizontal', 0, { min: 0, max: 100, step: 1 }),
      vertical: createSetting('slider', 'Vertical', 0, { min: 0, max: 100, step: 1 }),
      chance: createSetting('slider', 'Chance', 100, { min: 0, max: 100, step: 1 }),
      mode: createSetting('mode', 'Mode', 'Cancel', { options: ['Cancel', 'Packet', 'AAC', 'Matrix', 'Vulcan'] })
    }
  },
  {
    name: 'Criticals',
    enabled: false,
    category: 'Combat',
    description: 'Всегда наносит критический урон',
    bypass: ['NCP', 'AAC'],
    settings: {
      mode: createSetting('mode', 'Mode', 'Packet', { options: ['Packet', 'Jump', 'MiniJump', 'NoGround', 'Visual'] }),
      delay: createSetting('slider', 'Delay', 0, { min: 0, max: 500, step: 10 })
    }
  },
  {
    name: 'AutoClicker',
    enabled: false,
    category: 'Combat',
    description: 'Автоматические клики левой/правой кнопкой',
    bypass: ['Hypixel', 'Watchdog'],
    settings: {
      cps: createSetting('slider', 'CPS', 14, { min: 1, max: 20, step: 1 }),
      jitter: createSetting('slider', 'Jitter', 2, { min: 0, max: 5, step: 0.5 }),
      breakBlocks: createSetting('toggle', 'Break Blocks', true),
      rightClick: createSetting('toggle', 'Right Click', false)
    }
  },
  {
    name: 'Fly',
    enabled: false,
    category: 'Movement',
    description: 'Позволяет летать в режиме выживания',
    bypass: ['Creative', 'Vanilla'],
    settings: {
      speed: createSetting('slider', 'Speed', 1.5, { min: 0.1, max: 10, step: 0.1 }),
      mode: createSetting('mode', 'Mode', 'Vanilla', { options: ['Vanilla', 'Motion', 'Jetpack', 'Hypixel', 'Matrix', 'Vulcan', 'AAC', 'Verus'] }),
      bobbing: createSetting('toggle', 'Bobbing', false),
      antiKick: createSetting('toggle', 'Anti Kick', true)
    }
  },
  {
    name: 'Speed',
    enabled: false,
    category: 'Movement',
    description: 'Увеличивает скорость передвижения',
    bypass: ['Hypixel', 'Matrix', 'Vulcan'],
    settings: {
      speed: createSetting('slider', 'Speed', 2.0, { min: 1, max: 5, step: 0.1 }),
      mode: createSetting('mode', 'Mode', 'Strafe', { options: ['Strafe', 'Bhop', 'LowHop', 'OnGround', 'Hypixel', 'Matrix', 'Vulcan', 'NCP', 'AAC'] }),
      timer: createSetting('slider', 'Timer', 1.0, { min: 0.5, max: 2, step: 0.05 }),
      strafeOnly: createSetting('toggle', 'Strafe Only', false)
    }
  },
  {
    name: 'Sprint',
    enabled: false,
    category: 'Movement',
    description: 'Постоянный спринт',
    settings: {
      omniSprint: createSetting('toggle', 'Omni Sprint', true),
      keepSprint: createSetting('toggle', 'Keep Sprint', true)
    }
  },
  {
    name: 'NoFall',
    enabled: false,
    category: 'Movement',
    description: 'Убирает урон от падения',
    bypass: ['Hypixel', 'Matrix', 'Vulcan'],
    settings: {
      mode: createSetting('mode', 'Mode', 'Packet', { options: ['Packet', 'NoGround', 'Edit', 'Hypixel', 'Matrix', 'Vulcan'] }),
      minFallDistance: createSetting('slider', 'Min Distance', 3, { min: 2, max: 10, step: 0.5 })
    }
  },
  {
    name: 'Scaffold',
    enabled: false,
    category: 'World',
    description: 'Автоматически ставит блоки под ногами',
    bypass: ['Hypixel', 'Matrix', 'Vulcan'],
    settings: {
      delay: createSetting('slider', 'Delay', 0, { min: 0, max: 500, step: 10 }),
      rotations: createSetting('toggle', 'Rotations', true),
      tower: createSetting('toggle', 'Tower', true),
      swing: createSetting('toggle', 'Swing', true),
      safeWalk: createSetting('toggle', 'Safe Walk', true),
      mode: createSetting('mode', 'Mode', 'Normal', { options: ['Normal', 'Telly', 'Godbridge', 'Ninja', 'Breezily'] }),
      rotationMode: createSetting('mode', 'Rotation Mode', 'NCP', { options: ['NCP', 'AAC', 'Down', 'Hypixel', 'Matrix'] }),
      sprint: createSetting('toggle', 'Sprint', false)
    }
  },
  {
    name: 'ChestStealer',
    enabled: false,
    category: 'World',
    description: 'Автоматически забирает вещи из сундуков',
    settings: {
      delay: createSetting('slider', 'Delay', 100, { min: 0, max: 500, step: 10 }),
      autoClose: createSetting('toggle', 'Auto Close', true),
      ignoreTrash: createSetting('toggle', 'Ignore Trash', true)
    }
  },
  {
    name: 'ESP',
    enabled: false,
    category: 'Render',
    description: 'Подсвечивает игроков и мобов через стены',
    settings: {
      mode: createSetting('mode', 'Mode', 'Box', { options: ['Box', 'Outline', 'Glow', 'Chams', '2D'] }),
      players: createSetting('toggle', 'Players', true),
      mobs: createSetting('toggle', 'Mobs', false),
      items: createSetting('toggle', 'Items', false),
      color: createSetting('color', 'Color', '#FF0000')
    }
  },
  {
    name: 'Tracers',
    enabled: false,
    category: 'Render',
    description: 'Рисует линии до игроков',
    settings: {
      players: createSetting('toggle', 'Players', true),
      mobs: createSetting('toggle', 'Mobs', false),
      width: createSetting('slider', 'Width', 2, { min: 1, max: 5, step: 0.5 }),
      color: createSetting('color', 'Color', '#00FF00')
    }
  },
  {
    name: 'FullBright',
    enabled: false,
    category: 'Render',
    description: 'Максимальная яркость',
    settings: {
      mode: createSetting('mode', 'Mode', 'Gamma', { options: ['Gamma', 'NightVision', 'Ambient'] })
    }
  },
  {
    name: 'ClickGUI',
    enabled: false,
    category: 'Render',
    description: 'Графическое меню настроек',
    settings: {
      theme: createSetting('mode', 'Theme', 'Astolfo', { options: ['Astolfo', 'Vape', 'Nursultan', 'Celestial', 'Raven', 'Novoline'] }),
      blur: createSetting('toggle', 'Blur', true),
      animations: createSetting('toggle', 'Animations', true),
      rainbow: createSetting('toggle', 'Rainbow', false),
      accentColor: createSetting('color', 'Accent Color', '#9B59B6')
    }
  },
  {
    name: 'TargetHUD',
    enabled: false,
    category: 'Render',
    description: 'Показывает информацию о цели',
    settings: {
      style: createSetting('mode', 'Style', 'Nursultan', { options: ['Nursultan', 'Celestial', 'Astolfo', 'Novoline', 'Exhibition'] }),
      showHealth: createSetting('toggle', 'Health', true),
      showArmor: createSetting('toggle', 'Armor', true),
      showDistance: createSetting('toggle', 'Distance', true),
      animations: createSetting('toggle', 'Animations', true)
    }
  },
  {
    name: 'Chams',
    enabled: false,
    category: 'Render',
    description: 'Подсвечивает игроков через стены (шейдер)',
    settings: {
      players: createSetting('toggle', 'Players', true),
      items: createSetting('toggle', 'Items', false),
      legit: createSetting('toggle', 'Legit Mode', false),
      color: createSetting('color', 'Color', '#FF00FF')
    }
  },
  {
    name: 'InvManager',
    enabled: false,
    category: 'Player',
    description: 'Автоматическое управление инвентарем',
    settings: {
      delay: createSetting('slider', 'Delay', 150, { min: 0, max: 500, step: 10 }),
      autoArmor: createSetting('toggle', 'Auto Armor', true),
      sortInventory: createSetting('toggle', 'Sort Inventory', true),
      throwTrash: createSetting('toggle', 'Throw Trash', true),
      openInventory: createSetting('toggle', 'Open Inventory', false)
    }
  },
  {
    name: 'AutoPot',
    enabled: false,
    category: 'Player',
    description: 'Автоматическое использование зелий',
    settings: {
      health: createSetting('slider', 'Health', 15, { min: 1, max: 20, step: 0.5 }),
      delay: createSetting('slider', 'Delay', 500, { min: 0, max: 2000, step: 50 }),
      groundOnly: createSetting('toggle', 'Ground Only', false)
    }
  },
  {
    name: 'AutoTool',
    enabled: false,
    category: 'Player',
    description: 'Автоматический выбор правильного инструмента',
    settings: {
      revert: createSetting('toggle', 'Revert', true),
      weapon: createSetting('toggle', 'Weapon', true)
    }
  },
  {
    name: 'Blink',
    enabled: false,
    category: 'Exploit',
    description: 'Задерживает пакеты движения',
    bypass: ['None'],
    settings: {
      pulse: createSetting('toggle', 'Pulse', false),
      delay: createSetting('slider', 'Delay', 1000, { min: 100, max: 5000, step: 100 })
    }
  },
  {
    name: 'Disabler',
    enabled: false,
    category: 'Exploit',
    description: 'Отключает античит на сервере',
    bypass: ['Matrix', 'Vulcan', 'Verus'],
    settings: {
      mode: createSetting('mode', 'Mode', 'Matrix', { options: ['Matrix', 'Vulcan', 'Verus', 'Grim', 'Intave'] }),
      autoConfig: createSetting('toggle', 'Auto Config', true)
    }
  },
  {
    name: 'Phase',
    enabled: false,
    category: 'Exploit',
    description: 'Проходит сквозь блоки',
    bypass: ['Vanilla'],
    settings: {
      mode: createSetting('mode', 'Mode', 'Vanilla', { options: ['Vanilla', 'NCP', 'AAC', 'Skip'] })
    }
  },
  {
    name: 'Timer',
    enabled: false,
    category: 'Misc',
    description: 'Изменяет скорость игры',
    settings: {
      speed: createSetting('slider', 'Speed', 1.0, { min: 0.1, max: 3, step: 0.05 })
    }
  },
  {
    name: 'Nuker',
    enabled: false,
    category: 'World',
    description: 'Автоматически ломает блоки вокруг',
    settings: {
      range: createSetting('slider', 'Range', 4, { min: 1, max: 6, step: 1 }),
      delay: createSetting('slider', 'Delay', 0, { min: 0, max: 500, step: 10 }),
      rotations: createSetting('toggle', 'Rotations', true)
    }
  },
  {
    name: 'BedAura',
    enabled: false,
    category: 'Combat',
    description: 'Автоматически ломает кровати (BedWars)',
    bypass: ['Hypixel'],
    settings: {
      range: createSetting('slider', 'Range', 5, { min: 3, max: 6, step: 0.5 }),
      rotations: createSetting('toggle', 'Rotations', true),
      autoSwitch: createSetting('toggle', 'Auto Switch', true)
    }
  },
  {
    name: 'AntiBot',
    enabled: false,
    category: 'Combat',
    description: 'Игнорирует ботов при атаке',
    settings: {
      tabCheck: createSetting('toggle', 'Tab Check', true),
      pingCheck: createSetting('toggle', 'Ping Check', true),
      duplicateCheck: createSetting('toggle', 'Duplicate Check', true)
    }
  },
  {
    name: 'Animations',
    enabled: false,
    category: 'Render',
    description: 'Кастомные анимации оружия',
    settings: {
      mode: createSetting('mode', '1.7 Mode', 'Spin', { options: ['Spin', 'Swing', 'Slide', 'Exhibition', 'Smooth', 'Punch'] }),
      speed: createSetting('slider', 'Speed', 1.0, { min: 0.5, max: 2, step: 0.1 }),
      smooth: createSetting('toggle', 'Smooth', true)
    }
  }
];

export const extractFeatures = (input: string): CheatFeature[] => {
  const lowerInput = input.toLowerCase();
  const features: CheatFeature[] = [];

  if (lowerInput.includes('боевой') || lowerInput.includes('combat') || lowerInput.includes('пвп') || lowerInput.includes('pvp')) {
    features.push(
      ...moduleDatabase.filter(m => m.category === 'Combat' && ['KillAura', 'Velocity', 'Criticals', 'AutoClicker'].includes(m.name))
    );
  }

  if (lowerInput.includes('movement') || lowerInput.includes('движение') || lowerInput.includes('скорость') || lowerInput.includes('полет')) {
    features.push(
      ...moduleDatabase.filter(m => m.category === 'Movement')
    );
  }

  if (lowerInput.includes('render') || lowerInput.includes('визуал') || lowerInput.includes('esp') || lowerInput.includes('чамс')) {
    features.push(
      ...moduleDatabase.filter(m => m.category === 'Render')
    );
  }

  if (lowerInput.includes('scaffold') || lowerInput.includes('скаффолд') || lowerInput.includes('бридж')) {
    features.push(moduleDatabase.find(m => m.name === 'Scaffold')!);
  }

  if (lowerInput.includes('hypixel') || lowerInput.includes('хайпиксель')) {
    features.push(
      ...moduleDatabase.filter(m => m.bypass?.includes('Hypixel'))
    );
  }

  if (lowerInput.includes('matrix') || lowerInput.includes('матрикс')) {
    features.push(
      ...moduleDatabase.filter(m => m.bypass?.includes('Matrix'))
    );
  }

  if (lowerInput.includes('полный') || lowerInput.includes('full') || lowerInput.includes('все') || lowerInput.includes('максимум')) {
    return [...moduleDatabase];
  }

  const moduleNames = moduleDatabase.map(m => m.name.toLowerCase());
  moduleNames.forEach((name, index) => {
    if (lowerInput.includes(name) || lowerInput.includes(moduleDatabase[index].name.toLowerCase())) {
      if (!features.find(f => f.name === moduleDatabase[index].name)) {
        features.push(moduleDatabase[index]);
      }
    }
  });

  return features.map(f => ({ ...f }));
};

export const generateResponse = (input: string, features: CheatFeature[]): string => {
  const lowerInput = input.toLowerCase();

  if (features.length === 0) {
    return '🤔 Не понял, что добавить. Попробуй:\n\n• "killaura и velocity"\n• "боевой чит для hypixel"\n• "scaffold с rotations"\n• "полный чит со всеми модулями"';
  }

  const bypassInfo = features[0].bypass ? `\n\n🛡️ **Bypass**: ${features[0].bypass.join(', ')}` : '';

  if (lowerInput.includes('hypixel') || lowerInput.includes('хайпиксель')) {
    return `✅ Добавил ${features.length} модулей для **Hypixel**:\n${features.map(f => `• ${f.name}`).join('\n')}${bypassInfo}\n\n💡 Рекомендую настроить:\n• KillAura: APS 11-13, Range 3.8-4.2\n• Velocity: 0% horizontal для Watchdog\n• Scaffold: Telly mode + NCP rotations`;
  }

  if (lowerInput.includes('matrix')) {
    return `✅ Добавил ${features.length} модулей с **Matrix bypass**:\n${features.map(f => `• ${f.name}`).join('\n')}${bypassInfo}\n\n⚙️ Автоматическая настройка под Matrix включена!`;
  }

  if (features.length > 10) {
    return `🚀 Создал **полный чит-клиент** (${features.length} модулей)!\n\n📦 Категории:\n• Combat: ${features.filter(f => f.category === 'Combat').length}\n• Movement: ${features.filter(f => f.category === 'Movement').length}\n• Render: ${features.filter(f => f.category === 'Render').length}\n• World: ${features.filter(f => f.category === 'World').length}\n• Player: ${features.filter(f => f.category === 'Player').length}\n• Exploit: ${features.filter(f => f.category === 'Exploit').length}\n\n🎨 Не забудь выбрать тему в ClickGUI!`;
  }

  return `✅ Добавил модули:\n${features.map(f => `• **${f.name}** — ${f.description}`).join('\n')}${bypassInfo}\n\n⚙️ Настрой параметры справа →`;
};
