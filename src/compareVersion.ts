import { StoreVersion } from './types';

export function compareVersion(a: StoreVersion, b: StoreVersion) {
  const v1 = toVersionArray(a)
  const v2 = toVersionArray(b)
  return v1[0] !== v2[0] ? v1[0] - v2[0] :
    v1[1] !== v2[1] ? v1[1] - v2[1] :
      v1[2] - v2[2]
}

function toVersionArray(v: StoreVersion) {
  return typeof v === 'number' ? [0, 0, v] :
    v.split('.').map(v => Number.parseInt(v, 10))
}
