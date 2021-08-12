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
const documentation_config_1 = require("./documentation_config");
const documentation_config_2 = require("./documentation_config");
const fs = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
const CodeBegin = '// BEGIN\n';
const BaseDir = path_1.default.join(__dirname, '..');
const DocumentationRoot = path_1.default.join(BaseDir, 'documentation');
const TypeDocsRoot = path_1.default.join(BaseDir, 'docs');
function main() {
    compileAutocompleteSnippets();
    compileExamples();
}
function compileAutocompleteSnippets() {
    const compiledSnippets = documentation_config_2.Snippets.map(snippet => {
        const code = getCodeFile(snippet.codeFile);
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
        if (!isValidReferencePath(example.sdkReferencePath)) {
            throw new Error(`${example.sdkReferencePath} is not a valid path`);
        }
        return {
            name: example.name,
            triggerTokens: example.triggerTokens,
            sdkReferencePath: example.sdkReferencePath,
            content,
            exampleSnippets: compiledExampleSnippets,
        };
    });
    fs.writeFileSync(path_1.default.join(DocumentationRoot, 'generated/examples.json'), JSON.stringify(compiledExamples, null, 2));
}
function getCodeFile(file) {
    const data = fs.readFileSync(path_1.default.join(DocumentationRoot, file), 'utf8');
    const codeStart = data.indexOf(CodeBegin) + CodeBegin.length;
    return data.substring(codeStart).trim();
}
function getContentFile(file) {
    return fs.readFileSync(path_1.default.join(DocumentationRoot, file), 'utf8').trim();
}
function compileExampleSnippets(example) {
    return example.exampleSnippets.map(exampleSnippet => {
        return {
            name: exampleSnippet.name,
            content: exampleSnippet.content,
            code: getCodeFile(exampleSnippet.codeFile),
        };
    });
}
function isValidReferencePath(sdkReferencePath) {
    const splitPath = sdkReferencePath.split('#');
    const page = splitPath[0];
    const filePath = path_1.default.join(TypeDocsRoot, page);
    return fs.existsSync(filePath);
}
main();
