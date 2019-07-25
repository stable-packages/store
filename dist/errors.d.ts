export declare class Prohibited extends Error {
    moduleName: string;
    action: string;
    constructor(moduleName: string, action: string);
}
export declare class AccessedBeforeLock extends Error {
    moduleName: string;
    constructor(moduleName: string);
}
