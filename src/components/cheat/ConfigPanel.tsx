import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { CheatFeature } from '@/types/cheat';

interface ConfigPanelProps {
  cheatName: string;
  setCheatName: (value: string) => void;
  currentCheat: CheatFeature[];
  updateFeatureSetting: (featureName: string, key: string, value: number | boolean) => void;
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
  );
};
