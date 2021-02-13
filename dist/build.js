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
exports.compilePackBundleWebpack = void 0;
const path_1 = __importDefault(require("path"));
const webpack_1 = __importDefault(require("webpack"));
function compilePackBundleWebpack(bundleFilename, packDirectory, logger) {
    return __awaiter(this, void 0, void 0, function* () {
        const entrypoint = `${packDirectory}/manifest.ts`;
        const config = {
            devtool: 'source-map',
            entry: entrypoint,
            mode: 'development',
            module: {
                rules: [
                    {
                        test: /\.[tj]s$/,
                        use: {
                            loader: 'ts-loader',
                            options: {
                                transpileOnly: true,
                            },
                        },
                    },
                ],
            },
            name: 'PackBundle',
            node: false,
            output: {
                path: path_1.default.dirname(bundleFilename),
                filename: path_1.default.basename(bundleFilename),
                libraryTarget: 'commonjs2',
            },
            resolve: {
                extensions: ['.ts', '.js'],
            },
            target: 'async-node',
        };
        const compiler = webpack_1.default(config);
        return new Promise((resolve, reject) => {
            compiler.run((err, stats) => {
                if (err) {
                    logger.warn(err.stack || err.message || err.toString());
                    return reject(err);
                }
                return resolve(stats);
            });
        });
    });
}
exports.compilePackBundleWebpack = compilePackBundleWebpack;
