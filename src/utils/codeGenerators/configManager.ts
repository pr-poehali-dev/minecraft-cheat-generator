export const generateConfigManager = (cheatName: string): string => {
  return `package com.client;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import java.io.*;
import java.nio.file.*;

public class ConfigManager {
    
    private static final Gson GSON = new GsonBuilder().setPrettyPrinting().create();
    private static final Path CONFIG_PATH = Paths.get("config/${cheatName.toLowerCase()}.json");
    
    public void saveConfig() {
        // TODO: Implement config saving
    }
    
    public void loadConfig() {
        // TODO: Implement config loading
    }
}`;
};
