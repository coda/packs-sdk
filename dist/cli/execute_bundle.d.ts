import type { Arguments } from 'yargs';
import type { ExecuteArgs } from './execute';
declare type ExecuteBundleArgs = Omit<ExecuteArgs, 'manifestPath'> & {
    bundlePath: string;
};
export declare function handleExecuteBundle({ bundlePath, formulaName, params, fetch, credentialsFile, }: Arguments<ExecuteBundleArgs>): Promise<void>;
export {};
