/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import type { PackVersionDefinition } from '../types';
import fs from 'fs';
export declare function getManifestFromModule(module: any): PackVersionDefinition;
export declare const print: {
    (...data: any[]): void;
    (message?: any, ...optionalParams: any[]): void;
};
export declare const printWarn: {
    (...data: any[]): void;
    (message?: any, ...optionalParams: any[]): void;
};
export declare const printError: {
    (...data: any[]): void;
    (message?: any, ...optionalParams: any[]): void;
};
export declare function printFull(value: any): void;
export declare function printAndExit(msg: string, exitCode?: number): never;
export declare function promptForInput(prompt: string, { mask, options, yesOrNo }?: {
    mask?: boolean;
    options?: string[];
    yesOrNo?: boolean;
}): string;
export declare function readFile(fileName: string): Buffer | undefined;
export declare function readJSONFile(fileName: string): any | undefined;
export declare function writeJSONFile(fileName: string, payload: any, mode?: fs.Mode): void;
export declare function getExpirationDate(expiresInSeconds: number): Date;
export declare function processVmError(vmError: Error, bundlePath: string): Promise<Error>;
/**
 * This function splits an array into chunks of a maximum size.
 *
 * @param array The flat list of values
 * @param size The maximum chunk size
 * @returns A list of chunks of the input array
 */
export declare function chunkArray<T>(array: T[], size: number): T[][];
