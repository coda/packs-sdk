"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.spawnProcess = void 0;
const child_process_1 = require("child_process");
function spawnProcess(command) {
    let cmd = command;
    // Hack to allow us to run this CLI tool for testing purposes from within this repo, without
    // needing it installed as an npm package.
    if (process.argv[1].endsWith('coda.ts')) {
        cmd = command.replace('coda-packs-sdk/dist', process.env.PWD);
    }
    return child_process_1.spawnSync(cmd, {
        shell: true,
        stdio: 'inherit',
    });
}
exports.spawnProcess = spawnProcess;
