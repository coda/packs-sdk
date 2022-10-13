import { PackOptionKey } from './config_storage';
import { TimerShimStrategy } from '../testing/compile';
import { ensureUnreachable } from '..';
import * as path from 'path';
import { print } from '../testing/helpers';
import { printAndExit } from '../testing/helpers';
import { storePackOptions } from './config_storage';
export async function handleSetOption({ manifestFile, option, value }) {
    const manifestDir = path.dirname(manifestFile);
    const options = validateOption(option, value);
    storePackOptions(manifestDir, options);
    print('Option stored successfully.');
}
function validateOption(option, value) {
    const validOptions = Object.values(PackOptionKey);
    if (!validOptions.includes(option)) {
        return printAndExit(`Unsupported option "${option}". Value options are: ${validOptions.join(', ')}`);
    }
    const key = option;
    switch (key) {
        case PackOptionKey.timerStrategy:
            const validValues = Object.values(TimerShimStrategy);
            if (!validValues.includes(value)) {
                return printAndExit(`Invalid option value "${value}". Valid values are ${validValues.join(', ')}`);
            }
            return { [key]: value };
        default:
            return ensureUnreachable(key);
    }
}
