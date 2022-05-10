import type {ArgumentsCamelCase} from 'yargs';
import type {TimerShimStrategy} from '../testing/compile';
import {compilePackBundle} from '../testing/compile';
import {print} from '../testing/helpers';

interface BuildArgs {
  manifestFile: string;
  outputDir?: string;
  minify: boolean;
  timerStrategy: TimerShimStrategy;
  intermediateOutputDirectory?: string;
}

export async function handleBuild({
  outputDir,
  manifestFile,
  minify,
  timerStrategy,
  intermediateOutputDirectory,
}: ArgumentsCamelCase<BuildArgs>) {
  const {bundlePath, intermediateOutputDirectory: actualIntermediateOutputDirectory} = await compilePackBundle({
    manifestPath: manifestFile,
    minify,
    outputDirectory: outputDir,
    timerStrategy,
    intermediateOutputDirectory,
  });
  if (outputDir) {
    print(
      `Pack built successfully. Compiled output is in ${bundlePath}. Intermediate files are in ${actualIntermediateOutputDirectory}`,
    );
  } else {
    print(`Pack built successfully. Compiled output is in ${bundlePath}.`);
  }
}

export async function build(
  manifestFile: string,
  {timerStrategy}: {timerStrategy?: TimerShimStrategy} = {},
): Promise<string> {
  const {bundlePath} = await compilePackBundle({
    manifestPath: manifestFile,
    timerStrategy,
  });

  return bundlePath;
}
