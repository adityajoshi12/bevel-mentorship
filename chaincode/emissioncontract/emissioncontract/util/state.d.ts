/**
 * State class. States have a class, unique key, and a lifecycle current state
 * the current state is determined by the specific subclass
 */
export declare abstract class State {
    private key;
    constructor(keyParts: string[]);
    getKey(): string;
    getSplitKey(): string[];
    protected static serialize<T>(object: T): Uint8Array;
    protected static deserialize<T>(buf: Uint8Array): T;
    static makeKey(keyParts: string[]): string;
    static splitKey(key: string): string[];
}
