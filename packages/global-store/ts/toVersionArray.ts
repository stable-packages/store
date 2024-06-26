import type { StoreVersion } from './types.js'

export type ParsedVersion = [number, number, number]

export function toVersionArray(v: StoreVersion): ParsedVersion {
	return typeof v === 'number' ? [0, 0, v] : (v.split('.').map((v) => Number.parseInt(v, 10)) as ParsedVersion)
}
