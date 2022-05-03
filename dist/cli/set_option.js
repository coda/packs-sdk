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
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSetOption = void 0;
const config_storage_1 = require("./config_storage");
const compile_1 = require("../testing/compile");
const __1 = require("..");
const path = __importStar(require("path"));
const helpers_1 = require("../testing/helpers");
const helpers_2 = require("../testing/helpers");
const config_storage_2 = require("./config_storage");
async function handleSetOption({ manifestFile, option, value }) {
    const manifestDir = path.dirname(manifestFile);
    const options = validateOption(option, value);
    (0, config_storage_2.storePackOptions)(manifestDir, options);
    (0, helpers_1.print)('Option stored successfully.');
}
exports.handleSetOption = handleSetOption;
function validateOption(option, value) {
    const validOptions = Object.values(config_storage_1.PackOptionKey);
    if (!validOptions.includes(option)) {
        return (0, helpers_2.printAndExit)(`Unsupported option "${option}". Value options are: ${validOptions.join(', ')}`);
    }
    const key = option;
    switch (key) {
        case config_storage_1.PackOptionKey.timerStrategy:
            const validValues = Object.values(compile_1.TimerShimStrategy);
            if (!validValues.includes(value)) {
                return (0, helpers_2.printAndExit)(`Invalid option value "${value}". Valid values are ${validValues.join(', ')}`);
            }
            return { [key]: value };
        default:
            return (0, __1.ensureUnreachable)(key);
    }
}
