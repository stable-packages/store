import { StoreVersion } from './types';

/**
 * Compare version.
 * Positive when processed > current
 * Negative when processed < current
 */
export function compareVersion(processed: StoreVersion, current: StoreVersion) {
  const v1 = toVersionArray(processed)
  const v2 = toVersionArray(current)
  return v1[0] !== v2[0] ? v1[0] - v2[0] :
    v1[1] !== v2[1] ? v1[1] - v2[1] :
      v1[2] - v2[2]
}

function toVersionArray(v: StoreVersion) {
  return typeof v === 'number' ? [0, 0, v] :
    v.split('.').map(v => Number.parseInt(v, 10))
}
