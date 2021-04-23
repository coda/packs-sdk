/// <reference types="node" />
import { Client } from '../helpers/external-api/coda';
export declare function spawnProcess(command: string): import("child_process").SpawnSyncReturns<Buffer>;
export declare function createCodaClient(apiKey: string, protocolAndHost?: string): Client;
export declare function formatEndpoint(endpoint: string): string;
export declare function isTestCommand(): boolean;
export declare function makeManifestFullPath(manifestPath: string): string;
export declare function isTypescript(path: string): boolean;
export declare function escapeShellArg(arg: string): string;
export declare function spawnBootstrapCommand(command: string): void;
