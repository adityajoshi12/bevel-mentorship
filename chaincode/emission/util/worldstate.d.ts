import { ChaincodeStub, Iterators } from 'fabric-shim';
import { State } from './state';
/**
 * WorldState class is a wrapper around chaincode stub
 * for managing lifecycle of a asset of type T (interface) on HL fabric
 * provided methods
 * - addState
 * - getState
 * - query
 * - getAssetFromIterator
 * - updateState
 */
export interface QueryResult<T> {
    Key: string;
    Record: T;
}
export declare abstract class WorldState<T> extends State {
    protected stub: ChaincodeStub;
    constructor(stub: ChaincodeStub);
    protected addState(id: string, asset: T): Promise<void>;
    protected updateState(id: string, asset: T): Promise<void>;
    protected getState(id: string): Promise<T>;
    protected query(queryString?: string): Promise<QueryResult<T>[]>;
    protected getAssetFromIterator(iterator: Iterators.StateQueryIterator): Promise<QueryResult<T>[]>;
}
