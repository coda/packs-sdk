import type { Arguments } from 'yargs';
interface PublishArgs {
    manifestFile: string;
}
export declare function handlePublish({ manifestFile }: Arguments<PublishArgs>): Promise<void>;
export {};
