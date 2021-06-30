import browserify from 'browserify';
import * as esbuild from 'esbuild';
import exorcist from 'exorcist';
import fs from 'fs';
import ivm from 'isolated-vm';
import os from 'os';
import path from 'path';
import uglify from 'uglify-js';
import {v4} from 'uuid';

export interface CompilePackBundleOptions {
  bundleFilename?: string;
  manifestPath: string;
  outputDirectory?: string;
  intermediateOutputDirectory?: string;
  sourceMap?: boolean;
  minify?: boolean;
}

export interface CompilePackBundleResult {
  bundlePath: string;
  bundleSourceMapPath: string;
  intermediateOutputDirectory: string;
}

async function loadIntoVM(bundlePath: string) {
  const bundle = fs.readFileSync(bundlePath);

  const isolate = new ivm.Isolate({ memoryLimit: 128 });
  const ivmContext = await isolate.createContext();
  // Setup the global object.
  const jail = ivmContext.global;
  await jail.set('global', jail.derefInto());
  await jail.set('exports', {}, {copy: true});

  const script = await isolate.compileScript(bundle.toString());
  await script.run(ivmContext);
}

async function browserifyBundle({
  outputDirectory,
  lastBundleFilename,
  outputBundleFilename,
}: {outputDirectory: string; lastBundleFilename: string, outputBundleFilename: string}) {
  // browserify doesn't minify by default. if necessary another pipe can be created to minify the output.
  const browserifyCompiler = browserify(path.join(outputDirectory, lastBundleFilename), {debug: true, standalone: 'exports'});
  const writer = fs.createWriteStream(path.join(outputDirectory, outputBundleFilename));
  const compiledStream = browserifyCompiler.bundle();
  return new Promise(resolve => {
    compiledStream
      .pipe(exorcist(`${path.join(outputDirectory, outputBundleFilename)}.map`, undefined, `${process.cwd()}/`, outputDirectory))
      .pipe(writer);  
    writer.on('finish', () => {
      resolve(undefined);
    });
  });
}

async function uglifyBundle({
  outputDirectory,
  lastBundleFilename,
  outputBundleFilename,
}: {outputDirectory: string; lastBundleFilename: string, outputBundleFilename: string}) {
  const sourcemap = JSON.parse(fs.readFileSync(`${path.join(outputDirectory, lastBundleFilename)}.map`).toString());
  const uglifyOutput = uglify.minify(
    fs.readFileSync(path.join(outputDirectory, lastBundleFilename)).toString(),
    {
      sourceMap: {
        url: `${outputBundleFilename}.map`,
        content: sourcemap,
        includeSources: true,
        root: `${process.cwd()}/`,
      },
    }
  );

  if (uglifyOutput.error) {
    throw uglifyOutput.error;
  }

  if (uglifyOutput.warnings) {
    // eslint-disable-next-line no-console
    console.warn(uglifyOutput.warnings);
  }

  fs.writeFileSync(path.join(outputDirectory, outputBundleFilename), uglifyOutput.code);
  fs.writeFileSync(path.join(outputDirectory, `${outputBundleFilename}.map`), uglifyOutput.map);
}

async function buildWithES({
  manifestPath,
  outputDirectory,
  outputBundleFilename,
}: {manifestPath: string, outputDirectory: string, outputBundleFilename: string}) {
  const options: esbuild.BuildOptions = {
    banner: {js: "'use strict';"},
    bundle: true,
    entryPoints: [manifestPath],
    outfile: path.join(outputDirectory, outputBundleFilename),
    format: 'cjs',
    platform: 'node',
    minify: false,  // don't minify here since browserify doesn't minify anyway.
    sourcemap: 'inline',
  };
  
  await esbuild.build(options);
}

export async function compilePackBundle({
  bundleFilename = 'bundle.js',  // the output bundle filename
  outputDirectory,
  manifestPath,
  minify = true,
  intermediateOutputDirectory,
}: CompilePackBundleOptions): Promise<CompilePackBundleResult> {
  const nodeBundleFilename = 'node-bundle.js';
  const browserifyBundleFilename = 'browserify-bundle.js';

  if (!intermediateOutputDirectory) {
    intermediateOutputDirectory = fs.mkdtempSync(path.join(os.tmpdir(), `coda-packs-${v4()}`));
  }

  // TODO(huayang): esbuild may not be necessary here since we use browserify to bundle it anyway.
  await buildWithES({
    manifestPath,
    outputDirectory: intermediateOutputDirectory,
    outputBundleFilename: nodeBundleFilename,
  });

  if (minify) {
    await browserifyBundle({
      outputDirectory: intermediateOutputDirectory, 
      lastBundleFilename: nodeBundleFilename, 
      outputBundleFilename: browserifyBundleFilename,
    });
  
    await uglifyBundle({
      outputDirectory: intermediateOutputDirectory,
      outputBundleFilename: bundleFilename,
      lastBundleFilename: browserifyBundleFilename,
    });  
  } else {
    await browserifyBundle({
      outputDirectory: intermediateOutputDirectory, 
      lastBundleFilename: nodeBundleFilename, 
      outputBundleFilename: bundleFilename,
    });
  }

  const tempBundlePath = path.join(intermediateOutputDirectory, bundleFilename);

  // test if it can be loaded into isolated-vm.
  // among all the packs. Google Drive (1059) won't load into IVM at this moment since it requires jimp 
  // which uses gifcodec, which calls process.nextTick on the global level.
  // maybe we just need to get rid of jimp and resize-optimize-images instead.
  await loadIntoVM(tempBundlePath);

  if (!outputDirectory) {
    return {
      bundlePath: path.join(intermediateOutputDirectory, bundleFilename),
      intermediateOutputDirectory,
      bundleSourceMapPath: path.join(intermediateOutputDirectory, `${bundleFilename}.map`),
    }  
  }

  const bundlePath = path.join(outputDirectory, bundleFilename);
  const bundleSourceMapPath = `${bundlePath}.map`;

  // move over finally compiled bundle & sourcemap to the target directory.
  fs.copyFileSync(tempBundlePath, bundlePath);
  fs.copyFileSync(`${tempBundlePath}.map`, bundleSourceMapPath);

  return {
    bundlePath,
    intermediateOutputDirectory,
    bundleSourceMapPath,
  }
}
