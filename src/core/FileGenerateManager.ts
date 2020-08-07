import { getComponentVariables, getHOCVariables, getHookVariables } from '../utils';
import { FileService } from './FileService';
import { TemplateGenerator } from './TemplateGenerator';
import { HOCTemplate } from './temlpates/components/HOCTemplate';
import { ComponentTemplate } from './temlpates/components/ComponentTemplate';
import { ComponentTestTemplate } from './temlpates/components/ComponentTestTemplate';
import { HookTemplate } from './temlpates/components/HookTemplate';

export class FileGenerateManager {
  static generateHook(answers) {
    const variables = getHookVariables(answers);

    const fileService = new FileService(variables.fileName);
    const templateGenerator = new TemplateGenerator(variables);

    fileService.createDir();

    const jsTemplate = templateGenerator.generateTemplate(HookTemplate);
    fileService.genJs(jsTemplate);
  }

  static generateHOC(answers) {
    const variables = getHOCVariables(answers);

    const fileService = new FileService(variables.fileName);
    const templateGenerator = new TemplateGenerator(variables);

    fileService.createDir();

    const jsTemplate = templateGenerator.generateTemplate(HOCTemplate);
    fileService.genJs(jsTemplate);
  }

  static generateComponent(answers) {
    const variables = getComponentVariables(answers);

    const fileService = new FileService(variables.fileName);
    const templateGenerator = new TemplateGenerator(variables);

    fileService.createDir();

    const jsTemplate = templateGenerator.generateTemplate(ComponentTemplate);
    fileService.genJs(jsTemplate);

    if (variables.test) {
      const testTemplate = templateGenerator.generateTemplate(ComponentTestTemplate);
      fileService.genTest(testTemplate);
    }

    fileService.genStyle('');
  }
}