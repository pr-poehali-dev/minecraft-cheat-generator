export const generateRotationUtil = (): string => {
  return `package com.client.utils;

import net.minecraft.client.Minecraft;
import net.minecraft.world.entity.Entity;
import net.minecraft.world.phys.Vec3;

public class RotationUtils {
    
    public static void faceEntity(Entity entity) {
        Minecraft mc = Minecraft.getInstance();
        if (mc.player == null) return;
        
        Vec3 playerPos = mc.player.getEyePosition();
        Vec3 targetPos = entity.getEyePosition();
        
        double deltaX = targetPos.x - playerPos.x;
        double deltaY = targetPos.y - playerPos.y;
        double deltaZ = targetPos.z - playerPos.z;
        
        double distance = Math.sqrt(deltaX * deltaX + deltaZ * deltaZ);
        
        float yaw = (float) (Math.atan2(deltaZ, deltaX) * 180.0 / Math.PI) - 90.0f;
        float pitch = (float) -(Math.atan2(deltaY, distance) * 180.0 / Math.PI);
        
        mc.player.setYRot(yaw);
        mc.player.setXRot(pitch);
    }
}`;
};

export const generateTimerUtil = (): string => {
  return `package com.client.utils;

public class TimerUtils {
    
    private long lastMS = System.currentTimeMillis();
    
    public void reset() {
        lastMS = System.currentTimeMillis();
    }
    
    public boolean hasTimeElapsed(long time) {
        return System.currentTimeMillis() - lastMS >= time;
    }
    
    public long getTime() {
        return System.currentTimeMillis() - lastMS;
    }
}`;
};
