import browserify from 'browserify';
import {ensureUnreachable} from '../helpers/ensure';
import * as esbuild from 'esbuild';
import exorcist from 'exorcist';
import fs from 'fs';
import ivm from 'isolated-vm';
import os from 'os';
import path from 'path';
import {processVmError} from './helpers';
import uglify from 'uglify-js';
import {v4} from 'uuid';

export interface CompilePackBundleOptions {
  bundleFilename?: string;
  manifestPath: string;
  outputDirectory?: string;
  intermediateOutputDirectory?: string;
  sourceMap?: boolean;
  minify?: boolean;
  timerStrategy?: TimerShimStrategy;
}

export enum TimerShimStrategy {
  None = 'none',
  Error = 'error',
  Fake = 'fake',
}

export interface CompilePackBundleResult {
  bundlePath: string;
  bundleSourceMapPath: string;
  intermediateOutputDirectory: string;
}

async function loadIntoVM(bundlePath: string) {
  const bundle = fs.readFileSync(bundlePath);

  const isolate = new ivm.Isolate({memoryLimit: 128});
  const ivmContext = await isolate.createContext();
  // Setup the global object.
  const jail = ivmContext.global;
  await jail.set('global', jail.derefInto());
  await jail.set('exports', {}, {copy: true});

  const script = await isolate.compileScript(bundle.toString(), {filename: bundlePath});
  await script.run(ivmContext);
}

type BuildFunction = (options: {
  lastBundleFilename: string;
  outputBundleFilename: string;
  options: CompilePackBundleOptions;
}) => Promise<void>;

async function browserifyBundle({
  lastBundleFilename,
  outputBundleFilename,
  options,
}: {
  lastBundleFilename: string;
  outputBundleFilename: string;
  options: CompilePackBundleOptions;
}): Promise<void> {
  // browserify doesn't minify by default. if necessary another pipe can be created to minify the output.
  const browserifyCompiler = browserify(lastBundleFilename, {
    debug: true,
    standalone: 'exports',
  });
  const writer = fs.createWriteStream(outputBundleFilename);
  const compiledStream = browserifyCompiler.bundle();
  return new Promise(resolve => {
    compiledStream
      .pipe(
        exorcist(`${outputBundleFilename}.map`, undefined, `${process.cwd()}/`, options.intermediateOutputDirectory),
      )
      .pipe(writer);
    writer.on('finish', () => {
      resolve(undefined);
    });
  });
}

async function uglifyBundle({
  lastBundleFilename,
  outputBundleFilename,
}: {
  lastBundleFilename: string;
  outputBundleFilename: string;
  options: CompilePackBundleOptions;
}) {
  const sourcemap = JSON.parse(fs.readFileSync(`${lastBundleFilename}.map`).toString());
  const uglifyOutput = uglify.minify(fs.readFileSync(lastBundleFilename).toString(), {
    sourceMap: {
      url: `${outputBundleFilename}.map`,
      content: sourcemap,
      includeSources: true,
    },
  });

  if (uglifyOutput.error) {
    throw uglifyOutput.error;
  }

  if (uglifyOutput.warnings) {
    // eslint-disable-next-line no-console
    console.warn(uglifyOutput.warnings);
  }

  fs.writeFileSync(outputBundleFilename, uglifyOutput.code);
  fs.writeFileSync(`${outputBundleFilename}.map`, uglifyOutput.map);
}

function getTimerShims(timerStrategy: TimerShimStrategy): string[] {
  switch (timerStrategy) {
    case TimerShimStrategy.None:
      return [];
    case TimerShimStrategy.Fake:
      return [`${__dirname}/injections/timers_shim.js`];
    case TimerShimStrategy.Error:
      return [`${__dirname}/injections/timers_disabled_shim.js`];
    default:
      ensureUnreachable(timerStrategy);
  }
}

function getInjections({timerStrategy = TimerShimStrategy.None}: CompilePackBundleOptions): string[] {
  const shims = [...getTimerShims(timerStrategy), `${__dirname}/injections/crypto_shim.js`];

  return shims;
}

