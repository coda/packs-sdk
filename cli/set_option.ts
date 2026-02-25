import type {ArgumentsCamelCase} from 'yargs';
import {PackOptionKey} from './config_storage';
import type {PackOptions} from './config_storage';
import {TimerShimStrategy} from '../testing/compile';
import {ensureUnreachable} from '..';
import * as path from 'path';
import {print} from '../testing/helpers';
import {printAndExit} from '../testing/helpers';
import {storePackOptions} from './config_storage';

interface SetOptionArgs {
  manifestFile: string;
  option: string;
  value: string;
}

export async function handleSetOption({manifestFile, option, value}: ArgumentsCamelCase<SetOptionArgs>) {
  const manifestDir = path.dirname(manifestFile);
  const options = validateOption(option, value);
  storePackOptions(manifestDir, options);
  print('Option stored successfully.');
}

function validateOption(option: string, value: string): PackOptions {
  const validOptions = Object.values(PackOptionKey) as string[];
  if (!validOptions.includes(option)) {
    return printAndExit(`Unsupported option "${option}". Value options are: ${validOptions.join(', ')}`);
  }
  const key = option as PackOptionKey;
  switch (key) {
    case PackOptionKey.timerStrategy:
      const validValues = Object.values(TimerShimStrategy) as string[];
      if (!validValues.includes(value)) {
        return printAndExit(`Invalid option value "${value}". Valid values are ${validValues.join(', ')}`);
      }
      return {[key]: value as TimerShimStrategy};
    case PackOptionKey.enableGitTags:
      const boolValue = value.toLowerCase();
      if (boolValue !== 'true' && boolValue !== 'false') {
        return printAndExit(`Invalid option value "${value}". Valid values are true, false`);
      }
      return {[key]: boolValue === 'true'};
    case PackOptionKey.apiEndpoint:
      try {
        new URL(value);
      } catch {
        return printAndExit(`Invalid option value "${value}". Value must be a valid URL (e.g. https://my-env.coda.io)`);
      }
      return {[key]: value};
    default:
      return ensureUnreachable(key);
  }
}
