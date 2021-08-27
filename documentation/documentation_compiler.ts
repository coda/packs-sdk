import type {CompiledAutocompleteSnippet} from './types';
import type {CompiledExample} from './types';
import type {CompiledExampleSnippet} from './types';
import type {Example} from './types';
import {Examples} from './documentation_config';
import {Snippets} from './documentation_config';
import {UrlType} from './types';
import * as fs from 'fs';
import path from 'path';

const CodeBegin = '// BEGIN\n';
const BaseDir = path.join(__dirname, '..');
const DocumentationRoot = path.join(BaseDir, 'documentation');
const TypeDocsRoot = path.join(BaseDir, 'docs');
const EmbeddedSnippetsRoot = path.join(TypeDocsRoot, 'embedded-snippets');
const SnippetEmbedTemplate = fs.readFileSync(path.join(DocumentationRoot, 'snippet_embed_template.html'), 'utf8');
const SdkReferenceLink = 'https://coda.github.io/packs-sdk';

function main() {
  compileAutocompleteSnippets();
  compileExamples();
}

function compileAutocompleteSnippets() {
  const compiledSnippets: CompiledAutocompleteSnippet[] = Snippets.map(snippet => {
    const code = getCodeFile(snippet.codeFile);
    compileSnippetEmbed(snippet.codeFile);
    return {
      triggerTokens: snippet.triggerTokens,
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
    let exampleFooterLink = example.linkData.url;
    if (example.linkData.type === UrlType.SdkReferencePath) {
      if (!isValidReferencePath(exampleFooterLink)) {
        throw new Error(`${exampleFooterLink} is not a valid path`);
      }
      exampleFooterLink = `${SdkReferenceLink}${exampleFooterLink}`;
    }
    return {
      name: example.name,
      triggerTokens: example.triggerTokens,
      exampleFooterLink,
      content,
      exampleSnippets: compiledExampleSnippets,
    };
  });

  fs.writeFileSync(path.join(DocumentationRoot, 'generated/examples.json'), JSON.stringify(compiledExamples, null, 2));
}

function getCodeFile(file: string): string {
  const data = fs.readFileSync(path.join(DocumentationRoot, file), 'utf8');
  const codeStart = data.indexOf(CodeBegin) + CodeBegin.length;
  return data.substring(codeStart).trim();
}

function getContentFile(file: string) {
  return fs.readFileSync(path.join(DocumentationRoot, file), 'utf8').trim();
}

function compileExampleSnippets(example: Example): CompiledExampleSnippet[] {
  return example.exampleSnippets.map(exampleSnippet => {
    compileSnippetEmbed(exampleSnippet.codeFile);
    return {
      name: exampleSnippet.name,
      content: exampleSnippet.content,
      code: getCodeFile(exampleSnippet.codeFile),
    };
  });
}

function compileSnippetEmbed(codeFile: string) {
  // TODO: Escape the html. codeString is inserted into a JS script.
  const codeString = JSON.stringify(getCodeFile(codeFile));
  const exampleSnippetEmbed = SnippetEmbedTemplate.replace(/'{{CODE}}'/, codeString);
  const snippetFileName = path.basename(codeFile).split('.')[0];

  if (!fs.existsSync(EmbeddedSnippetsRoot)) {
    fs.mkdirSync(EmbeddedSnippetsRoot);
  }

  fs.writeFileSync(path.join(EmbeddedSnippetsRoot, `${snippetFileName}.html`), exampleSnippetEmbed);
}

function isValidReferencePath(sdkReferencePath: string): boolean {
  const splitPath = sdkReferencePath.split('#');
  const page = splitPath[0];

  const filePath = path.join(TypeDocsRoot, page);

  return fs.existsSync(filePath);
}

main();
