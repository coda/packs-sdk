/// <reference types="node" />
import type { Authentication } from '../types';
<<<<<<< HEAD
import type { BasicPackDefinition } from '../types';
import { Client } from '../helpers/external-api/coda';
=======
import { Client } from '../helpers/external-api/coda';
import type { PackVersionDefinition } from '../types';
>>>>>>> 70ee3ea0 (make build again)
export declare function spawnProcess(command: string): import("child_process").SpawnSyncReturns<Buffer>;
export declare function createCodaClient(apiToken: string, protocolAndHost?: string): Client;
export declare function formatEndpoint(endpoint: string): string;
export declare function isTestCommand(): boolean;
export declare function makeManifestFullPath(manifestPath: string): string;
<<<<<<< HEAD
export declare function getPackAuth(packDef: BasicPackDefinition): Authentication | undefined;
export declare function importManifest<T extends BasicPackDefinition = BasicPackDefinition>(bundleFilename: string): Promise<T>;
=======
export declare function getPackAuth(packDef: PackVersionDefinition): Authentication | undefined;
export declare function importManifest(bundleFilename: string): Promise<PackVersionDefinition>;
>>>>>>> 70ee3ea0 (make build again)
