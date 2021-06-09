/// <reference types="node" />
import type { PackVersionDefinition } from '../types';
export declare function getManifestFromModule(module: any): PackVersionDefinition;
export declare const print: {
    (...data: any[]): void;
    (message?: any, ...optionalParams: any[]): void;
};
export declare function printAndExit(msg: string, exitCode?: number): never;
export declare function promptForInput(prompt: string, { mask }?: {
    mask?: boolean;
}): string;
export declare function readFile(fileName: string): Buffer | undefined;
export declare function readJSONFile(fileName: string): any | undefined;
export declare function writeJSONFile(fileName: string, payload: any): void;
export declare function getExpirationDate(expiresInSeconds: number): Date;
