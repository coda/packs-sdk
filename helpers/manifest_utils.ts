import {$JsonSerialized} from '../type_utils';
import {ExternalPackFormat} from '../compiled_types';
import {ExternalPackMetadata} from '../compiled_types';
import {JsonExternalPackMetadata} from '../compiled_types';
import {ensureExists} from './ensure';

/** Corrects the JSON-serialized format and outputs one for runtime consumption. */
function deserializePackFormat({matchers, ...rest}: $JsonSerialized<ExternalPackFormat>): ExternalPackFormat {
  const regExpMatchers =
    matchers &&
    matchers.map(regExpString => {
      const [, pattern, flags] = ensureExists(((regExpString as any) as string).match(/\/(.*)\/([a-z]+)?/));
      return new RegExp(pattern, flags);
    });
  return {
    ...rest,
    matchers: regExpMatchers,
  };
}

/** Corrects the JSON-serialized format and outputs one for runtime consumption. */
export function deserializeExternalPackMetadata(rawMetadata: JsonExternalPackMetadata): ExternalPackMetadata {
  const {formats, ...metadata} = rawMetadata;
  if (formats) {
    return {formats: formats.map(f => deserializePackFormat(f)), ...metadata};
  }

  return metadata;
}
