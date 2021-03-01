"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApiKey = exports.spawnProcess = void 0;
const auth_1 = require("../testing/auth");
const child_process_1 = require("child_process");
function spawnProcess(command) {
    return child_process_1.spawnSync(command, {
        shell: true,
        stdio: 'inherit',
    });
}
exports.spawnProcess = spawnProcess;
function getApiKey() {
    var _a;
    const credentials = auth_1.readCredentialsFile();
    return (_a = credentials === null || credentials === void 0 ? void 0 : credentials.__coda__) === null || _a === void 0 ? void 0 : _a.apiKey;
}
exports.getApiKey = getApiKey;
