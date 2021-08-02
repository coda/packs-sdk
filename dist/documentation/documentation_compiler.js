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
const codeBegin = '// BEGIN\n';
const BaseDir = path_1.default.join(__dirname, '..');
const DocumentationRoot = path_1.default.join(BaseDir, 'documentation');
function main() {
    compileSnippets();
    compileExamples();
}
function compileSnippets() {
    const compiledSnippets = documentation_config_2.Snippets.map(snippet => {
        const code = getCodeFile(snippet.codeFile);
        return {
            name: snippet.name,
            triggerWords: snippet.triggerWords,
            content: snippet.content,
            code,
        };
    });
    fs.writeFileSync(path_1.default.join(DocumentationRoot, 'generated/snippets.json'), JSON.stringify(compiledSnippets, null, 2));
}
function compileExamples() {
    const compiledExamples = documentation_config_1.Examples.map(example => {
        const content = getContentFile(example.contentFile);
        const code = compileCodeFiles(example);
        return {
            content,
            code,
            categories: example.categories,
            triggerWords: example.triggerWords,
        };
    });
    fs.writeFileSync(path_1.default.join(DocumentationRoot, 'generated/examples.json'), JSON.stringify(compiledExamples, null, 2));
}
function getContentFile(file) {
    return fs.readFileSync(path_1.default.join(DocumentationRoot, file), 'utf8').trim();
}
function compileCodeFiles(example) {
    const code = example.codeFiles.map(codeFile => {
        return getCodeFile(codeFile);
    });
    return code;
}
function getCodeFile(file) {
    const data = fs.readFileSync(path_1.default.join(DocumentationRoot, file), 'utf8');
    const codeStart = data.indexOf(codeBegin) + codeBegin.length;
    return data.substring(codeStart).trim();
}
main();
