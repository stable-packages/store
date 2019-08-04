import { StoreVersion } from './types';
export declare type ParsedVersion = [number, number, number];
export declare function toVersionArray(v: StoreVersion): ParsedVersion;
