import { PackId } from '../types';
import { ProviderId } from '../types';
/** Given a Pack or Provider-scoped asset path, returns an asset path relative to the dist/assets directory. */
export declare function getCanonicalAssetPath(id: {
    packId: PackId;
} | {
    providerId: ProviderId;
}, path: string): string;
