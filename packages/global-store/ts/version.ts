import type { StoreVersion } from './types.js'

/**
 * Compare version.
 * Positive when processed > current
 * Negative when processed < current
 */
export function compareVersion(processed: StoreVersion, current: StoreVersion) {
  const v1 = toVersionArray(processed)
  const v2 = toVersionArray(current)
  return v1[0] !== v2[0] ? v1[0] - v2[0] :
    v1[1] !== v2[1] ? v1[1] - v2[1] : v1[2] - v2[2]
}

export type ParsedVersion = [number, number, number]

export function toVersionArray(v: StoreVersion): ParsedVersion {
  return typeof v === 'number' ? [0, 0, v] :
    v.split('.').map(v => parseInt(v, 10)) as ParsedVersion
}
