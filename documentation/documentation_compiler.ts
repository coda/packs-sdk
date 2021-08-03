import type {CompiledExample} from './types';
import type {CompiledSnippet} from './types';
import type {Example} from './types';
import {Examples} from './documentation_config';
import {Snippets} from './documentation_config';
import * as fs from 'fs';
import path from 'path';

const codeBegin = '// BEGIN\n';
const BaseDir = path.join(__dirname, '..');
const DocumentationRoot = path.join(BaseDir, 'documentation');

function main() {
  compileSnippets();
  compileExamples();
}

function compileSnippets() {
  const compiledSnippets: CompiledSnippet[] = Snippets.map(snippet => {
    const code = getCodeFile(snippet.codeFile);
    return {
      name: snippet.name,
      triggerWords: snippet.triggerWords,
      content: snippet.content,
      code,
    };
  });

  fs.writeFileSync(path.join(DocumentationRoot, 'generated/snippets.json'), JSON.stringify(compiledSnippets, null, 2));
}

function compileExamples() {
  const compiledExamples: CompiledExample[] = Examples.map(example => {
    const content = getContentFile(example.contentFile);
    const code = compileCodeFiles(example);
    return {
      content,
      code,
      categories: example.categories,
      triggerTokens: example.triggerTokens,
    };
  });
  fs.writeFileSync(path.join(DocumentationRoot, 'generated/examples.json'), JSON.stringify(compiledExamples, null, 2));
}

function getContentFile(file: string) {
  return fs.readFileSync(path.join(DocumentationRoot, file), 'utf8').trim();
}

function compileCodeFiles(example: Example) {
  const code = example.codeFiles.map(codeFile => {
    return getCodeFile(codeFile);
  });
  return code;
}

function getCodeFile(file: string) {
  const data = fs.readFileSync(path.join(DocumentationRoot, file), 'utf8');
  const codeStart = data.indexOf(codeBegin) + codeBegin.length;
  return data.substring(codeStart).trim();
}

main();
