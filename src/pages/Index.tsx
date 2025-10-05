import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
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
  category: 'Combat' | 'Movement' | 'Player' | 'Render' | 'World';
  settings: Record<string, number | boolean>;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '👾 Привет! Я создам для тебя профессиональный чит-клиент для Minecraft Java Edition.\n\nОпиши какие модули нужны (например: "боевой чит с killaura и velocity" или "movement чит с fly, speed и scaffold")\n\n📦 Популярные категории:\n• Combat: KillAura, Velocity, Criticals\n• Movement: Fly, Speed, Sprint, NoFall\n• Render: ESP, Tracers, Chams, FullBright\n• World: Scaffold, Nuker, ChestESP'
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
          setCheatName(`CustomClient_${Date.now()}`);
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
    const moduleDatabase: Record<string, { name: string; category: CheatFeature['category']; settings: any }> = {
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

  const generateResponse = (userInput: string, features: CheatFeature[]): string => {
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

  const handleDownload = async () => {
    if (currentCheat.length === 0) {
      toast.error('Сначала создай чит в чате!');
      return;
    }

    toast.info('Генерирую профессиональный чит-клиент...');

    const zip = new JSZip();

    // Main mod class
    const mainCode = generateMainClass();
    zip.file(`src/main/java/com/client/${cheatName}.java`, mainCode);

    // Module manager system
    const moduleManager = generateModuleManager();
    zip.file(`src/main/java/com/client/ModuleManager.java`, moduleManager);

    // Event system
    const eventManager = generateEventManager();
    zip.file(`src/main/java/com/client/EventManager.java`, eventManager);

    // GUI ClickGUI
    const clickGui = generateClickGUI();
    zip.file(`src/main/java/com/client/gui/ClickGUI.java`, clickGui);

    // Config system
    const configManager = generateConfigManager();
    zip.file(`src/main/java/com/client/ConfigManager.java`, configManager);

    // Individual modules
    currentCheat.forEach(feature => {
      const moduleCode = generateModuleCode(feature);
      const moduleName = feature.name.replace(/[^a-zA-Z]/g, '');
      zip.file(`src/main/java/com/client/modules/${feature.category.toLowerCase()}/${moduleName}.java`, moduleCode);
    });

    // Utilities
    const rotationUtil = generateRotationUtil();
    zip.file(`src/main/java/com/client/utils/RotationUtils.java`, rotationUtil);

    const timerUtil = generateTimerUtil();
    zip.file(`src/main/java/com/client/utils/TimerUtils.java`, timerUtil);

    // Build files
    const buildGradle = generateBuildGradle();
    zip.file('build.gradle', buildGradle);

    const modInfo = generateModInfo();
    zip.file('src/main/resources/META-INF/mods.toml', modInfo);

    const readme = generateReadme();
    zip.file('README.md', readme);

    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${cheatName}_Source.zip`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success(`${cheatName} скачан! Внутри полный исходник с GUI`);
  };

  const generateMainClass = (): string => {
    return `package com.client;

import net.minecraftforge.common.MinecraftForge;
import net.minecraftforge.fml.common.Mod;
import net.minecraftforge.fml.event.lifecycle.FMLClientSetupEvent;
import net.minecraftforge.fml.javafmlmod.FMLJavaModLoadingContext;

@Mod("${cheatName.toLowerCase()}")
public class ${cheatName} {
    
    public static final String MOD_ID = "${cheatName.toLowerCase()}";
    public static final String VERSION = "1.0.0";
    
    public static ModuleManager moduleManager;
    public static EventManager eventManager;
    public static ConfigManager configManager;
    
    public ${cheatName}() {
        FMLJavaModLoadingContext.get().getModEventBus().addListener(this::onClientSetup);
    }
    
    private void onClientSetup(FMLClientSetupEvent event) {
        System.out.println("[${cheatName}] Initializing client v" + VERSION);
        
        eventManager = new EventManager();
        moduleManager = new ModuleManager();
        configManager = new ConfigManager();
        
        MinecraftForge.EVENT_BUS.register(eventManager);
        
        System.out.println("[${cheatName}] Loaded " + moduleManager.getModules().size() + " modules");
        System.out.println("[${cheatName}] Client initialized successfully!");
    }
}`;
  };

  const generateModuleManager = (): string => {
    const moduleInits = currentCheat.map(f => {
      const className = f.name.replace(/[^a-zA-Z]/g, '');
      return `        modules.add(new ${className}());`;
    }).join('\n');

    const imports = [...new Set(currentCheat.map(f => f.category))].map(cat => 
      `import com.client.modules.${cat.toLowerCase()}.*;`
    ).join('\n');

    return `package com.client;

import java.util.ArrayList;
import java.util.List;
${imports}

public class ModuleManager {
    
    private final List<Module> modules = new ArrayList<>();
    
    public ModuleManager() {
${moduleInits}
    }
    
    public List<Module> getModules() {
        return modules;
    }
    
    public Module getModule(String name) {
        return modules.stream()
            .filter(m -> m.getName().equalsIgnoreCase(name))
            .findFirst()
            .orElse(null);
    }
    
    public List<Module> getModulesByCategory(Module.Category category) {
        return modules.stream()
            .filter(m -> m.getCategory() == category)
            .toList();
    }
    
    public static abstract class Module {
        
        protected String name;
        protected Category category;
        protected int keyBind;
        protected boolean enabled = false;
        
        public enum Category {
            COMBAT, MOVEMENT, PLAYER, RENDER, WORLD
        }
        
        public Module(String name, Category category, int keyBind) {
            this.name = name;
            this.category = category;
            this.keyBind = keyBind;
        }
        
        public void toggle() {
            enabled = !enabled;
            if (enabled) onEnable();
            else onDisable();
        }
        
        public void onEnable() {}
        public void onDisable() {}
        public void onUpdate() {}
        public void onRender() {}
        
        public String getName() { return name; }
        public Category getCategory() { return category; }
        public int getKeyBind() { return keyBind; }
        public boolean isEnabled() { return enabled; }
        public void setEnabled(boolean enabled) { this.enabled = enabled; }
    }
}`;
  };

  const generateEventManager = (): string => {
    return `package com.client;

import net.minecraft.client.Minecraft;
import net.minecraftforge.client.event.RenderLevelStageEvent;
import net.minecraftforge.event.TickEvent;
import net.minecraftforge.eventbus.api.SubscribeEvent;
import net.minecraftforge.client.event.InputEvent;
import org.lwjgl.glfw.GLFW;

public class EventManager {
    
    private final Minecraft mc = Minecraft.getInstance();
    
    @SubscribeEvent
    public void onClientTick(TickEvent.ClientTickEvent event) {
        if (event.phase != TickEvent.Phase.START || mc.player == null) return;
        
        ${cheatName}.moduleManager.getModules().stream()
            .filter(ModuleManager.Module::isEnabled)
            .forEach(ModuleManager.Module::onUpdate);
    }
    
    @SubscribeEvent
    public void onRenderWorld(RenderLevelStageEvent event) {
        if (mc.player == null) return;
        
        ${cheatName}.moduleManager.getModules().stream()
            .filter(ModuleManager.Module::isEnabled)
            .forEach(ModuleManager.Module::onRender);
    }
    
    @SubscribeEvent
    public void onKeyInput(InputEvent.Key event) {
        if (mc.player == null || event.getAction() != GLFW.GLFW_PRESS) return;
        
        // Right Shift = ClickGUI
        if (event.getKey() == GLFW.GLFW_KEY_RIGHT_SHIFT) {
            mc.setScreen(new com.client.gui.ClickGUI());
        }
        
        // Module keybinds
        ${cheatName}.moduleManager.getModules().forEach(module -> {
            if (module.getKeyBind() == event.getKey()) {
                module.toggle();
                String status = module.isEnabled() ? "§aON" : "§cOFF";
                mc.player.displayClientMessage(
                    net.minecraft.network.chat.Component.literal("§7[" + module.getName() + "] " + status),
                    true
                );
            }
        });
    }
}`;
  };

  const generateClickGUI = (): string => {
    return `package com.client.gui;

import net.minecraft.client.gui.GuiGraphics;
import net.minecraft.client.gui.screens.Screen;
import net.minecraft.network.chat.Component;
import com.client.${cheatName};
import com.client.ModuleManager;

public class ClickGUI extends Screen {
    
    private int panelX = 20;
    private int panelY = 20;
    private int panelWidth = 120;
    private int categoryHeight = 20;
    
    public ClickGUI() {
        super(Component.literal("${cheatName} Menu"));
    }
    
    @Override
    public void render(GuiGraphics graphics, int mouseX, int mouseY, float partialTick) {
        super.render(graphics, mouseX, mouseY, partialTick);
        
        int currentY = panelY;
        
        for (ModuleManager.Module.Category category : ModuleManager.Module.Category.values()) {
            // Category header
            graphics.fill(panelX, currentY, panelX + panelWidth, currentY + categoryHeight, 0xFF2A2A2A);
            graphics.drawString(this.font, category.name(), panelX + 5, currentY + 6, 0xFFFFFF);
            currentY += categoryHeight;
            
            // Modules in category
            for (ModuleManager.Module module : ${cheatName}.moduleManager.getModulesByCategory(category)) {
                int color = module.isEnabled() ? 0xFF00AA00 : 0xFF1A1A1A;
                graphics.fill(panelX, currentY, panelX + panelWidth, currentY + 16, color);
                graphics.drawString(this.font, module.getName(), panelX + 8, currentY + 4, 0xFFFFFF);
                currentY += 16;
            }
            
            currentY += 5;
        }
    }
    
    @Override
    public boolean mouseClicked(double mouseX, double mouseY, int button) {
        int currentY = panelY;
        
        for (ModuleManager.Module.Category category : ModuleManager.Module.Category.values()) {
            currentY += categoryHeight;
            
            for (ModuleManager.Module module : ${cheatName}.moduleManager.getModulesByCategory(category)) {
                if (mouseX >= panelX && mouseX <= panelX + panelWidth &&
                    mouseY >= currentY && mouseY <= currentY + 16) {
                    module.toggle();
                    return true;
                }
                currentY += 16;
            }
            currentY += 5;
        }
        
        return super.mouseClicked(mouseX, mouseY, button);
    }
    
    @Override
    public boolean isPauseScreen() {
        return false;
    }
}`;
  };

  const generateConfigManager = (): string => {
    return `package com.client;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import java.io.*;
import java.nio.file.*;

public class ConfigManager {
    
    private static final Gson GSON = new GsonBuilder().setPrettyPrinting().create();
    private static final Path CONFIG_PATH = Paths.get("config/${cheatName.toLowerCase()}.json");
    
    public void saveConfig() {
        // TODO: Implement config saving
    }
    
    public void loadConfig() {
        // TODO: Implement config loading
    }
}`;
  };

  const generateModuleCode = (feature: CheatFeature): string => {
    const className = feature.name.replace(/[a-zA-Z]/g, '');
    const categoryEnum = feature.category.toUpperCase();
    const keyBind = `GLFW.GLFW_KEY_${feature.name.charAt(0).toUpperCase()}`;

    const settingsFields = Object.entries(feature.settings)
      .map(([key, value]) => {
        const type = typeof value === 'boolean' ? 'boolean' : 'double';
        return `    private ${type} ${key} = ${value};`;
      }).join('\n');

    const implementations: Record<string, string> = {
      'KillAura': `
    @Override
    public void onUpdate() {
        Minecraft mc = Minecraft.getInstance();
        if (mc.player == null || mc.level == null) return;
        
        net.minecraft.world.entity.LivingEntity target = null;
        double closestDistance = range;
        
        for (net.minecraft.world.entity.Entity entity : mc.level.entitiesForRendering()) {
            if (entity instanceof net.minecraft.world.entity.LivingEntity living && 
                entity != mc.player && !entity.isSpectator()) {
                
                double distance = mc.player.distanceTo(entity);
                if (distance < closestDistance) {
                    target = living;
                    closestDistance = distance;
                }
            }
        }
        
        if (target != null) {
            if (rotations) {
                com.client.utils.RotationUtils.faceEntity(target);
            }
            
            if (mc.player.getAttackStrengthScale(0.5f) >= 1.0f) {
                mc.gameMode.attack(mc.player, target);
                mc.player.swing(net.minecraft.world.InteractionHand.MAIN_HAND);
                mc.player.resetAttackStrengthTicker();
            }
        }
    }`,
      'Velocity': `
    @Override
    public void onUpdate() {
        Minecraft mc = Minecraft.getInstance();
        if (mc.player == null) return;
        
        if (mc.player.hurtTime > 0) {
            double motionX = mc.player.getDeltaMovement().x * (horizontal / 100.0);
            double motionY = mc.player.getDeltaMovement().y * (vertical / 100.0);
            double motionZ = mc.player.getDeltaMovement().z * (horizontal / 100.0);
            mc.player.setDeltaMovement(motionX, motionY, motionZ);
        }
    }`,
      'Fly': `
    @Override
    public void onUpdate() {
        Minecraft mc = Minecraft.getInstance();
        if (mc.player == null) return;
        
        mc.player.getAbilities().flying = true;
        mc.player.getAbilities().setFlyingSpeed((float) speed / 10.0f);
        mc.player.onUpdateAbilities();
        
        if (antiKick && mc.player.tickCount % 20 == 0) {
            mc.player.setDeltaMovement(mc.player.getDeltaMovement().x, -0.04, mc.player.getDeltaMovement().z);
        }
    }
    
    @Override
    public void onDisable() {
        Minecraft mc = Minecraft.getInstance();
        if (mc.player != null) {
            mc.player.getAbilities().flying = false;
            mc.player.onUpdateAbilities();
        }
    }`,
      'ESP': `
    @Override
    public void onRender() {
        Minecraft mc = Minecraft.getInstance();
        if (mc.player == null || mc.level == null) return;
        
        for (net.minecraft.world.entity.Entity entity : mc.level.entitiesForRendering()) {
            if (entity instanceof net.minecraft.world.entity.player.Player player && entity != mc.player) {
                double distance = mc.player.distanceTo(entity);
                if (distance <= range) {
                    // Render ESP box, health bar, armor
                    // Implementation requires rendering context
                }
            }
        }
    }`
    };

    const implementation = implementations[className] || `
    @Override
    public void onUpdate() {
        // ${feature.name} implementation
        Minecraft mc = Minecraft.getInstance();
        if (mc.player == null) return;
        
        // Module logic here
    }`;

    return `package com.client.modules.${feature.category.toLowerCase()};

import com.client.ModuleManager.Module;
import net.minecraft.client.Minecraft;
import org.lwjgl.glfw.GLFW;

public class ${className} extends Module {
    
${settingsFields}
    
    public ${className}() {
        super("${feature.name}", Category.${categoryEnum}, ${keyBind});
    }
    ${implementation}
}`;
  };

  const generateRotationUtil = (): string => {
    return `package com.client.utils;

import net.minecraft.client.Minecraft;
import net.minecraft.world.entity.Entity;
import net.minecraft.world.phys.Vec3;

public class RotationUtils {
    
    public static void faceEntity(Entity entity) {
        Minecraft mc = Minecraft.getInstance();
        if (mc.player == null) return;
        
        Vec3 playerPos = mc.player.getEyePosition();
        Vec3 targetPos = entity.getEyePosition();
        
        double deltaX = targetPos.x - playerPos.x;
        double deltaY = targetPos.y - playerPos.y;
        double deltaZ = targetPos.z - playerPos.z;
        
        double distance = Math.sqrt(deltaX * deltaX + deltaZ * deltaZ);
        
        float yaw = (float) (Math.atan2(deltaZ, deltaX) * 180.0 / Math.PI) - 90.0f;
        float pitch = (float) -(Math.atan2(deltaY, distance) * 180.0 / Math.PI);
        
        mc.player.setYRot(yaw);
        mc.player.setXRot(pitch);
    }
}`;
  };

  const generateTimerUtil = (): string => {
    return `package com.client.utils;

public class TimerUtils {
    
    private long lastMS = System.currentTimeMillis();
    
    public void reset() {
        lastMS = System.currentTimeMillis();
    }
    
    public boolean hasTimeElapsed(long time) {
        return System.currentTimeMillis() - lastMS >= time;
    }
    
    public long getTime() {
        return System.currentTimeMillis() - lastMS;
    }
}`;
  };

  const generateBuildGradle = (): string => {
    return `buildscript {
    repositories {
        maven { url = 'https://maven.minecraftforge.net' }
        mavenCentral()
    }
    dependencies {
        classpath 'net.minecraftforge.gradle:ForgeGradle:5.1.+'
    }
}

apply plugin: 'net.minecraftforge.gradle'
apply plugin: 'java'

version = '1.0.0'
group = 'com.client'
archivesBaseName = '${cheatName}'

java.toolchain.languageVersion = JavaLanguageVersion.of(17)

minecraft {
    mappings channel: 'official', version: '1.19.2'
    
    runs {
        client {
            workingDirectory project.file('run')
            property 'forge.logging.console.level', 'info'
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
    implementation 'com.google.code.gson:gson:2.10.1'
}

jar {
    manifest {
        attributes([
            "Specification-Title": "${cheatName}",
            "Implementation-Title": "${cheatName}",
            "Implementation-Version": "1.0.0"
        ])
    }
}`;
  };

  const generateModInfo = (): string => {
    return `modLoader="javafml"
loaderVersion="[43,)"

[[mods]]
modId="${cheatName.toLowerCase()}"
version="1.0.0"
displayName="${cheatName}"
description="Professional Minecraft cheat client"
authors="CheatGen AI"

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
    const byCategory = currentCheat.reduce((acc, f) => {
      if (!acc[f.category]) acc[f.category] = [];
      acc[f.category].push(f);
      return acc;
    }, {} as Record<string, CheatFeature[]>);

    return `# ${cheatName}
> Professional Minecraft Java Edition Cheat Client

## ✨ Features (${currentCheat.length} modules)

${Object.entries(byCategory).map(([cat, mods]) => `### ${cat}
${mods.map(m => `- **${m.name}** ${Object.keys(m.settings).length > 0 ? `- \`${Object.entries(m.settings).map(([k,v]) => \`\${k}=\${v}\`).join(', ')}\`` : ''}`).join('\n')}`).join('\n\n')}

## 🎮 Controls

| Key | Action |
|-----|--------|
| **Right Shift** | Open ClickGUI menu |
${currentCheat.slice(0, 10).map(f => `| **${f.name.charAt(0).toUpperCase()}** | Toggle ${f.name} |`).join('\n')}

## 🔧 Building

### Requirements:
- Java JDK 17+
- Gradle 7.6+
- Minecraft Forge 1.19.2

### Build steps:
\`\`\`bash
# Windows
.\\gradlew.bat build

# Linux/Mac
./gradlew build
\`\`\`

Output: \`build/libs/${cheatName}-1.0.0.jar\`

## 📦 Installation

1. Install Minecraft Forge 1.19.2 (43.2.0+)
2. Copy JAR to \`.minecraft/mods/\`
3. Launch Minecraft with Forge profile

## 🏗️ Architecture

\`\`\`
${cheatName}/
├── ModuleManager    - Module system core
├── EventManager     - Forge event handling
├── ConfigManager    - Save/load configs
├── ClickGUI         - In-game menu
├── modules/         - All cheat modules
│   ├── combat/
│   ├── movement/
│   ├── render/
│   └── world/
└── utils/           - Helper utilities
\`\`\`

## ⚠️ Disclaimer

**For educational purposes only!** 
- Use only on private servers or singleplayer
- Most servers prohibit cheats - risk of ban
- Author not responsible for consequences

---
🤖 Generated by **Minecraft Cheat Generator AI**  
Based on: Nursultan, Celestial, Vape v4 architecture`;
  };

  const updateFeatureSetting = (featureName: string, key: string, value: number | boolean) => {
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
            Профессиональные чит-клиенты через AI
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="minecraft-border bg-white p-0 overflow-hidden">
              <div className="bg-minecraft-brown p-4 border-b-4 border-minecraft-stone">
                <h2 className="pixel-font text-white text-sm">AI GENERATOR</h2>
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
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="flex gap-2"
                >
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Опиши модули для чита..."
                    className="flex-1 border-2 border-minecraft-stone"
                  />
                  <Button
                    type="submit"
                    className="minecraft-btn"
                  >
                    <Icon name="Send" size={16} />
                  </Button>
                </form>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="minecraft-border bg-white p-0">
              <div className="bg-minecraft-brown p-4 border-b-4 border-minecraft-stone">
                <h2 className="pixel-font text-white text-xs">CLIENT CONFIG</h2>
              </div>

              <div className="p-4 space-y-4">
                <div>
                  <label className="text-xs font-bold text-minecraft-stone mb-2 block">
                    CLIENT NAME
                  </label>
                  <Input
                    value={cheatName}
                    onChange={(e) => setCheatName(e.target.value)}
                    placeholder="CustomClient"
                    className="border-2 border-minecraft-stone"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-minecraft-stone mb-2 block">
                    MODULES ({currentCheat.length})
                  </label>
                  <ScrollArea className="h-[220px]">
                    {currentCheat.length === 0 ? (
                      <p className="text-sm text-gray-500">AI создаст модули...</p>
                    ) : (
                      <div className="space-y-2">
                        {Object.entries(
                          currentCheat.reduce((acc, f) => {
                            if (!acc[f.category]) acc[f.category] = [];
                            acc[f.category].push(f);
                            return acc;
                          }, {} as Record<string, CheatFeature[]>)
                        ).map(([category, features]) => (
                          <div key={category}>
                            <div className="text-xs font-bold text-minecraft-stone mb-1 mt-2">
                              {category}
                            </div>
                            {features.map((feature, idx) => (
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
                                            {key}: {typeof value === 'boolean' ? (value ? 'ON' : 'OFF') : value}
                                          </label>
                                          {typeof value === 'boolean' ? (
                                            <Switch
                                              checked={value}
                                              onCheckedChange={(checked) => updateFeatureSetting(feature.name, key, checked)}
                                            />
                                          ) : (
                                            <Slider
                                              value={[value as number]}
                                              onValueChange={(val) => updateFeatureSetting(feature.name, key, val[0])}
                                              min={key.includes('CPS') ? 1 : key === 'delay' ? 10 : key.includes('range') ? 1 : key.includes('fov') ? 30 : 0}
                                              max={key.includes('CPS') ? 20 : key === 'delay' ? 500 : key.includes('range') ? 256 : key.includes('fov') ? 180 : 10}
                                              step={key.includes('speed') || key.includes('boost') ? 0.1 : key === 'delay' ? 10 : 1}
                                              className="w-full"
                                            />
                                          )}
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
                <Icon name="Download" size={16} />
                <span>DOWNLOAD SOURCE</span>
              </div>
            </button>

            <div className="bg-minecraft-brown/20 p-3 rounded">
              <p className="text-xs text-minecraft-stone text-center">
                📦 Архитектура как у Nursultan, Celestial, Vape v4
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
