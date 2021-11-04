"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
const documentation_config_1 = require("./documentation_config");
const Handlebars = __importStar(require("handlebars"));
const documentation_config_2 = require("./documentation_config");
const types_2 = require("./types");
const fs = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
const CodeBegin = '// BEGIN\n';
const CodeEnd = '// END\n';
const BaseDir = path_1.default.join(__dirname, '..');
const DocumentationRoot = path_1.default.join(BaseDir, 'documentation');
const TypeDocsRoot = path_1.default.join(BaseDir, 'docs');
const EmbeddedSnippetsRoot = path_1.default.join(TypeDocsRoot, 'embedded-snippets');
const SnippetEmbedTemplate = fs.readFileSync(path_1.default.join(DocumentationRoot, 'snippet_embed_template.html'), 'utf8');
const ExampleDirName = 'samples';
const ExamplePagesRoot = path_1.default.join(TypeDocsRoot, ExampleDirName);
const ExamplePageTemplate = Handlebars.compile(fs.readFileSync(path_1.default.join(DocumentationRoot, 'example_page_template.md'), 'utf8'));
const SdkReferenceLink = 'https://coda.github.io/packs-sdk';
const SamplePageLink = `${SdkReferenceLink}/${ExampleDirName}`;
const PageFileExtension = 'md';
function main() {
    compileAutocompleteSnippets();
    compileExamples();
}
function compileAutocompleteSnippets() {
    const compiledSnippets = documentation_config_2.Snippets.map(snippet => {
        const code = getCodeFile(snippet.codeFile, true);
        compileSnippetEmbed(snippet.codeFile);
        return {
            triggerTokens: snippet.triggerTokens,
            content: snippet.content,
            code,
        };
    });
    fs.writeFileSync(path_1.default.join(DocumentationRoot, 'generated/snippets.json'), JSON.stringify(compiledSnippets, null, 2));
}
function compileExamples() {
    const compiledExamples = documentation_config_1.Examples.map(example => {
        const content = getContentFile(example.contentFile);
        const compiledExampleSnippets = compileExampleSnippets(example);
        let exampleFooterLink = example.linkData.url;
        if (example.linkData.type === types_2.UrlType.SdkReferencePath) {
            if (!isValidReferencePath(exampleFooterLink)) {
                throw new Error(`${exampleFooterLink} is not a valid path`);
            }
            exampleFooterLink = `${SdkReferenceLink}${exampleFooterLink}`;
        }
        else if (example.linkData.type === types_2.UrlType.SamplePage) {
            const pagePath = getExamplePagePath(example);
            const pageName = getExamplePageName(example).split('.')[0];
            exampleFooterLink = `${SamplePageLink}/${pagePath}/${pageName}`;
        }
        if (!exampleFooterLink) {
            throw new Error(`Missing link for example "${example.name}".`);
        }
        const compiledExample = {
            name: example.name,
            category: example.category,
            triggerTokens: example.triggerTokens,
            exampleFooterLink,
            content,
            exampleSnippets: compiledExampleSnippets,
        };
        compileExamplePage(example, compiledExample);
        return compiledExample;
    });
    fs.writeFileSync(path_1.default.join(DocumentationRoot, 'generated/examples.json'), JSON.stringify(compiledExamples, null, 2));
}
function getCodeFile(file, requireBegin = false) {
    const data = fs.readFileSync(path_1.default.join(DocumentationRoot, file), 'utf8');
    const begin = data.indexOf(CodeBegin);
    if (requireBegin && begin === -1) {
        throw new Error(`Missing "${CodeBegin.trim()}" in file: ${file}`);
    }
    const codeStart = begin >= 0 ? data.indexOf(CodeBegin) + CodeBegin.length : 0;
    const end = data.indexOf(CodeEnd);
    const codeEnd = end >= 0 ? end : data.length;
    return stripIndent(data.substring(codeStart, codeEnd)).trim();
}
function getContentFile(file) {
    return fs.readFileSync(path_1.default.join(DocumentationRoot, file), 'utf8').trim();
}
function compileExampleSnippets(example) {
    return example.exampleSnippets.map(exampleSnippet => {
        compileSnippetEmbed(exampleSnippet.codeFile);
        return {
            name: exampleSnippet.name,
            content: exampleSnippet.content,
            code: getCodeFile(exampleSnippet.codeFile),
        };
    });
}
function compileSnippetEmbed(codeFile) {
    // TODO: Escape the html. codeString is inserted into a JS script.
    const codeString = JSON.stringify(getCodeFile(codeFile));
    const exampleSnippetEmbed = SnippetEmbedTemplate.replace(/'{{CODE}}'/, codeString);
    const snippetDirPath = path_1.default.join(EmbeddedSnippetsRoot, path_1.default.dirname(codeFile));
    const snippetFileName = path_1.default.basename(codeFile).split('.')[0];
    if (!fs.existsSync(snippetDirPath)) {
        fs.mkdirSync(snippetDirPath, { recursive: true });
    }
    fs.writeFileSync(path_1.default.join(snippetDirPath, `${snippetFileName}.html`), exampleSnippetEmbed);
}
function compileExamplePage(example, compiledExample) {
    const examplePageContent = ExamplePageTemplate(compiledExample);
    const pageFileName = getExamplePageName(example);
    const pagePath = path_1.default.join(ExamplePagesRoot, getExamplePagePath(example));
    if (!fs.existsSync(pagePath)) {
        fs.mkdirSync(pagePath, { recursive: true });
    }
    fs.writeFileSync(path_1.default.join(pagePath, pageFileName), examplePageContent);
}
function getExamplePagePath(example) {
    return example.category.toString().toLowerCase();
}
function getExamplePageName(example) {
    return path_1.default.basename(path_1.default.dirname(example.contentFile)).replace(/_/g, '-') + '.md';
}
function isValidReferencePath(sdkReferencePath) {
    const splitPath = sdkReferencePath.split('#');
    const page = splitPath[0];
    const file = page + '.' + PageFileExtension;
    const filePath = path_1.default.join(TypeDocsRoot, file);
    return fs.existsSync(filePath);
}
/**
 * Un-indents text, removing the shortest common leading whitespace from each
 * line.
 * Code adapted from strip-indent (and min-indent). Can't use it directly since
 * it's an ES Module.
 * @param text The text to un-indent.
 * @returns The text with the minimum indent.
 */
function stripIndent(text) {
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
Handlebars.registerHelper('isTopic', (example) => {
    return example.category === types_1.ExampleCategory.Topic;
});
Handlebars.registerHelper('pageTitle', (example) => {
    let name = example.name;
    let suffix = 'sample';
    if (example.category === types_1.ExampleCategory.Topic) {
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
