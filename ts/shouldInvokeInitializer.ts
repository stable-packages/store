import { ParsedVersion, toVersionArray } from './toVersionArray'
import { StoreVersion } from './types'

export function shouldInvokeInitializer(versions: StoreVersion[], version: StoreVersion) {
  const vs = versions.map(toVersionArray)
  const v = toVersionArray(version)
  return noMatchMajor(vs, v) || hasNewVersion(vs, v)
}

function noMatchMajor(versions: ParsedVersion[], version: ParsedVersion) {
  return !versions.some(v => v[0] === version[0])
}

function hasNewVersion(versions: ParsedVersion[], version: ParsedVersion) {
  return versions.filter(v => v[0] === version[0])
    .some(v => version[1] > v[1] || (version[1] === v[1] && version[2] > v[2]))
}
