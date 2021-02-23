import type {Arguments} from 'yargs';
import {build} from './build';
import path from 'path';

interface PublishArgs {
  manifestFile: string;
}

export async function handlePublish({manifestFile}: Arguments<PublishArgs>) {
  const bundleFile = await build(manifestFile);
  bundleFile!;
  const packageJson = await import(path.join(path.dirname(manifestFile), 'package.json'));
  const codaPacksSDKVersion = packageJson.dependencies['coda-packs-sdk'];
  codaPacksSDKVersion!;

  // TODO(alan): when the storage work is complete, upload the file located at bundleFile
  // to hit the /publish API.
}
