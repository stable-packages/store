import { StoreVersion } from './types';
/**
 * Compare version.
 * Positive when processed > current
 * Negative when processed < current
 */
export declare function compareVersion(processed: StoreVersion, current: StoreVersion): number;
