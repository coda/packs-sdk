"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
const fs = __importStar(require("fs"));
const glob_1 = __importDefault(require("glob"));
const path_1 = __importDefault(require("path"));
const helpers_1 = require("../testing/helpers");
const BaseDir = path_1.default.join(__dirname, '..');
const TypeDocsRoot = path_1.default.join(BaseDir, 'docs/reference/sdk');
const MarkdownPattern = path_1.default.join(TypeDocsRoot, '**/*.md');
// Extracts the name from "# Name", "# Type: Name", and
// "# Type: Name<Template Stuff>".
const TitleRegex = /^# (?:.+?\:\s*)?(.*?)(?:<.+>)?$/m;
async function main() {
    const files = glob_1.default.sync(MarkdownPattern, {});
    const promises = [];
    for (const file of files) {
        promises.push(process(file));
    }
    await Promise.all(promises);
}
async function process(file) {
    const buf = await fs.promises.readFile(file);
    let content = buf.toString();
    content = addFrontmatter(file, content);
    return fs.promises.writeFile(file, content);
}
/**
 * Adds frontmatter to generated markdown files, setting a simplified title to
 * use in the navigation. The frontmatter nav title is used in the nav.
 */
function addFrontmatter(file, content) {
    if (content.startsWith('---\n')) {
        (0, helpers_1.print)(`Already has frontmatter: ${file}`);
        return content;
    }
    const match = content.match(TitleRegex);
    if (!match) {
        (0, helpers_1.print)(`Title not found: ${file}`);
        return content;
    }
    const title = match[1];
    const frontmatter = `---\nnav: "${title}"\n---\n`;
    return frontmatter + content;
}
main().catch(helpers_1.print);
