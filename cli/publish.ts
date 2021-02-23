import type {Arguments} from 'yargs';
import {build} from './build';
import path from 'path';
import {spawnProcess} from './helpers';

interface PublishArgs {
  manifestFile: string;
}

export async function handlePublish({manifestFile}: Arguments<PublishArgs>) {
  const bundleFile = await build(manifestFile);
  bundleFile!;
  const packsSDKVersion = spawnProcess(`cd ${path.dirname(manifestFile)} && npm -v coda-packs-sdk`);
  packsSDKVersion!;

  // TODO(alan): when the storage work is complete, upload the file located at bundleFile
  // to hit the /publish API.
}
