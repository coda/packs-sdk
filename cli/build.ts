import type {Arguments} from 'yargs';
import {ConsoleLogger} from '../helpers/logging';
import type {Logger} from '../api_types';
import * as esbuild from 'esbuild';
import fs from 'fs';
import os from 'os';
import path from 'path';
import webpack from 'webpack';

interface BuildArgs {
  manifestFile: string;
  compiler?: Compiler;
}

enum Compiler {
  esbuild = 'esbuild',
  webpack = 'webpack',
}

export async function handleBuild({manifestFile, compiler}: Arguments<BuildArgs>) {
  await build(manifestFile, compiler);
}

export async function build(manifestFile: string, compiler?: string): Promise<string> {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'coda-packs-'));

  const bundleFilename = path.join(tempDir, `bundle.js`);
  const logger = new ConsoleLogger();

  switch (compiler) {
    case Compiler.webpack:
      await compilePackBundleWebpack(bundleFilename, manifestFile, logger);
      break;
    case Compiler.esbuild:
    default:
      await compilePackBundleESBuild(bundleFilename, manifestFile);
  }

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

async function compilePackBundleWebpack(bundleFilename: string, entrypoint: string, logger: Logger): Promise<any> {
  logger.info(`... Bundle -> ${bundleFilename}`);
  const config: webpack.Configuration = {
    devtool: 'source-map',
    entry: entrypoint,
    mode: 'development',
    module: {
      rules: [
        {
          test: /\.[tj]s$/,
          use: {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        },
      ],
    },
    name: 'PackBundle',
    node: false,
    output: {
      path: path.dirname(bundleFilename),
      filename: path.basename(bundleFilename),
      libraryTarget: 'commonjs2',
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    target: 'async-node',
  };
  const compiler = webpack(config);

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        logger.warn(err.stack || err.message || err.toString());
        return reject(err);
      }
      return resolve(stats);
    });
  });
}
