import type { Arguments } from 'yargs';
export interface ExecuteArgs {
    manifestPath: string;
    formulaName: string;
    params: string[];
    fetch?: boolean;
    vm?: boolean;
    dynamicUrl?: string;
    timers: boolean;
}
export declare function handleExecute({ manifestPath, formulaName, params, fetch, vm, dynamicUrl, timers, }: Arguments<ExecuteArgs>): Promise<void>;
