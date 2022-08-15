import { ChaincodeStub } from 'fabric-shim';
import { State } from '../util/state';
import { QueryResult, WorldState } from '../util/worldstate';
export interface EmissionsRecordInterface {
    class?: string;
    key?: string;
    uuid?: string;
    utilityId?: string;
    partyId?: string;
    fromDate?: string;
    thruDate?: string;
    emissionsAmount?: number;
    renewableEnergyUseAmount?: number;
    nonrenewableEnergyUseAmount?: number;
    energyUseUom?: string;
    factorSource?: string;
    url?: string;
    md5?: string;
    tokenId?: string | null;
}
/**
 * EmissionsRecord class extends State class
 * Class will be used by application and smart contract to define a paper
 */
export declare class EmissionsRecord extends State {
    record: EmissionsRecordInterface;
    constructor(_record: EmissionsRecordInterface);
    toBuffer(): Uint8Array;
    fromBuffer(buf: Uint8Array): EmissionsRecord;
}
/**
 * EmissionsRecordWorldState class is wrapper around chaincode stub
 * for managing lifecycle of a EmissionRecord
 */
export declare class EmissionRecordState extends WorldState<EmissionsRecordInterface> {
    constructor(stub: ChaincodeStub);
    addEmissionsRecord(record: EmissionsRecord, uuid: string): Promise<void>;
    getEmissionsRecord(uuid: string): Promise<EmissionsRecord>;
    updateEmissionsRecord(record: EmissionsRecord, uuid: string): Promise<void>;
    getAllEmissionRecords(utilityId: string, partyId: string): Promise<QueryResult<EmissionsRecordInterface>[]>;
    getAllEmissionsDataByDateRange(fromDate: string, thruDate: string): Promise<QueryResult<EmissionsRecordInterface>[]>;
    getAllEmissionsDataByDateRangeAndParty(fromDate: string, thruDate: string, partyId: string): Promise<QueryResult<EmissionsRecordInterface>[]>;
}
