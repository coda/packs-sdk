import packageJson from '../package.json';
import semver from 'semver';

async function main() {
  if (process.env.FORCE_RELEASE) {
    print('Force release is enabled. Skipping SDK version check.');
    return;
  }

  const response = await fetch('https://coda.io/versionz');
  const json = await response.json();
  const liveSdkVersion = json.packsSdkVersion;
  const versionToBeReleased = packageJson.version;
  if (semver.gt(versionToBeReleased, liveSdkVersion)) {
    print(`Attempting to release ${versionToBeReleased} but the live version in Coda is ${liveSdkVersion}.`);
    print('Please wait to release until support for this prerelease version has been pushed live in Coda.');
    print('To bypass this check, re-run with FORCE_RELEASE=1.');
    process.exit(1);
  }
}

// eslint-disable-next-line no-console
const print = console.log;

void main();
