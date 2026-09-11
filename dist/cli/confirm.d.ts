export declare function isInteractive(): boolean;
export declare function confirmOrFail({ yes, prompt, example, interactive, }: {
    yes?: boolean;
    prompt: string;
    example: string;
    interactive?: boolean;
}): void;
export declare function missingFlagError(message: string, example: string, extra?: string): never;
