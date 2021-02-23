"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlePublish = void 0;
const build_1 = require("./build");
const path_1 = __importDefault(require("path"));
const helpers_1 = require("./helpers");
function handlePublish({ manifestFile }) {
    return __awaiter(this, void 0, void 0, function* () {
        const bundleFile = yield build_1.build(manifestFile);
        bundleFile;
        const packsSDKVersion = helpers_1.spawnProcess(`cd ${path_1.default.dirname(manifestFile)} && npm -v coda-packs-sdk`);
        packsSDKVersion;
        // TODO(alan): when the storage work is complete, upload the file located at bundleFile
        // to hit the /publish API.
    });
}
exports.handlePublish = handlePublish;
