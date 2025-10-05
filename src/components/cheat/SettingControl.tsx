import { Setting } from '@/types/cheat';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface SettingControlProps {
  setting: Setting;
  onChange: (value: number | boolean | string) => void;
}

export const SettingControl = ({ setting, onChange }: SettingControlProps) => {
  const renderControl = () => {
    switch (setting.type) {
      case 'toggle':
        return (
          <Switch
            checked={setting.value as boolean}
            onCheckedChange={onChange}
          />
        );

      case 'slider':
        return (
          <div className="space-y-1">
            <Slider
              value={[setting.value as number]}
              onValueChange={(val) => onChange(val[0])}
              min={setting.min ?? 0}
              max={setting.max ?? 100}
              step={setting.step ?? 1}
              className="w-full"
            />
            <div className="text-xs text-right text-minecraft-stone">
              {(setting.value as number).toFixed(setting.step && setting.step < 1 ? 1 : 0)}
            </div>
          </div>
        );

      case 'mode':
        return (
          <Select 
            value={setting.value as string} 
            onValueChange={onChange}
          >
            <SelectTrigger className="w-full border-2 border-minecraft-stone">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {setting.options?.map(opt => (
                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'color':
        return (
          <div className="flex items-center gap-2">
            <Input
              type="color"
              value={setting.value as string}
              onChange={(e) => onChange(e.target.value)}
              className="w-16 h-10 p-1 cursor-pointer"
            />
            <Input
              type="text"
              value={setting.value as string}
              onChange={(e) => onChange(e.target.value)}
              className="flex-1 border-2 border-minecraft-stone font-mono text-xs"
              placeholder="#FFFFFF"
            />
          </div>
        );

      case 'keybind':
        return (
          <Input
            type="text"
            value={setting.value as string}
            readOnly
            placeholder="Press a key..."
            className="border-2 border-minecraft-stone text-center"
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase text-minecraft-stone">
          {setting.name}
        </label>
        {setting.type === 'toggle' && (
          <span className="text-xs text-minecraft-gold">
            {setting.value ? 'ON' : 'OFF'}
          </span>
        )}
      </div>
      {renderControl()}
    </div>
  );
};
