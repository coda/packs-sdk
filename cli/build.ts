import type {Arguments} from 'yargs';
import * as esbuild from 'esbuild';
import fs from 'fs';
import os from 'os';
import path from 'path';

interface BuildArgs {
  manifestFile: string;
}

export async function handleBuild({manifestFile}: Arguments<BuildArgs>) {
  await build(manifestFile);
}

export async function build(manifestFile: string): Promise<string> {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'coda-packs-'));

  const bundleFilename = path.join(tempDir, `bundle.js`);
  await compilePackBundleESBuild(bundleFilename, manifestFile);
  return bundleFilename;
}

export async function compilePackBundleESBuild(bundleFilename: string, entrypoint: string) {
  const options: esbuild.BuildOptions = {
    banner: {js: "'use strict';"},
    bundle: true,
    entryPoints: [entrypoint],
    outfile: bundleFilename,
    format: 'cjs',
    minify: false,
  };
  await esbuild.build(options);
}
