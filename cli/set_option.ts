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
    default:
      return ensureUnreachable(key);
  }
}
