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
      'killaura': { name: 'KillAura', settings: { range: 4, speed: 10 } },
      'fly': { name: 'Fly Hack', settings: { speed: 5 } },
      'xray': { name: 'X-Ray', settings: {} },
      'speed': { name: 'Speed Hack', settings: { speed: 8 } },
      'bhop': { name: 'Bunny Hop', settings: { speed: 6 } },
      'anti': { name: 'Anti-Knockback', settings: {} },
      'aimbot': { name: 'AimBot', settings: { range: 50 } },
      'esp': { name: 'ESP (Wallhack)', settings: { range: 100 } },
      'scaffold': { name: 'Scaffold', settings: { delay: 50 } },
      'velocity': { name: 'Velocity', settings: { speed: 3 } },
      'fullbright': { name: 'FullBright', settings: {} },
      'nuker': { name: 'Nuker', settings: { range: 5, speed: 5 } },
      'автоклик': { name: 'Auto Clicker', settings: { delay: 100 } },
      'меню': { name: 'GUI Menu', settings: {} }
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
    return `✅ Создаю чит с функциями: ${featureList}\n\nДобавлены модули:\n${features.map(f => `• ${f.name} - активирован`).join('\n')}\n\nТеперь можешь настроить каждый модуль (кликни на него) и скачать полный ZIP-архив!`;
  };

  const handleDownload = async () => {
    if (currentCheat.length === 0) {
      toast.error('Сначала создай чит в чате!');
      return;
    }

    const zip = new JSZip();

    const mainCode = generateMainClass();
    zip.file(`src/main/java/com/cheat/${cheatName}.java`, mainCode);

    currentCheat.forEach(feature => {
      const moduleCode = generateModuleCode(feature);
      const moduleName = feature.name.replace(/[^a-zA-Z]/g, '');
      zip.file(`src/main/java/com/cheat/modules/${moduleName}.java`, moduleCode);
    });

    const buildGradle = generateBuildGradle();
    zip.file('build.gradle', buildGradle);

    const readme = generateReadme();
    zip.file('README.md', readme);

    const forgeGradle = `buildscript {
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

version = '1.0'
group = 'com.cheat'

minecraft {
    mappings channel: 'official', version: '1.19.2'
}

dependencies {
    minecraft 'net.minecraftforge:forge:1.19.2-43.2.0'
}`;

    zip.file('build.gradle', forgeGradle);

    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${cheatName}.zip`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success('ZIP-архив скачан! Распакуй и скомпилируй через Gradle');
  };

  const generateMainClass = (): string => {
    return `package com.cheat;

import net.minecraftforge.fml.common.Mod;
import net.minecraftforge.fml.event.lifecycle.FMLClientSetupEvent;
import net.minecraftforge.fml.javafmlmod.FMLJavaModLoadingContext;

@Mod("${cheatName.toLowerCase()}")
public class ${cheatName} {
    
    public ${cheatName}() {
        FMLJavaModLoadingContext.get().getModEventBus().addListener(this::clientSetup);
    }
    
    private void clientSetup(FMLClientSetupEvent event) {
        System.out.println("${cheatName} initialized!");
        initModules();
    }
    
    private void initModules() {
${currentCheat.map(f => `        ${f.name.replace(/[^a-zA-Z]/g, '')}.init();`).join('\n')}
    }
}`;
  };

  const generateModuleCode = (feature: CheatFeature): string => {
    const moduleName = feature.name.replace(/[^a-zA-Z]/g, '');
    const settings = Object.entries(feature.settings)
      .map(([key, value]) => `    private static ${typeof value === 'number' ? 'double' : 'String'} ${key} = ${value};`)
      .join('\n');

    return `package com.cheat.modules;

public class ${moduleName} {
    
    private static boolean enabled = ${feature.enabled};
${settings}
    
    public static void init() {
        System.out.println("${feature.name} module loaded");
        System.out.println("Settings: ${Object.entries(feature.settings).map(([k, v]) => `${k}=${v}`).join(', ')}");
    }
    
    public static void toggle() {
        enabled = !enabled;
    }
    
    public static boolean isEnabled() {
        return enabled;
    }
}`;
  };

  const generateBuildGradle = (): string => {
    return `plugins {
    id 'java'
}

group = 'com.cheat'
version = '1.0'

repositories {
    mavenCentral()
    maven { url 'https://maven.minecraftforge.net' }
}

dependencies {
    // Minecraft Forge dependencies here
}`;
  };

  const generateReadme = (): string => {
    return `# ${cheatName}

Minecraft Java Cheat Client

## Features
${currentCheat.map(f => `- **${f.name}** ${Object.entries(f.settings).length > 0 ? `(${Object.entries(f.settings).map(([k, v]) => `${k}: ${v}`).join(', ')})` : ''}`).join('\n')}

## Build Instructions
1. Install Java JDK 17+
2. Install Gradle
3. Run: \`gradle build\`
4. Output: \`build/libs/${cheatName}-1.0.jar\`

## Installation
1. Install Minecraft Forge 1.19.2
2. Copy JAR to \`.minecraft/mods\` folder
3. Launch Minecraft

## Usage
Press Right Shift to open mod menu

---
Generated by Minecraft Cheat Generator`;
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
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Опиши функции для чита..."
                    className="flex-1 border-2 border-minecraft-stone"
                  />
                  <Button
                    onClick={handleSend}
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
                    FUNCTIONS
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
                                {Object.entries(feature.settings).map(([key, value]) => (
                                  <div key={key} className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-minecraft-stone">
                                      {key}: {value}
                                    </label>
                                    <Slider
                                      value={[value as number]}
                                      onValueChange={(val) => updateFeatureSetting(feature.name, key, val[0])}
                                      min={key === 'delay' ? 10 : 1}
                                      max={key === 'delay' ? 500 : key === 'range' ? 100 : 20}
                                      step={1}
                                      className="w-full"
                                    />
                                  </div>
                                ))}
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
              onClick={handleDownload}
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
