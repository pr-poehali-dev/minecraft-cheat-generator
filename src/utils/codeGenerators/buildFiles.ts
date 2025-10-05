export const generateBuildGradle = (cheatName: string): string => {
  return `buildscript {
    repositories {
        maven { url = 'https://maven.minecraftforge.net' }
        mavenCentral()
    }
    dependencies {
        classpath 'net.minecraftforge.gradle:ForgeGradle:5.1.+'
    }
}

apply plugin: 'net.minecraftforge.gradle'
apply plugin: 'java'

version = '1.0.0'
group = 'com.client'
archivesBaseName = '${cheatName}'

java.toolchain.languageVersion = JavaLanguageVersion.of(17)

minecraft {
    mappings channel: 'official', version: '1.19.2'
    
    runs {
        client {
            workingDirectory project.file('run')
            property 'forge.logging.console.level', 'info'
            mods {
                ${cheatName.toLowerCase()} {
                    source sourceSets.main
                }
            }
        }
    }
}

dependencies {
    minecraft 'net.minecraftforge:forge:1.19.2-43.2.0'
    implementation 'com.google.code.gson:gson:2.10.1'
}

jar {
    manifest {
        attributes([
            "Specification-Title": "${cheatName}",
            "Implementation-Title": "${cheatName}",
            "Implementation-Version": "1.0.0"
        ])
    }
}`;
};

export const generateModInfo = (cheatName: string): string => {
  return `modLoader="javafml"
loaderVersion="[43,)"

[[mods]]
modId="${cheatName.toLowerCase()}"
version="1.0.0"
displayName="${cheatName}"
description="Professional Minecraft cheat client"
authors="CheatGen AI"

[[dependencies.${cheatName.toLowerCase()}]]
    modId="forge"
    mandatory=true
    versionRange="[43,)"
    ordering="NONE"
    side="CLIENT"

[[dependencies.${cheatName.toLowerCase()}]]
    modId="minecraft"
    mandatory=true
    versionRange="[1.19.2]"
    ordering="NONE"
    side="CLIENT"`;
};
