import type {Arguments} from 'yargs';
import {compilePackBundle} from '../testing/compile';
import {print} from '../testing/helpers';

interface BuildArgs {
  manifestFile: string;
  outputDir?: string;
  minify: boolean;
  timers: boolean;
}

export async function handleBuild({outputDir, manifestFile, minify, timers}: Arguments<BuildArgs>) {
  const {bundlePath, intermediateOutputDirectory} = await compilePackBundle({
    manifestPath: manifestFile,
    minify,
    outputDirectory: outputDir,
    enableTimers: timers,
  });
  if (outputDir) {
    print(
      `Pack built successfully. Compiled output is in ${bundlePath}. Intermediate files are in ${intermediateOutputDirectory}`,
    );
  } else {
    print(`Pack built successfully. Compiled output is in ${bundlePath}.`);
  }
}

export async function build(manifestFile: string): Promise<string> {
  const {bundlePath} = await compilePackBundle({
    manifestPath: manifestFile,
  });

  return bundlePath;
}
