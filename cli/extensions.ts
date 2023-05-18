import type { ArgumentsCamelCase } from 'yargs';
import fs from 'fs-extra';
import {isTestCommand} from './helpers';
import path from 'path';
import {print} from '../testing/helpers';
import { printAndExit } from '../testing/helpers';

export enum Tools {
  VSCode = 'vscode',
}

interface ExtensionsArgs {
  tools: Tools[];
}

export async function handleExtensions(args: ArgumentsCamelCase<ExtensionsArgs>) {
  const {tools} = args;
  for (const tool of tools) {
    switch(tool) {
      case Tools.VSCode:
        installVSCodeExtensions();
        print('Installed Visual Studio Code extensions.');
        break;
      default:
        printAndExit(`Unsupported tool: ${tool}`);
    }
  }
}

function installVSCodeExtensions() {
  const vsCodeDir = path.join(process.cwd(), '.vscode');
  if (!fs.existsSync(vsCodeDir)){
    fs.mkdirSync(vsCodeDir);
  }
  const pathToRoot = isTestCommand() ? '../' : '../../';
  const filename = 'pack.code-snippets';
  fs.copySync(path.join(__dirname, pathToRoot, 'documentation/generated', filename), path.join(vsCodeDir, filename));
}
