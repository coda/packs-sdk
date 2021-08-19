/// <reference types="node" />
import type { Authentication } from '../types';
import { Client } from '../helpers/external-api/coda';
import type { PackVersionDefinition } from '../types';
export declare function spawnProcess(command: string): import("child_process").SpawnSyncReturns<Buffer>;
export declare function createCodaClient(apiKey: string, protocolAndHost?: string): Client;
export declare function formatEndpoint(endpoint: string): string;
export declare function isTestCommand(): boolean;
export declare function makeManifestFullPath(manifestPath: string): string;
export declare function getPackAuth(packDef: PackVersionDefinition): Authentication | undefined;
export declare function importManifest(bundleFilename: string): Promise<PackVersionDefinition>;
