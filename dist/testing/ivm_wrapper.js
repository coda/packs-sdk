"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tryGetIvm = exports.getIvm = void 0;
const ensure_1 = require("../helpers/ensure");
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
let ivm;
try {
    ivm = require('isolated-vm');
}
catch (e) {
    ivm = null;
}
function getIvm() {
    return (0, ensure_1.ensureExists)(ivm);
}
exports.getIvm = getIvm;
function tryGetIvm() {
    return ivm;
}
exports.tryGetIvm = tryGetIvm;
