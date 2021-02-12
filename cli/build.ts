import type {Arguments} from 'yargs';
import {ConsoleLogger} from '../helpers/logging';
import type {Logger} from '../api_types';
import path from 'path';
import webpack from 'webpack';

interface BuildArgs {
  manifestFile: string;
}

export async function handleBuild({manifestFile}: Arguments<BuildArgs>) {
  const {manifest} = await import(manifestFile);
  const versionDirPart = `${manifest.id}/${manifest.version}`;
  const baseDir = path.normalize(path.join(__dirname, '..', '..'));
  const bundleFilename = path.join(baseDir, `dist`, versionDirPart, 'bundle.js');
  await compilePackBundleWebpack(bundleFilename, manifestFile, new ConsoleLogger());
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
