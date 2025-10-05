import { CheatFeature } from '@/types/cheat';

export const generateModuleManager = (cheatName: string, currentCheat: CheatFeature[]): string => {
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
