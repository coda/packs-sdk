"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.currentSDKVersion = void 0;
const ensure_1 = require("./ensure");
const semver_1 = __importDefault(require("semver"));
const package_json_1 = require("../package.json");
// Since package.json isn't in dist, we grab it from the root directory instead.
function currentSDKVersion() {
    return (0, ensure_1.ensureExists)(semver_1.default.valid(package_json_1.version), 'SDK version appears invalid: ${version}');
}
exports.currentSDKVersion = currentSDKVersion;
