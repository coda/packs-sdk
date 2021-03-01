import type { Arguments } from 'yargs';
interface PublishArgs {
    manifestFile: string;
    dev?: boolean;
}
export declare function handlePublish({ manifestFile, dev }: Arguments<PublishArgs>): Promise<void>;
export {};
