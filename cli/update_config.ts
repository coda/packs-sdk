import type {Arguments} from 'yargs';

interface UpdateConfigArgs {
  manifestFile: string;
  codaApiEndpoint: string;
}

export async function handleUpdateConfig({
}: Arguments<UpdateConfigArgs>) {
}