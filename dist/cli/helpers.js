"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.spawnProcess = void 0;
const child_process_1 = require("child_process");
function spawnProcess(command) {
    return child_process_1.spawnSync(command, {
        shell: true,
        stdio: 'inherit',
    });
}
exports.spawnProcess = spawnProcess;
