import type {CompiledAutocompleteSnippet} from '../types';
import type {CompiledExample} from '../types';
import type {CompiledExampleSnippet} from '../types';
import type {Example} from '../types';
import {ExampleCategory} from '../types';
import {ExampleStatus} from '../types';
import {Examples} from './documentation_config';
import * as Handlebars from 'handlebars';
import {Snippets} from './documentation_config';
import {UrlType} from '../types';
import type {VSCodeSnippet} from '../types';
import type {VSCodeSnippets} from '../types';
import * as fs from 'fs';
import path from 'path';

const CodeBegin = '// BEGIN\n';
const CodeEnd = '// END\n';
const BaseDir = path.join(__dirname, '../../');
const DocumentationRoot = path.join(BaseDir, 'documentation');
const TypeDocsRoot = path.join(BaseDir, 'docs');
const EmbeddedSnippetsRoot = path.join(TypeDocsRoot, 'embedded-snippets');
const SnippetEmbedTemplate = fs.readFileSync(path.join(DocumentationRoot, 'snippet_embed_template.html'), 'utf8');
const ExampleDirName = 'samples';
const ExamplePagesRoot = path.join(TypeDocsRoot, ExampleDirName);
const ExamplePageTemplate = Handlebars.compile(
  fs.readFileSync(path.join(DocumentationRoot, 'example_page_template.md'), 'utf8'),
);
const SdkReferenceLink = 'https://coda.io/packs/build/latest';
const SamplePageLink = `${SdkReferenceLink}/${ExampleDirName}`;
const PageFileExtension = 'md';
const IndexPageFilename = 'index.md';

function main() {
  compileAutocompleteSnippets();
  compileExamples();
}

function compileAutocompleteSnippets() {
  const compiledSnippets: CompiledAutocompleteSnippet[] = Snippets.map(snippet => {
    const code = getCodeFile(snippet.codeFile, true);
    compileSnippetEmbed(snippet.codeFile);
    return {
      triggerTokens: snippet.triggerTokens,
      content: snippet.content,
      code: formatCodeSnippet(code),
    };
  });

  compileVSCodeSnippets(compiledSnippets);
  fs.writeFileSync(path.join(DocumentationRoot, 'generated/snippets.json'), JSON.stringify(compiledSnippets, null, 2));
}

function compileVSCodeSnippets(compiledSnippets: CompiledAutocompleteSnippet[]) {
  const vsCodeSnippets: VSCodeSnippets = {};
  for (const snippet of compiledSnippets) {
    const trigger = snippet.triggerTokens[0];
    const vsCodeSnippet: VSCodeSnippet = {
      prefix: `/${trigger}`,
      description: snippet.content,
      body: snippet.code,
      scope: 'javascript,typescript',
    };
    vsCodeSnippets[trigger] = vsCodeSnippet;
  }
  fs.writeFileSync(path.join(DocumentationRoot, 'generated/pack.code-snippets'), JSON.stringify(vsCodeSnippets, null, 2));
}

function compileExamples() {
  const compiledExamples: CompiledExample[] = Examples.map(example => {
    const content = getContentFile(example.contentFile);
    const compiledExampleSnippets = compileExampleSnippets(example);
    let exampleFooterLink = example.linkData.url;
    let learnMoreLink: string | undefined;
    if (example.linkData.type === UrlType.SdkReferencePath) {
      if (!isValidReferencePath(exampleFooterLink!)) {
        throw new Error(`${exampleFooterLink} is not a valid path`);
      }
      exampleFooterLink = `${SdkReferenceLink}${exampleFooterLink}`;
      learnMoreLink = example.linkData.url;
    } else if (example.linkData.type === UrlType.SamplePage) {
      const pagePath = getExamplePagePath(example);
      const pageName = getExamplePageName(example).split('.')[0];
      exampleFooterLink = `${SamplePageLink}/${pagePath}/${pageName}`;
    }
    if (!exampleFooterLink) {
      throw new Error(`Missing link for example "${example.name}".`);
    }
    const compiledExample = {
      name: example.name,
      description: example.description,
      icon: example.icon,
      category: example.category,
      triggerTokens: example.triggerTokens,
      linkData: example.linkData,
      status: example.status,
      exampleFooterLink,
      learnMoreLink,
      content,
      exampleSnippets: compiledExampleSnippets,
    };
    compileExamplePage(example, compiledExample);
    return compiledExample;
  });

  fs.writeFileSync(path.join(DocumentationRoot, 'generated/examples.json'), JSON.stringify(compiledExamples, null, 2));
}

function getCodeFile(file: string, requireBegin = false): string {
  const data = fs.readFileSync(path.join(DocumentationRoot, file), 'utf8');
  const begin = data.indexOf(CodeBegin);
  if (requireBegin && begin === -1) {
    throw new Error(`Missing "${CodeBegin.trim()}" in file: ${file}`);
  }
  const codeStart = begin >= 0 ? data.indexOf(CodeBegin) + CodeBegin.length : 0;
  const end = data.indexOf(CodeEnd);
  const codeEnd = end >= 0 ? end : data.length;
  return stripIndent(data.substring(codeStart, codeEnd)).trim();
}

function getContentFile(file: string) {
  return fs.readFileSync(path.join(DocumentationRoot, file), 'utf8').trim();
}

function compileExampleSnippets(example: Example): CompiledExampleSnippet[] {
  return example.exampleSnippets.map(exampleSnippet => {
    const code = getCodeFile(exampleSnippet.codeFile);
    compileSnippetEmbed(exampleSnippet.codeFile);
    return {
      name: exampleSnippet.name,
      content: exampleSnippet.content,
      code: formatCodeSnippet(code, true),
      status: exampleSnippet.status,
    };
  });
}

