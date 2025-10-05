import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { CheatFeature } from '@/types/cheat';
import { SettingControl } from './SettingControl';

interface ConfigPanelProps {
  cheatName: string;
  setCheatName: (value: string) => void;
  currentCheat: CheatFeature[];
  updateFeatureSetting: (featureName: string, key: string, value: number | boolean | string) => void;
  setSelectedFeature: (feature: CheatFeature | null) => void;
}

export const ConfigPanel = ({ 
  cheatName, 
  setCheatName, 
  currentCheat, 
  updateFeatureSetting,
  setSelectedFeature
}: ConfigPanelProps) => {
  return (
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
                              Object.entries(feature.settings).map(([key, setting]) => (
                                <SettingControl
                                  key={key}
                                  setting={setting}
                                  onChange={(value) => updateFeatureSetting(feature.name, key, value)}
                                />
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
  );
};