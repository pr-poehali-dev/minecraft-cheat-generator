import JSZip from 'jszip';
import { toast } from 'sonner';
import { CheatFeature } from '@/types/cheat';
import { generateMainClass } from './codeGenerators/mainClass';
import { generateModuleManager } from './codeGenerators/moduleManager';
import { generateEventManager } from './codeGenerators/eventManager';
import { generateClickGUI } from './codeGenerators/clickGUI';
import { generateConfigManager } from './codeGenerators/configManager';
import { generateModuleCode } from './codeGenerators/moduleCode';
import { generateRotationUtil, generateTimerUtil } from './codeGenerators/utilities';
import { generateBuildGradle, generateModInfo } from './codeGenerators/buildFiles';
import { generateReadme } from './codeGenerators/readme';

export const handleDownload = async (cheatName: string, currentCheat: CheatFeature[]) => {
  if (currentCheat.length === 0) {
    toast.error('Сначала создай чит в чате!');
    return;
  }

  toast.info('Генерирую профессиональный чит-клиент...');

  const zip = new JSZip();

  const mainCode = generateMainClass(cheatName);
  zip.file(`src/main/java/com/client/${cheatName}.java`, mainCode);

  const moduleManager = generateModuleManager(cheatName, currentCheat);
  zip.file(`src/main/java/com/client/ModuleManager.java`, moduleManager);

  const eventManager = generateEventManager(cheatName);
  zip.file(`src/main/java/com/client/EventManager.java`, eventManager);

  const clickGui = generateClickGUI(cheatName);
  zip.file(`src/main/java/com/client/gui/ClickGUI.java`, clickGui);

  const configManager = generateConfigManager(cheatName);
  zip.file(`src/main/java/com/client/ConfigManager.java`, configManager);

  currentCheat.forEach(feature => {
    const moduleCode = generateModuleCode(feature);
    const moduleName = feature.name.replace(/[^a-zA-Z]/g, '');
    zip.file(`src/main/java/com/client/modules/${feature.category.toLowerCase()}/${moduleName}.java`, moduleCode);
  });

  const rotationUtil = generateRotationUtil();
  zip.file(`src/main/java/com/client/utils/RotationUtils.java`, rotationUtil);

  const timerUtil = generateTimerUtil();
  zip.file(`src/main/java/com/client/utils/TimerUtils.java`, timerUtil);

  const buildGradle = generateBuildGradle(cheatName);
  zip.file('build.gradle', buildGradle);

  const modInfo = generateModInfo(cheatName);
  zip.file('src/main/resources/META-INF/mods.toml', modInfo);

  const readme = generateReadme(cheatName, currentCheat);
  zip.file('README.md', readme);

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${cheatName}_Source.zip`;
  a.click();
  URL.revokeObjectURL(url);

  toast.success(`${cheatName} скачан! Внутри полный исходник с GUI`);
};
