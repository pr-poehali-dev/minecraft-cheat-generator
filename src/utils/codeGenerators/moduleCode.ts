import { CheatFeature } from '@/types/cheat';

export const generateModuleCode = (feature: CheatFeature): string => {
  const className = feature.name.replace(/[^a-zA-Z]/g, '');
  const categoryEnum = feature.category.toUpperCase();
  const keyBind = `GLFW.GLFW_KEY_${feature.name.charAt(0).toUpperCase()}`;

  const settingsFields = Object.entries(feature.settings)
    .map(([key, value]) => {
      const type = typeof value === 'boolean' ? 'boolean' : 'double';
      return `    private ${type} ${key} = ${value};`;
    }).join('\n');

  const implementations: Record<string, string> = {
    'KillAura': `
    @Override
    public void onUpdate() {
        Minecraft mc = Minecraft.getInstance();
        if (mc.player == null || mc.level == null) return;
        
        net.minecraft.world.entity.LivingEntity target = null;
        double closestDistance = range;
        
        for (net.minecraft.world.entity.Entity entity : mc.level.entitiesForRendering()) {
            if (entity instanceof net.minecraft.world.entity.LivingEntity living && 
                entity != mc.player && !entity.isSpectator()) {
                
                double distance = mc.player.distanceTo(entity);
                if (distance < closestDistance) {
                    target = living;
                    closestDistance = distance;
                }
            }
        }
        
        if (target != null) {
            if (rotations) {
                com.client.utils.RotationUtils.faceEntity(target);
            }
            
            if (mc.player.getAttackStrengthScale(0.5f) >= 1.0f) {
                mc.gameMode.attack(mc.player, target);
                mc.player.swing(net.minecraft.world.InteractionHand.MAIN_HAND);
                mc.player.resetAttackStrengthTicker();
            }
        }
    }`,
    'Velocity': `
    @Override
    public void onUpdate() {
        Minecraft mc = Minecraft.getInstance();
        if (mc.player == null) return;
        
        if (mc.player.hurtTime > 0) {
            double motionX = mc.player.getDeltaMovement().x * (horizontal / 100.0);
            double motionY = mc.player.getDeltaMovement().y * (vertical / 100.0);
            double motionZ = mc.player.getDeltaMovement().z * (horizontal / 100.0);
            mc.player.setDeltaMovement(motionX, motionY, motionZ);
        }
    }`,
    'Fly': `
    @Override
    public void onUpdate() {
        Minecraft mc = Minecraft.getInstance();
        if (mc.player == null) return;
        
        mc.player.getAbilities().flying = true;
        mc.player.getAbilities().setFlyingSpeed((float) speed / 10.0f);
        mc.player.onUpdateAbilities();
        
        if (antiKick && mc.player.tickCount % 20 == 0) {
            mc.player.setDeltaMovement(mc.player.getDeltaMovement().x, -0.04, mc.player.getDeltaMovement().z);
        }
    }
    
    @Override
    public void onDisable() {
        Minecraft mc = Minecraft.getInstance();
        if (mc.player != null) {
            mc.player.getAbilities().flying = false;
            mc.player.onUpdateAbilities();
        }
    }`,
    'ESP': `
    @Override
    public void onRender() {
        Minecraft mc = Minecraft.getInstance();
        if (mc.player == null || mc.level == null) return;
        
        for (net.minecraft.world.entity.Entity entity : mc.level.entitiesForRendering()) {
            if (entity instanceof net.minecraft.world.entity.player.Player player && entity != mc.player) {
                double distance = mc.player.distanceTo(entity);
                if (distance <= range) {
                    // Render ESP box, health bar, armor
                    // Implementation requires rendering context
                }
            }
        }
    }`
  };

  const implementation = implementations[className] || `
    @Override
    public void onUpdate() {
        // ${feature.name} implementation
        Minecraft mc = Minecraft.getInstance();
        if (mc.player == null) return;
        
        // Module logic here
    }`;

  return `package com.client.modules.${feature.category.toLowerCase()};

import com.client.ModuleManager.Module;
import net.minecraft.client.Minecraft;
import org.lwjgl.glfw.GLFW;

public class ${className} extends Module {
    
${settingsFields}
    
    public ${className}() {
        super("${feature.name}", Category.${categoryEnum}, ${keyBind});
    }
    ${implementation}
}`;
};
