export const generateMainClass = (cheatName: string): string => {
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
