import type {CompiledAutocompleteSnippet} from './types';
import type {CompiledExample} from './types';
import type {CompiledExampleSnippet} from './types';
import type {Example} from './types';
import {Examples} from './documentation_config';
import {Snippets} from './documentation_config';
import * as fs from 'fs';
import path from 'path';

const CodeBegin = '// BEGIN\n';
const BaseDir = path.join(__dirname, '..');
const DocumentationRoot = path.join(BaseDir, 'documentation');
const TypeDocsRoot = path.join(BaseDir, 'docs');

function main() {
  compileAutocompleteSnippets();
  compileExamples();
}

function compileAutocompleteSnippets() {
  const compiledSnippets: CompiledAutocompleteSnippet[] = Snippets.map(snippet => {
    const code = getCodeFile(snippet.codeFile);
    return {
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
    const compiledExampleSnippets = compileExampleSnippets(example);
    if (!isValidReferencePath(example.referencePath)) {
      throw new Error(`${example.referencePath} is not a valid path`);
    }
    return {
      tokens: example.tokens,
      referencePath: example.referencePath,
      content,
      exampleSnippets: compiledExampleSnippets,
    };
  });

  fs.writeFileSync(path.join(DocumentationRoot, 'generated/examples.json'), JSON.stringify(compiledExamples, null, 2));
}

function getCodeFile(file: string) {
  const data = fs.readFileSync(path.join(DocumentationRoot, file), 'utf8');
  const codeStart = data.indexOf(CodeBegin) + CodeBegin.length;
  return data.substring(codeStart).trim();
}

function getContentFile(file: string) {
  return fs.readFileSync(path.join(DocumentationRoot, file), 'utf8').trim();
}

function compileExampleSnippets(example: Example): CompiledExampleSnippet[] {
  return example.exampleSnippets.map(exampleSnippet => {
    return {
      name: formatSnippetName(path.basename(exampleSnippet.codeFile)),
      content: exampleSnippet.content,
      code: getCodeFile(exampleSnippet.codeFile),
    };
  });
}

function formatSnippetName(baseName: string): string {
  const fileName = baseName.split('.')[0];
  const snippetNameArray = fileName.split('_');
  return snippetNameArray
    .map(segment => {
      return `${segment.charAt(0).toUpperCase()}${segment.slice(1)}`;
    })
    .join(' ');
}

function isValidReferencePath(referencePath: string): boolean {
  const splitPath = referencePath.split('#');
  const page = splitPath[0];
  const fragmentIdentifier = splitPath[1];

  const filePath = path.join(TypeDocsRoot, page);
  const fileContent = fs.readFileSync(filePath).toString();

  const searchTerm = `name="${fragmentIdentifier}"`;

  return fileContent.search(searchTerm) > -1;
}

main();
