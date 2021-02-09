import type {Logger} from './api_types';
import path from 'path';
import webpack from 'webpack';

export async function compilePackBundleWebpack(
  bundleFilename: string,
  packDirectory: string,
  logger: Logger,
): Promise<any> {
  const entrypoint = `${packDirectory}/manifest.ts`;

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
