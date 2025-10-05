export const generateClickGUI = (cheatName: string): string => {
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
