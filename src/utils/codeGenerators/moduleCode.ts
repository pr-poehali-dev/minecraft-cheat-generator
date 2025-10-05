import { CheatFeature, Setting } from '@/types/cheat';

export const generateModuleCode = (feature: CheatFeature): string => {
  const className = feature.name.replace(/[^a-zA-Z]/g, '');
  const categoryEnum = feature.category.toUpperCase();
  const keyBind = `GLFW.GLFW_KEY_${feature.name.charAt(0).toUpperCase()}`;

  const settingsFields = Object.entries(feature.settings)
    .map(([key, setting]: [string, Setting]) => {
      const javaType = setting.type === 'toggle' ? 'boolean' 
        : setting.type === 'mode' || setting.type === 'color' || setting.type === 'keybind' ? 'String' 
        : 'double';
      const value = setting.type === 'toggle' ? setting.value 
        : setting.type === 'mode' || setting.type === 'color' || setting.type === 'keybind' ? `"${setting.value}"` 
        : setting.value;
      return `    private ${javaType} ${key} = ${value};`;
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
                if (swing) mc.player.swing(net.minecraft.world.InteractionHand.MAIN_HAND);
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
            if (mode.equals("Cancel")) {
                double motionX = mc.player.getDeltaMovement().x * (horizontal / 100.0);
                double motionY = mc.player.getDeltaMovement().y * (vertical / 100.0);
                double motionZ = mc.player.getDeltaMovement().z * (horizontal / 100.0);
                mc.player.setDeltaMovement(motionX, motionY, motionZ);
            }
        }
    }`,
    'Fly': `
    @Override
    public void onUpdate() {
        Minecraft mc = Minecraft.getInstance();
        if (mc.player == null) return;
        
        if (mode.equals("Vanilla")) {
            mc.player.getAbilities().flying = true;
            mc.player.getAbilities().setFlyingSpeed((float) speed / 10.0f);
            mc.player.onUpdateAbilities();
            
            if (antiKick && mc.player.tickCount % 20 == 0) {
                mc.player.setDeltaMovement(mc.player.getDeltaMovement().x, -0.04, mc.player.getDeltaMovement().z);
            }
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
    'Speed': `
    @Override
    public void onUpdate() {
        Minecraft mc = Minecraft.getInstance();
        if (mc.player == null) return;
        
        if (mode.equals("Strafe")) {
            if (mc.player.onGround() && mc.player.input.hasForwardImpulse()) {
                double motionX = -Math.sin(Math.toRadians(mc.player.getYRot())) * speed;
                double motionZ = Math.cos(Math.toRadians(mc.player.getYRot())) * speed;
                mc.player.setDeltaMovement(motionX, mc.player.getDeltaMovement().y, motionZ);
            }
        }
    }`,
    'Scaffold': `
    private com.client.utils.TimerUtils timer = new com.client.utils.TimerUtils();
    
    @Override
    public void onUpdate() {
        Minecraft mc = Minecraft.getInstance();
        if (mc.player == null) return;
        
        if (!timer.hasTimeElapsed((long) delay)) return;
        
        net.minecraft.core.BlockPos below = mc.player.blockPosition().below();
        if (mc.level.getBlockState(below).isAir()) {
            // Place block logic with rotations and tower
            if (rotations) {
                mc.player.setXRot(90);
            }
            timer.reset();
        }
    }`,
    'ESP': `
    @Override
    public void onRender() {
        Minecraft mc = Minecraft.getInstance();
        if (mc.player == null || mc.level == null) return;
        
        for (net.minecraft.world.entity.Entity entity : mc.level.entitiesForRendering()) {
            if (players && entity instanceof net.minecraft.world.entity.player.Player && entity != mc.player) {
                // Render ESP box with color
                // Implementation requires rendering context
            }
        }
    }`,
    'TargetHUD': `
    @Override
    public void onRender() {
        Minecraft mc = Minecraft.getInstance();
        if (mc.player == null) return;
        
        net.minecraft.world.entity.LivingEntity target = getClosestTarget();
        if (target != null && showHealth) {
            // Render target info with style (Nursultan, Celestial, etc)
            // Health bar, armor, distance display
        }
    }
    
    private net.minecraft.world.entity.LivingEntity getClosestTarget() {
        // Target selection logic
        return null;
    }`,
    'Blink': `
    private java.util.List<net.minecraft.network.protocol.Packet<?>> packets = new java.util.ArrayList<>();
    
    @Override
    public void onUpdate() {
        if (pulse && timer.hasTimeElapsed((long) delay)) {
            releasePackets();
            timer.reset();
        }
    }
    
    @Override
    public void onDisable() {
        releasePackets();
    }
    
    private void releasePackets() {
        for (net.minecraft.network.protocol.Packet<?> packet : packets) {
            Minecraft.getInstance().getConnection().send(packet);
        }
        packets.clear();
    }`,
    'Disabler': `
    @Override
    public void onEnable() {
        if (autoConfig) {
            // Auto-detect and configure for server anticheat
            configureForMode(mode);
        }
    }
    
    private void configureForMode(String mode) {
        // Apply specific bypass configurations
    }`,
    'TargetStrafe': `
    @Override
    public void onUpdate() {
        Minecraft mc = Minecraft.getInstance();
        net.minecraft.world.entity.LivingEntity target = getTarget();
        
        if (target != null) {
            double angle = Math.atan2(target.getZ() - mc.player.getZ(), target.getX() - mc.player.getX());
            double x = -Math.sin(angle) * radius;
            double z = Math.cos(angle) * radius;
            mc.player.setDeltaMovement(x, mc.player.getDeltaMovement().y, z);
            
            if (autoJump && mc.player.onGround()) {
                mc.player.jumpFromGround();
            }
        }
    }`
  };

  const implementation = implementations[className] || `
    @Override
    public void onUpdate() {
        Minecraft mc = Minecraft.getInstance();
        if (mc.player == null) return;
        
        // ${feature.name} implementation
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
