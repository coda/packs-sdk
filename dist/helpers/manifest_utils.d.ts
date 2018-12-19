import { ExternalPackMetadata } from '../compiled_types';
import { JsonExternalPackMetadata } from '../compiled_types';
/** Corrects the JSON-serialized format and outputs one for runtime consumption. */
export declare function deserializeExternalPackMetadata(rawMetadata: JsonExternalPackMetadata): ExternalPackMetadata;
