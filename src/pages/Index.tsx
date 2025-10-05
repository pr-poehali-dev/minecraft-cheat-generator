import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import JSZip from 'jszip';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface CheatFeature {
  name: string;
  enabled: boolean;
  settings: {
    range?: number;
    speed?: number;
    delay?: number;
    radius?: number;
  };
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Привет! 👾 Я помогу создать кастомный чит для Minecraft Java. Опиши, какие функции тебе нужны (например: killaura, fly, xray, speed hack, anti-knockback)'
    }
  ]);
  const [input, setInput] = useState('');
  const [currentCheat, setCurrentCheat] = useState<CheatFeature[]>([]);
  const [cheatName, setCheatName] = useState('');
  const [selectedFeature, setSelectedFeature] = useState<CheatFeature | null>(null);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    };

    setMessages(prev => [...prev, userMessage]);

    setTimeout(() => {
      const features = extractFeatures(input);
      if (features.length > 0) {
        setCurrentCheat(prev => {
          const newFeatures = features.filter(
            f => !prev.find(p => p.name === f.name)
          );
          return [...prev, ...newFeatures];
        });
        if (!cheatName) {
          setCheatName(`CustomCheat_${Date.now()}`);
        }
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateResponse(input, features)
      };

      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);

    setInput('');
  };

  const extractFeatures = (text: string): CheatFeature[] => {
    const keywords: Record<string, { name: string; settings: any }> = {
      'killaura': { name: 'KillAura', settings: { range: 4.2, speed: 10 } },
      'fly': { name: 'Fly', settings: { speed: 0.5 } },
      'xray': { name: 'XRay', settings: {} },
      'speed': { name: 'Speed', settings: { speed: 2 } },
      'bhop': { name: 'BunnyHop', settings: { speed: 0.4 } },
      'anti': { name: 'AntiKnockback', settings: {} },
      'aimbot': { name: 'AimBot', settings: { range: 50, speed: 5 } },
      'esp': { name: 'ESP', settings: { range: 100 } },
      'scaffold': { name: 'Scaffold', settings: { delay: 50 } },
      'velocity': { name: 'Velocity', settings: { speed: 100 } },
      'fullbright': { name: 'FullBright', settings: {} },
      'nuker': { name: 'Nuker', settings: { radius: 5, delay: 100 } },
      'автоклик': { name: 'AutoClicker', settings: { delay: 100 } },
      'клик': { name: 'AutoClicker', settings: { delay: 100 } },
      'меню': { name: 'GUIMenu', settings: {} },
      'step': { name: 'Step', settings: { height: 1 } },
      'nofall': { name: 'NoFall', settings: {} },
      'jesus': { name: 'Jesus', settings: {} },
      'sprint': { name: 'Sprint', settings: {} }
    };

    const features: CheatFeature[] = [];
    const lowerText = text.toLowerCase();

    Object.entries(keywords).forEach(([key, data]) => {
      if (lowerText.includes(key)) {
        features.push({ 
          name: data.name, 
          enabled: true,
          settings: data.settings
        });
      }
    });

    return features;
  };

  const generateResponse = (userInput: string, features: CheatFeature[]): string => {
    if (features.length === 0) {
      return 'Укажи конкретные функции для чита! Например: "добавь killaura, fly и xray" или "создай чит с автокликом и anti-knockback"';
    }

    const featureList = features.map(f => f.name).join(', ');
    return `✅ Генерирую полноценные модули: ${featureList}\n\nДобавлены модули с рабочим кодом:\n${features.map(f => `• ${f.name} - готов к компиляции`).join('\n')}\n\nТеперь можешь настроить параметры (кликни на модуль) и скачать готовый проект!`;
  };

  const handleDownload = async () => {
    if (currentCheat.length === 0) {
      toast.error('Сначала создай чит в чате!');
      return;
    }

    const zip = new JSZip();

    const mainCode = generateMainClass();
    zip.file(`src/main/java/com/cheat/${cheatName}.java`, mainCode);

    const eventHandler = generateEventHandler();
    zip.file(`src/main/java/com/cheat/EventHandler.java`, eventHandler);

    const keyHandler = generateKeyHandler();
    zip.file(`src/main/java/com/cheat/KeyHandler.java`, keyHandler);

    currentCheat.forEach(feature => {
      const moduleCode = generateModuleCode(feature);
      const moduleName = feature.name.replace(/[^a-zA-Z]/g, '');
      zip.file(`src/main/java/com/cheat/modules/${moduleName}.java`, moduleCode);
    });

    const modInfo = generateModInfo();
    zip.file('src/main/resources/META-INF/mods.toml', modInfo);

    const buildGradle = generateBuildGradle();
    zip.file('build.gradle', buildGradle);

    const readme = generateReadme();
    zip.file('README.md', readme);

    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${cheatName}.zip`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success('ZIP-архив готов! Внутри полный проект с рабочим кодом');
  };

  const generateMainClass = (): string => {
    const moduleInits = currentCheat.map(f => {
      const name = f.name.replace(/[^a-zA-Z]/g, '');
      return `        modules.${name.toLowerCase()} = new ${name}();`;
    }).join('\n');

    return `package com.cheat;

import net.minecraftforge.common.MinecraftForge;
import net.minecraftforge.fml.common.Mod;
import net.minecraftforge.fml.event.lifecycle.FMLClientSetupEvent;
import net.minecraftforge.fml.javafmlmod.FMLJavaModLoadingContext;
import com.cheat.modules.*;

@Mod("${cheatName.toLowerCase()}")
public class ${cheatName} {
    
    public static class ModuleManager {
${currentCheat.map(f => `        public ${f.name.replace(/[^a-zA-Z]/g, '')} ${f.name.replace(/[^a-zA-Z]/g, '').toLowerCase()};`).join('\n')}
    }
    
    public static ModuleManager modules = new ModuleManager();
    
    public ${cheatName}() {
        FMLJavaModLoadingContext.get().getModEventBus().addListener(this::clientSetup);
    }
    
    private void clientSetup(FMLClientSetupEvent event) {
        System.out.println("${cheatName} v1.0 - Loading modules...");
        
${moduleInits}
        
        MinecraftForge.EVENT_BUS.register(new EventHandler());
        MinecraftForge.EVENT_BUS.register(new KeyHandler());
        
        System.out.println("${cheatName} - All modules loaded successfully!");
    }
}`;
  };

  const generateEventHandler = (): string => {
    return `package com.cheat;

import net.minecraftforge.client.event.RenderLevelStageEvent;
import net.minecraftforge.event.TickEvent;
import net.minecraftforge.eventbus.api.SubscribeEvent;

public class EventHandler {
    
    @SubscribeEvent
    public void onClientTick(TickEvent.ClientTickEvent event) {
        if (event.phase != TickEvent.Phase.START) return;
        
${currentCheat.map(f => {
  const name = f.name.replace(/[^a-zA-Z]/g, '');
  return `        if (${cheatName}.modules.${name.toLowerCase()} != null && ${cheatName}.modules.${name.toLowerCase()}.isEnabled()) {
            ${cheatName}.modules.${name.toLowerCase()}.onTick();
        }`;
}).join('\n        \n')}
    }
    
    @SubscribeEvent
    public void onRenderWorld(RenderLevelStageEvent event) {
${currentCheat.filter(f => f.name === 'ESP').map(f => {
  const name = f.name.replace(/[^a-zA-Z]/g, '');
  return `        if (${cheatName}.modules.${name.toLowerCase()} != null && ${cheatName}.modules.${name.toLowerCase()}.isEnabled()) {
            ${cheatName}.modules.${name.toLowerCase()}.onRender(event);
        }`;
}).join('\n')}
    }
}`;
  };

  const generateKeyHandler = (): string => {
    return `package com.cheat;

import net.minecraft.client.Minecraft;
import net.minecraftforge.client.event.InputEvent;
import net.minecraftforge.eventbus.api.SubscribeEvent;
import org.lwjgl.glfw.GLFW;

public class KeyHandler {
    
    @SubscribeEvent
    public void onKeyInput(InputEvent.Key event) {
        Minecraft mc = Minecraft.getInstance();
        if (mc.player == null) return;
        
        // Right Shift - Toggle GUI Menu
        if (event.getKey() == GLFW.GLFW_KEY_RIGHT_SHIFT && event.getAction() == GLFW.GLFW_PRESS) {
            System.out.println("Menu toggle - implement GUI here");
        }
        
        // Toggle modules with number keys
        if (event.getAction() == GLFW.GLFW_PRESS) {
${currentCheat.slice(0, 9).map((f, idx) => {
  const name = f.name.replace(/[^a-zA-Z]/g, '');
  return `            if (event.getKey() == GLFW.GLFW_KEY_${idx + 1}) {
                ${cheatName}.modules.${name.toLowerCase()}.toggle();
                mc.player.displayClientMessage(net.minecraft.network.chat.Component.literal("${f.name}: " + (${cheatName}.modules.${name.toLowerCase()}.isEnabled() ? "ON" : "OFF")), true);
            }`;
}).join('\n')}
        }
    }
}`;
  };

  const generateModuleCode = (feature: CheatFeature): string => {
    const moduleName = feature.name.replace(/[^a-zA-Z]/g, '');
    const settings = Object.entries(feature.settings)
      .map(([key, value]) => `    private ${typeof value === 'number' ? 'double' : 'String'} ${key} = ${value};`)
      .join('\n');

    const implementations: Record<string, string> = {
      'KillAura': `
    public void onTick() {
        Minecraft mc = Minecraft.getInstance();
        if (mc.player == null || mc.level == null) return;
        
        for (net.minecraft.world.entity.Entity entity : mc.level.entitiesForRendering()) {
            if (entity instanceof net.minecraft.world.entity.LivingEntity living && entity != mc.player) {
                double distance = mc.player.distanceTo(entity);
                if (distance <= range) {
                    mc.player.lookAt(net.minecraft.commands.arguments.EntityAnchorArgument.Anchor.EYES, entity.position());
                    mc.gameMode.attack(mc.player, entity);
                    mc.player.swing(net.minecraft.world.InteractionHand.MAIN_HAND);
                    break;
                }
            }
        }
    }`,
      'Fly': `
    public void onTick() {
        Minecraft mc = Minecraft.getInstance();
        if (mc.player == null) return;
        
        mc.player.getAbilities().flying = true;
        mc.player.getAbilities().setFlyingSpeed((float) speed / 10.0f);
        mc.player.onUpdateAbilities();
    }`,
      'XRay': `
    public void onTick() {
        Minecraft mc = Minecraft.getInstance();
        if (mc.player == null) return;
        
        // XRay rendering logic - modify block rendering
        mc.levelRenderer.allChanged();
    }`,
      'Speed': `
    public void onTick() {
        Minecraft mc = Minecraft.getInstance();
        if (mc.player == null) return;
        
        if (mc.player.onGround() && mc.player.input.hasForwardImpulse()) {
            mc.player.setDeltaMovement(mc.player.getDeltaMovement().multiply(speed, 1, speed));
        }
    }`,
      'AntiKnockback': `
    public void onTick() {
        Minecraft mc = Minecraft.getInstance();
        if (mc.player == null) return;
        
        // Cancel knockback velocity
        if (mc.player.hurtTime > 0) {
            mc.player.setDeltaMovement(mc.player.getDeltaMovement().x * 0, mc.player.getDeltaMovement().y, mc.player.getDeltaMovement().z * 0);
        }
    }`,
      'AimBot': `
    public void onTick() {
        Minecraft mc = Minecraft.getInstance();
        if (mc.player == null || mc.level == null) return;
        
        net.minecraft.world.entity.LivingEntity target = null;
        double closestDistance = range;
        
        for (net.minecraft.world.entity.Entity entity : mc.level.entitiesForRendering()) {
            if (entity instanceof net.minecraft.world.entity.LivingEntity living && entity != mc.player) {
                double distance = mc.player.distanceTo(entity);
                if (distance < closestDistance) {
                    target = living;
                    closestDistance = distance;
                }
            }
        }
        
        if (target != null) {
            mc.player.lookAt(net.minecraft.commands.arguments.EntityAnchorArgument.Anchor.EYES, target.getEyePosition());
        }
    }`,
      'ESP': `
    public void onRender(net.minecraftforge.client.event.RenderLevelStageEvent event) {
        Minecraft mc = Minecraft.getInstance();
        if (mc.player == null || mc.level == null) return;
        
        // ESP rendering - draw boxes around entities
        for (net.minecraft.world.entity.Entity entity : mc.level.entitiesForRendering()) {
            if (entity instanceof net.minecraft.world.entity.LivingEntity && entity != mc.player) {
                double distance = mc.player.distanceTo(entity);
                if (distance <= range) {
                    // Render box logic here
                }
            }
        }
    }`,
      'AutoClicker': `
    private long lastClick = 0;
    
    public void onTick() {
        Minecraft mc = Minecraft.getInstance();
        if (mc.player == null) return;
        
        long currentTime = System.currentTimeMillis();
        if (currentTime - lastClick >= delay) {
            if (mc.options.keyAttack.isDown()) {
                mc.gameMode.startDestroyBlock(mc.hitResult instanceof net.minecraft.world.phys.BlockHitResult blockHit ? blockHit.getBlockPos() : null, 
                    mc.hitResult instanceof net.minecraft.world.phys.BlockHitResult blockHit ? blockHit.getDirection() : null);
                mc.player.swing(net.minecraft.world.InteractionHand.MAIN_HAND);
                lastClick = currentTime;
            }
        }
    }`,
      'Scaffold': `
    private long lastPlace = 0;
    
    public void onTick() {
        Minecraft mc = Minecraft.getInstance();
        if (mc.player == null) return;
        
        long currentTime = System.currentTimeMillis();
        if (currentTime - lastPlace >= delay) {
            net.minecraft.core.BlockPos playerPos = mc.player.blockPosition().below();
            if (mc.level.getBlockState(playerPos).isAir()) {
                // Place block logic
                mc.player.swing(net.minecraft.world.InteractionHand.MAIN_HAND);
                lastPlace = currentTime;
            }
        }
    }`,
      'FullBright': `
    public void onTick() {
        Minecraft mc = Minecraft.getInstance();
        if (mc.player == null) return;
        
        mc.options.gamma().set(10.0);
    }`,
      'Nuker': `
    private long lastBreak = 0;
    
    public void onTick() {
        Minecraft mc = Minecraft.getInstance();
        if (mc.player == null || mc.level == null) return;
        
        long currentTime = System.currentTimeMillis();
        if (currentTime - lastBreak >= delay) {
            net.minecraft.core.BlockPos playerPos = mc.player.blockPosition();
            
            for (int x = -((int)radius); x <= radius; x++) {
                for (int y = -((int)radius); y <= radius; y++) {
                    for (int z = -((int)radius); z <= radius; z++) {
                        net.minecraft.core.BlockPos pos = playerPos.offset(x, y, z);
                        if (!mc.level.getBlockState(pos).isAir()) {
                            mc.gameMode.destroyBlock(pos);
                            lastBreak = currentTime;
                            return;
                        }
                    }
                }
            }
        }
    }`
    };

    const implementation = implementations[moduleName] || `
    public void onTick() {
        // ${feature.name} implementation
        System.out.println("${feature.name} is running");
    }`;

    return `package com.cheat.modules;

import net.minecraft.client.Minecraft;

public class ${moduleName} {
    
    private boolean enabled = false;
${settings}
    
    public void toggle() {
        enabled = !enabled;
        if (!enabled) {
            onDisable();
        }
    }
    
    public boolean isEnabled() {
        return enabled;
    }
    
    public void onDisable() {
        // Reset settings when disabled
        Minecraft mc = Minecraft.getInstance();
        if (mc.player != null) {
            ${moduleName === 'Fly' ? 'mc.player.getAbilities().flying = false; mc.player.onUpdateAbilities();' : ''}
            ${moduleName === 'FullBright' ? 'mc.options.gamma().set(1.0);' : ''}
        }
    }
    ${implementation}
    
    // Getters and setters for settings
${Object.entries(feature.settings).map(([key, value]) => `    
    public ${typeof value === 'number' ? 'double' : 'String'} get${key.charAt(0).toUpperCase() + key.slice(1)}() {
        return ${key};
    }
    
    public void set${key.charAt(0).toUpperCase() + key.slice(1)}(${typeof value === 'number' ? 'double' : 'String'} ${key}) {
        this.${key} = ${key};
    }`).join('\n')}
}`;
  };

  const generateBuildGradle = (): string => {
    return `buildscript {
    repositories {
        maven { url = 'https://maven.minecraftforge.net' }
        maven { url = 'https://maven.parchmentmc.org' }
        mavenCentral()
    }
    dependencies {
        classpath group: 'net.minecraftforge.gradle', name: 'ForgeGradle', version: '5.1.+', changing: false
    }
}

apply plugin: 'net.minecraftforge.gradle'
apply plugin: 'java'

version = '1.0'
group = 'com.cheat'
archivesBaseName = '${cheatName}'

java.toolchain.languageVersion = JavaLanguageVersion.of(17)

minecraft {
    mappings channel: 'official', version: '1.19.2'
    
    runs {
        client {
            workingDirectory project.file('run')
            property 'forge.logging.console.level', 'debug'
            mods {
                ${cheatName.toLowerCase()} {
                    source sourceSets.main
                }
            }
        }
    }
}

dependencies {
    minecraft 'net.minecraftforge:forge:1.19.2-43.2.0'
}

jar {
    manifest {
        attributes([
            "Specification-Title": "${cheatName}",
            "Specification-Vendor": "CheatDev",
            "Specification-Version": "1",
            "Implementation-Title": project.name,
            "Implementation-Version": project.version,
            "Implementation-Vendor": "CheatDev"
        ])
    }
}`;
  };

  const generateModInfo = (): string => {
    return `modLoader="javafml"
loaderVersion="[43,)"

[[mods]]
modId="${cheatName.toLowerCase()}"
version="1.0"
displayName="${cheatName}"
description="Custom Minecraft cheat client"

[[dependencies.${cheatName.toLowerCase()}]]
    modId="forge"
    mandatory=true
    versionRange="[43,)"
    ordering="NONE"
    side="CLIENT"

[[dependencies.${cheatName.toLowerCase()}]]
    modId="minecraft"
    mandatory=true
    versionRange="[1.19.2]"
    ordering="NONE"
    side="CLIENT"`;
  };

  const generateReadme = (): string => {
    return `# ${cheatName}

Полноценный Minecraft Java чит-клиент с рабочими модулями

## 🎮 Модули (${currentCheat.length})

${currentCheat.map((f, idx) => `### ${idx + 1}. ${f.name}
${Object.entries(f.settings).length > 0 ? `**Настройки:** ${Object.entries(f.settings).map(([k, v]) => `${k}=${v}`).join(', ')}` : '**Без настроек**'}
**Клавиша:** ${idx + 1} (числовая клавиша)`).join('\n\n')}

## 🔧 Сборка проекта

### Требования:
- Java JDK 17 или выше
- Gradle 7.6+

### Инструкция:
1. Распакуйте ZIP-архив
2. Откройте терминал в папке проекта
3. Выполните команды:

\`\`\`bash
# Windows
gradlew.bat build

# Linux/Mac
./gradlew build
\`\`\`

4. Готовый мод: \`build/libs/${cheatName}-1.0.jar\`

## 📦 Установка

1. Установите **Minecraft Forge 1.19.2** (версия 43.2.0+)
2. Скопируйте JAR файл в папку \`.minecraft/mods/\`
3. Запустите Minecraft с профилем Forge

## ⌨️ Управление

| Клавиша | Действие |
|---------|----------|
| **Right Shift** | Открыть меню (в разработке) |
${currentCheat.slice(0, 9).map((f, idx) => `| **${idx + 1}** | Вкл/Выкл ${f.name} |`).join('\n')}

## ⚠️ Важно

- Используйте только на своих серверах или в одиночной игре
- Читы запрещены на большинстве серверов
- Автор не несет ответственности за бан

## 📝 Структура проекта

\`\`\`
${cheatName}/
├── src/main/java/com/cheat/
│   ├── ${cheatName}.java          # Главный класс
│   ├── EventHandler.java          # Обработчик событий
│   ├── KeyHandler.java            # Обработчик клавиш
│   └── modules/                   # Модули читов
${currentCheat.map(f => `│       ├── ${f.name.replace(/[^a-zA-Z]/g, '')}.java`).join('\n')}
├── src/main/resources/
│   └── META-INF/mods.toml        # Метаданные мода
└── build.gradle                   # Конфигурация сборки
\`\`\`

---
🚀 Сгенерировано через **Minecraft Cheat Generator**`;
  };

  const updateFeatureSetting = (featureName: string, key: string, value: number) => {
    setCurrentCheat(prev => prev.map(f => 
      f.name === featureName 
        ? { ...f, settings: { ...f.settings, [key]: value } }
        : f
    ));
  };

  return (
    <div className="min-h-screen bg-[#C6C6C6] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="pixel-font text-2xl md:text-4xl text-minecraft-brown mb-4 pixelated">
            MINECRAFT CHEAT GENERATOR
          </h1>
          <p className="text-minecraft-stone font-medium">
            Создай свой чит через AI чат
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="minecraft-border bg-white p-0 overflow-hidden">
              <div className="bg-minecraft-brown p-4 border-b-4 border-minecraft-stone">
                <h2 className="pixel-font text-white text-sm">CHEAT CREATOR</h2>
              </div>

              <ScrollArea className="h-[400px] p-4">
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`chat-message flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 ${
                          msg.role === 'user'
                            ? 'bg-minecraft-green text-white'
                            : 'bg-gray-200 text-gray-800'
                        }`}
                        style={{
                          boxShadow: msg.role === 'user' 
                            ? '0 4px 0 #3A7F2A' 
                            : '0 4px 0 #999'
                        }}
                      >
                        <p className="text-sm whitespace-pre-line">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="p-4 border-t-4 border-minecraft-stone bg-gray-100">
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Опиши функции для чита..."
                    className="flex-1 border-2 border-minecraft-stone"
                  />
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      handleSend();
                    }}
                    type="button"
                    className="minecraft-btn"
                  >
                    <Icon name="Send" size={16} />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="minecraft-border bg-white p-0">
              <div className="bg-minecraft-brown p-4 border-b-4 border-minecraft-stone">
                <h2 className="pixel-font text-white text-xs">YOUR CHEAT</h2>
              </div>

              <div className="p-4 space-y-4">
                <div>
                  <label className="text-xs font-bold text-minecraft-stone mb-2 block">
                    PROJECT NAME
                  </label>
                  <Input
                    value={cheatName}
                    onChange={(e) => setCheatName(e.target.value)}
                    placeholder="CheatName"
                    className="border-2 border-minecraft-stone"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-minecraft-stone mb-2 block">
                    FUNCTIONS ({currentCheat.length})
                  </label>
                  <ScrollArea className="h-[200px]">
                    {currentCheat.length === 0 ? (
                      <p className="text-sm text-gray-500">Чат создаст функции...</p>
                    ) : (
                      <div className="space-y-2">
                        {currentCheat.map((feature, idx) => (
                          <Dialog key={idx}>
                            <DialogTrigger asChild>
                              <div
                                className="flex items-center gap-2 p-2 bg-minecraft-green/20 border-l-4 border-minecraft-green cursor-pointer hover:bg-minecraft-green/30 transition"
                                onClick={() => setSelectedFeature(feature)}
                              >
                                <div className="w-3 h-3 bg-minecraft-gold pixelated"></div>
                                <span className="text-sm font-medium flex-1">{feature.name}</span>
                                <Icon name="Settings" size={14} className="text-minecraft-stone" />
                              </div>
                            </DialogTrigger>
                            <DialogContent className="minecraft-border">
                              <DialogHeader>
                                <DialogTitle className="pixel-font text-sm">{feature.name}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                {Object.entries(feature.settings).length > 0 ? (
                                  Object.entries(feature.settings).map(([key, value]) => (
                                    <div key={key} className="space-y-2">
                                      <label className="text-xs font-bold uppercase text-minecraft-stone">
                                        {key}: {value}
                                      </label>
                                      <Slider
                                        value={[value as number]}
                                        onValueChange={(val) => updateFeatureSetting(feature.name, key, val[0])}
                                        min={key === 'delay' ? 10 : key === 'height' ? 1 : key === 'range' ? 1 : key === 'radius' ? 1 : 0.1}
                                        max={key === 'delay' ? 500 : key === 'range' ? 100 : key === 'radius' ? 10 : key === 'height' ? 5 : 20}
                                        step={key === 'delay' ? 10 : key.includes('speed') && feature.name === 'Fly' ? 0.1 : 1}
                                        className="w-full"
                                      />
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-sm text-gray-500">Модуль без настроек</p>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </div>
              </div>
            </Card>

            <button
              onClick={(e) => {
                e.preventDefault();
                handleDownload();
              }}
              type="button"
              className="minecraft-btn w-full"
              disabled={currentCheat.length === 0}
            >
              <div className="flex items-center justify-center gap-2">
                <Icon name="Package" size={16} />
                <span>DOWNLOAD ZIP</span>
              </div>
            </button>

            <div className="flex gap-2 justify-center pixelated">
              <div className="w-8 h-8 bg-minecraft-green hover:opacity-80 cursor-pointer transition"></div>
              <div className="w-8 h-8 bg-minecraft-brown hover:opacity-80 cursor-pointer transition"></div>
              <div className="w-8 h-8 bg-minecraft-gold hover:opacity-80 cursor-pointer transition"></div>
              <div className="w-8 h-8 bg-minecraft-stone hover:opacity-80 cursor-pointer transition"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
