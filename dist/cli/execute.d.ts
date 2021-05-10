import type { Arguments } from 'yargs';
export interface ExecuteArgs {
    manifestPath: string;
    formulaName: string;
    params: string[];
    fetch?: boolean;
    vm?: boolean;
}
export declare function handleExecute({ manifestPath, formulaName, params, fetch, vm }: Arguments<ExecuteArgs>): Promise<void>;
