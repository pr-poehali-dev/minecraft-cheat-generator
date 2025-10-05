export const generateEventManager = (cheatName: string): string => {
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
