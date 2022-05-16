import { StoreVersion } from './types.js'

export type ParsedVersion = [number, number, number]

export function toVersionArray(v: StoreVersion): ParsedVersion {
  return typeof v === 'number' ? [0, 0, v] :
    v.split('.').map(v => parseInt(v, 10)) as ParsedVersion
}