function compileSnippetEmbed(codeFile: string) {
  // TODO: Escape the html. codeString is inserted into a JS script.
  const codeString = JSON.stringify(getCodeFile(codeFile));
  const exampleSnippetEmbed = SnippetEmbedTemplate.replace(/'{{CODE}}'/, codeString);
  const snippetDirPath = path.join(EmbeddedSnippetsRoot, path.dirname(codeFile));
  const snippetFileName = path.basename(codeFile).split('.')[0];

  if (!fs.existsSync(snippetDirPath)) {
    fs.mkdirSync(snippetDirPath, {recursive: true});
  }

  fs.writeFileSync(path.join(snippetDirPath, `${snippetFileName}.html`), exampleSnippetEmbed);
}

/**
 * Formats the code in a snippet, primarily to handle alternate placeholder formats. The placeholder
 * syntax supported by Monaco is `${1:Placeholder}`, which works fine in strings but isn't a valid
 * variable name or object key in TypeScript. To work around that we define alternate placeholder
 * formats that are also valid identifiers:
 * - `$1$Placeholder$` for variables and object keys.
 * - `[$0]` for placing a tab stop after an enum, prompting the user to select a value.
 * - `// $1` For placing a tab stop on a blank line.
 * - `// ${1:Foo}` for creating a placeholder which is a comment.
 * When displaying snippets in the documentation the placeholder syntax may be confusing, so the
 * `removePlaceholders` option allows replacing the placeholders with the default value.
 * @param code The code to format.
 * @param removePlaceholders Whether to replace the placeholders with the default value.
 * @returns The formatted code.
 */
function formatCodeSnippet(code: string, removePlaceholders=false) {
  let result = code
    // Replace brackets around a placeholder with a leading dot.
    // Ex: '[$0]' => '.$0' and '[${0:foo}]' => '.${0:foo}'
    .replace(/\[\$(.*?)\]/g, '.$$$1')
    // Replace custom placeholder syntax with the real syntax.
    // Ex: '$1$Foo$' => '${1:Foo}'
    .replace(/\$(\d+)\$(.+?)\$/g, '${$1:$2}')
    // Remove the comments around tab stops.
    // Ex: '// $1' => '$1'
    .replace(/\/\/\s*\$(\d+)/g, '$$$1')
    // Invert the comments around placeholders.
    // Ex: '// ${1:Foo}' => '${1:// Foo}'
    .replace(/\/\/\s*\$\{(\d+)\:(.+?)\}/g, '${$1:// $2}');
  if (removePlaceholders) {
    result = result
      // Replace placeholder syntax with default value.
      // Ex: '${1:Foo}' => 'Foo'
      .replace(/\$\{\d+\:(.*?)\}/g, '$1');
  }
  return result;
}

function compileExamplePage(example: Example, compiledExample: CompiledExample) {
  const examplePageContent = ExamplePageTemplate(compiledExample);
  const pageFileName = getExamplePageName(example);
  const pagePath = path.join(ExamplePagesRoot, getExamplePagePath(example));

  if (!fs.existsSync(pagePath)) {
    fs.mkdirSync(pagePath, {recursive: true});
  }

  fs.writeFileSync(path.join(pagePath, pageFileName), examplePageContent);
}

function getExamplePagePath(example: Example) {
  return example.category.toString().toLowerCase();
}

function getExamplePageName(example: Example) {
  return path.basename(path.dirname(example.contentFile)).replace(/_/g, '-') + '.md';
}

function isValidReferencePath(sdkReferencePath: string): boolean {
  const splitPath = sdkReferencePath.split('#');
  const page = splitPath[0];

  const file = page + '.' + PageFileExtension;
  const filePath = path.join(TypeDocsRoot, file);
  const fileExists = fs.existsSync(filePath);
  if (fileExists) {
    return true;
  }

  // Check if there is an index file in a directory.
  const indexFile = path.join(page, IndexPageFilename);
  const indexFilePath = path.join(TypeDocsRoot, indexFile);
  return fs.existsSync(indexFilePath);
}


/**
 * Un-indents text, removing the shortest common leading whitespace from each
 * line.
 * Code adapted from strip-indent (and min-indent). Can't use it directly since
 * it's an ES Module.
 * @param text The text to un-indent.
 * @returns The text with the minimum indent.
 */
function stripIndent(text: string) {
  const match = text.match(/^[ ]*(?=\S)/gm);
  if (!match) {
    // No indents found, return the original string.
    return text;
  }
  const minIndent = match.reduce((r, a) => Math.min(r, a.length), Infinity);
  const regex = new RegExp(`^[ \\t]{${minIndent}}`, 'gm');
  return text.replace(regex, '');
}

Handlebars.registerHelper('indent', (content, numSpaces) => {
  const indent = ' '.repeat(numSpaces);
  return content.replace(/\n(?!\n)/g, '\n' + indent);
});

Handlebars.registerHelper('isTopic', (example: CompiledExample) => {
  return example.category === ExampleCategory.Topic;
});

Handlebars.registerHelper('isBeta', (example: CompiledExample|CompiledExampleSnippet ) => {
  return example.status === ExampleStatus.Beta;
});

Handlebars.registerHelper('pageTitle', (example: CompiledExample) => {
  let name = example.name;
  let suffix = 'sample';
  if (example.category === ExampleCategory.Topic) {
    // Use singular version of the name.
    name = name.replace(/s$/, '');
    if (example.exampleSnippets.length > 1) {
      // Use the suffix "samples" if there are more than one.
      suffix += 's';
    }
  }
  return `${name} ${suffix}`;
});

main();
