import { ChaincodeStub } from 'fabric-shim';
import { State } from '../util/state';
import { QueryResult, WorldState } from '../util/worldstate';
export declare const UTILITY_LOOKUP_ITEM_CLASS_IDENTIFIER = "org.hyperledger.blockchain-carbon-accounting.utilitylookuplist";
export interface DivisionsInterface {
    division_type: string;
    division_id: string;
}
export interface UtilityLookupItemInterface {
    class: string;
    key?: string;
    uuid: string;
    year?: string;
    utility_number?: string;
    utility_name?: string;
    country?: string;
    state_province?: string;
    divisions?: DivisionsInterface;
}
export declare class UtilityLookupItem extends State {
    item: UtilityLookupItemInterface;
    constructor(_item: UtilityLookupItemInterface);
    toBuffer(): Uint8Array;
    fromBuffer(buf: Uint8Array): UtilityLookupItem;
}
export declare class UtilityLookupItemState extends WorldState<UtilityLookupItemInterface> {
    constructor(stub: ChaincodeStub);
    addUtilityLookupItem(item: UtilityLookupItem, uuid: string): Promise<void>;
    getUtilityLookupItem(uuid: string): Promise<UtilityLookupItem>;
    getAllUtilityLookupItems(): Promise<QueryResult<UtilityLookupItemInterface>[]>;
    updateUtilityLookupItem(item: UtilityLookupItem, uuid: string): Promise<void>;
}
