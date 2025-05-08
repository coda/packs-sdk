"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleExtensions = exports.Tools = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const helpers_1 = require("./helpers");
const path_1 = __importDefault(require("path"));
const helpers_2 = require("../testing/helpers");
const helpers_3 = require("../testing/helpers");
var Tools;
(function (Tools) {
    Tools["VSCode"] = "vscode";
})(Tools || (exports.Tools = Tools = {}));
async function handleExtensions(args) {
    const { tools } = args;
    for (const tool of tools) {
        switch (tool) {
            case Tools.VSCode:
                installVSCodeExtensions();
                (0, helpers_2.print)('Installed Visual Studio Code extensions.');
                break;
            default:
                (0, helpers_3.printAndExit)(`Unsupported tool: ${tool}`);
        }
    }
}
exports.handleExtensions = handleExtensions;
function installVSCodeExtensions() {
    const vsCodeDir = path_1.default.join(process.cwd(), '.vscode');
    if (!fs_extra_1.default.existsSync(vsCodeDir)) {
        fs_extra_1.default.mkdirSync(vsCodeDir);
    }
    const pathToRoot = (0, helpers_1.isTestCommand)() ? '../' : '../../';
    const filename = 'pack.code-snippets';
    fs_extra_1.default.copySync(path_1.default.join(__dirname, pathToRoot, 'documentation/generated', filename), path_1.default.join(vsCodeDir, filename));
}
