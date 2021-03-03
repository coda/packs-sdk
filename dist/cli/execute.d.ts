import type { Arguments } from 'yargs';
interface ExecuteArgs {
    manifestPath: string;
    formulaName: string;
    params: string[];
    fetch?: boolean;
    credentialsFile?: string;
}
export declare function handleExecute({ manifestPath, formulaName, params, fetch, credentialsFile, }: Arguments<ExecuteArgs>): Promise<void>;
export {};
