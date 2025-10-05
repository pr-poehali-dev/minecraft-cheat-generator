export const generateClickGUI = (cheatName: string): string => {
  return `package com.client.gui;

import net.minecraft.client.gui.GuiGraphics;
import net.minecraft.client.gui.screens.Screen;
import net.minecraft.network.chat.Component;
import com.client.${cheatName};
import com.client.ModuleManager;
import java.awt.Color;

public class ClickGUI extends Screen {
    
    private int panelX = 20;
    private int panelY = 20;
    private int panelWidth = 140;
    private int categoryHeight = 24;
    private String theme = "Astolfo";
    private boolean blur = true;
    private boolean animations = true;
    
    public ClickGUI() {
        super(Component.literal("${cheatName} Menu"));
    }
    
    @Override
    public void render(GuiGraphics graphics, int mouseX, int mouseY, float partialTick) {
        if (blur) {
            this.renderBackground(graphics);
        }
        
        super.render(graphics, mouseX, mouseY, partialTick);
        
        int currentY = panelY;
        int rainbow = (int) (System.currentTimeMillis() % 3000);
        
        for (ModuleManager.Module.Category category : ModuleManager.Module.Category.values()) {
            int categoryColor = getThemeColor(theme, rainbow);
            
            graphics.fill(panelX, currentY, panelX + panelWidth, currentY + categoryHeight, categoryColor);
            graphics.drawString(this.font, category.name(), panelX + 8, currentY + 8, 0xFFFFFFFF, true);
            currentY += categoryHeight;
            
            for (ModuleManager.Module module : ${cheatName}.moduleManager.getModulesByCategory(category)) {
                int bgColor = module.isEnabled() ? 
                    applyAlpha(categoryColor, 0.3f) : 0xAA1A1A1A;
                
                graphics.fill(panelX, currentY, panelX + panelWidth, currentY + 18, bgColor);
                
                if (module.isEnabled()) {
                    graphics.fill(panelX, currentY, panelX + 3, currentY + 18, categoryColor);
                }
                
                int textColor = module.isEnabled() ? 0xFFFFFFFF : 0xFFAAAAAA;
                graphics.drawString(this.font, module.getName(), panelX + 10, currentY + 5, textColor);
                
                String keybind = getKeybindName(module.getKeyBind());
                graphics.drawString(this.font, "[" + keybind + "]", 
                    panelX + panelWidth - this.font.width("[" + keybind + "]") - 5, 
                    currentY + 5, 0xFF888888);
                
                currentY += 18;
            }
            
            currentY += 8;
        }
        
        graphics.drawString(this.font, "${cheatName} | Theme: " + theme, 
            10, this.height - 20, getThemeColor(theme, rainbow), true);
    }
    
    @Override
    public boolean mouseClicked(double mouseX, double mouseY, int button) {
        int currentY = panelY;
        
        for (ModuleManager.Module.Category category : ModuleManager.Module.Category.values()) {
            currentY += categoryHeight;
            
            for (ModuleManager.Module module : ${cheatName}.moduleManager.getModulesByCategory(category)) {
                if (mouseX >= panelX && mouseX <= panelX + panelWidth &&
                    mouseY >= currentY && mouseY <= currentY + 18) {
                    if (button == 0) {
                        module.toggle();
                    } else if (button == 1) {
                        // Right click for settings
                    }
                    return true;
                }
                currentY += 18;
            }
            currentY += 8;
        }
        
        return super.mouseClicked(mouseX, mouseY, button);
    }
    
    private int getThemeColor(String theme, int rainbow) {
        switch (theme) {
            case "Astolfo":
                return Color.HSBtoRGB((rainbow / 3000.0f), 0.8f, 1.0f) | 0xFF000000;
            case "Vape":
                return 0xFF00D9FF;
            case "Nursultan":
                return 0xFF9B59B6;
            case "Celestial":
                return 0xFF00FFFF;
            case "Raven":
                return 0xFFFF4655;
            case "Novoline":
                return 0xFF00C9FF;
            default:
                return 0xFF9B59B6;
        }
    }
    
    private int applyAlpha(int color, float alpha) {
        int a = (int) (alpha * 255);
        return (color & 0x00FFFFFF) | (a << 24);
    }
    
    private String getKeybindName(int keyCode) {
        return org.lwjgl.glfw.GLFW.glfwGetKeyName(keyCode, 0);
    }
    
    @Override
    public boolean isPauseScreen() {
        return false;
    }
}`;
};
