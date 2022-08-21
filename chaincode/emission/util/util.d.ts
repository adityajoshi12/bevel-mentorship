interface ILogger {
    error: (message: unknown) => void;
    info: (message: string) => void;
    debug: (message: string) => void;
}
export declare const logger: ILogger;
export declare const stringToBytes: (msg: string) => Uint8Array;
export {};
