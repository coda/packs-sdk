import {ensureExists} from './ensure';
import semver from 'semver';
import {version} from '../package.json';

// Since package.json isn't in dist, we grab it from the root directory instead.
export function currentSDKVersion() {
  return ensureExists(semver.valid(version), 'SDK version appears invalid: ${version}');
}