async function buildWithES({
  lastBundleFilename,
  outputBundleFilename,
  options: buildOptions,
}: {
  lastBundleFilename: string;
  outputBundleFilename: string;
  options: CompilePackBundleOptions;
}) {
  const options: esbuild.BuildOptions = {
    banner: {js: "'use strict';"},
    bundle: true,
    entryPoints: [lastBundleFilename],
    outfile: outputBundleFilename,
    format: 'cjs',
    platform: 'node',

    inject: getInjections(buildOptions),
    minify: false, // don't minify here since browserify doesn't minify anyway.
    sourcemap: 'both',
  };

  await esbuild.build(options);
}

export async function compilePackBundle({
  bundleFilename = 'bundle.js', // the output bundle filename
  outputDirectory,
  manifestPath,
  minify = true,
  intermediateOutputDirectory,
  timerStrategy = TimerShimStrategy.None,
}: CompilePackBundleOptions): Promise<CompilePackBundleResult> {
  const esbuildBundleFilename = 'esbuild-bundle.js';
  const browserifyBundleFilename = 'browserify-bundle.js';
  const browserifyWithShimBundleFilename = 'browserify-with-shim-bundle.js';
  const uglifyBundleFilename = 'uglify-bundle.js';

  if (!intermediateOutputDirectory) {
    intermediateOutputDirectory = fs.mkdtempSync(path.join(os.tmpdir(), `coda-packs-${v4()}`));
  }

  const options = {
    bundleFilename,
    outputDirectory,
    manifestPath,
    minify,
    intermediateOutputDirectory,
    timerStrategy,
  };

  const buildChain: Array<{builder: BuildFunction; outputFilename: string}> = [
    {builder: buildWithES, outputFilename: esbuildBundleFilename},
    {builder: browserifyBundle, outputFilename: browserifyBundleFilename},

    // browserify will add additional symbols that need shim injection.
    {builder: buildWithES, outputFilename: browserifyWithShimBundleFilename},
  ];

  if (minify) {
    buildChain.push({builder: uglifyBundle, outputFilename: uglifyBundleFilename});
  }

  // let the last step of the chain use bundleFilename for output name so that we don't need to
  // apply another step to rename the filenames in sourcemap.
  buildChain[buildChain.length - 1].outputFilename = bundleFilename;

  let filename = path.resolve(manifestPath);

  for (const {builder, outputFilename} of buildChain) {
    const outputBundleFilename = path.join(intermediateOutputDirectory, outputFilename);
    await builder({
      lastBundleFilename: filename,
      outputBundleFilename,
      options,
    });
    filename = outputBundleFilename;
  }

  const tempBundlePath = filename;

  // test if it can be loaded into isolated-vm.
  // among all the packs. Google Drive (1059) won't load into IVM at this moment since it requires jimp
  // which uses gifcodec, which calls process.nextTick on the global level.
  // maybe we just need to get rid of jimp and resize-optimize-images instead.
  try {
    await loadIntoVM(tempBundlePath);
  } catch (err) {
    throw await processVmError(err, tempBundlePath);
  }

  if (!outputDirectory || outputDirectory === intermediateOutputDirectory) {
    return {
      bundlePath: tempBundlePath,
      intermediateOutputDirectory,
      bundleSourceMapPath: `${tempBundlePath}.map`,
    };
  }

  const bundlePath = path.join(outputDirectory, bundleFilename);
  const bundleSourceMapPath = `${bundlePath}.map`;

  if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory, {recursive: true});
  }

  // move over finally compiled bundle & sourcemap to the target directory.
  fs.copyFileSync(tempBundlePath, bundlePath);
  fs.copyFileSync(`${tempBundlePath}.map`, bundleSourceMapPath);

  return {
    intermediateOutputDirectory,
    bundlePath,
    bundleSourceMapPath,
  };
}
