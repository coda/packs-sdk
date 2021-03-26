import type { Arguments } from 'yargs';
export interface ExecuteArgs {
    manifestPath: string;
    formulaName: string;
    params: string[];
    fetch?: boolean;
    vm?: boolean;
    credentialsFile?: string;
}
export declare function handleExecute({ manifestPath, formulaName, params, fetch, credentialsFile, vm, }: Arguments<ExecuteArgs>): Promise<void>;
