import type {CompiledSnippet} from './types';
import {Snippets} from './documentation_config';
import * as fs from 'fs';
import path from 'path';

const codeBegin = '// BEGIN\n';
const BaseDir = path.join(__dirname, '..');
const DocumentationRoot = path.join(BaseDir, 'documentation');

function main() {
  const compiledSnippets: CompiledSnippet[] = Snippets.map(snippet => {
    const data = fs.readFileSync(path.join(DocumentationRoot, snippet.codeFile), 'utf8');
    const codeStart = data.indexOf(codeBegin) + codeBegin.length;
    const code = data.substring(codeStart).trim();

    return {
      name: snippet.name,
      triggerWords: snippet.triggerWords,
      content: snippet.content,
      code,
    };
  });

  fs.writeFileSync(path.join(DocumentationRoot, 'generated/snippets.json'), JSON.stringify(compiledSnippets, null, 2));
}

main();
