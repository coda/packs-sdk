import type {Arguments} from 'yargs';
import {build} from './build';

interface PublishArgs {
  manifestFile: string;
}

export async function handlePublish({manifestFile}: Arguments<PublishArgs>) {
  const bundleFile = await build(manifestFile);
  bundleFile!;
  const packageJson = await import('../package.json');
  const codaPacksSDKVersion = packageJson.version;
  codaPacksSDKVersion!;

  // TODO(alan): when the storage work is complete, upload the file located at bundleFile
  // to hit the /publish API.
}
