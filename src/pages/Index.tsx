import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Message, CheatFeature } from '@/types/cheat';
import { ChatPanel } from '@/components/cheat/ChatPanel';
import { ConfigPanel } from '@/components/cheat/ConfigPanel';
import { extractFeatures, generateResponse } from '@/utils/moduleDatabase';
import { handleDownload } from '@/utils/downloadCheat';

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

  const updateFeatureSetting = (featureName: string, key: string, value: number | boolean | string) => {
    setCurrentCheat(prev => prev.map(f => 
      f.name === featureName 
        ? { 
            ...f, 
            settings: { 
              ...f.settings, 
              [key]: { ...f.settings[key], value } 
            } 
          }
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
            <ChatPanel 
              messages={messages}
              input={input}
              setInput={setInput}
              handleSend={handleSend}
            />
          </div>

          <div className="space-y-6">
            <ConfigPanel
              cheatName={cheatName}
              setCheatName={setCheatName}
              currentCheat={currentCheat}
              updateFeatureSetting={updateFeatureSetting}
              setSelectedFeature={setSelectedFeature}
            />

            <button
              onClick={(e) => {
                e.preventDefault();
                handleDownload(cheatName, currentCheat);
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