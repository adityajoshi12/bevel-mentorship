import { ChaincodeStub } from 'fabric-shim';
import { EmissionRecordState, EmissionsRecordInterface } from './emissions';
import { EmissionsFactorInterface, EmissionsFactorState } from './emissionsFactor';
import { UtilityLookupItemInterface, UtilityLookupItemState } from './utilityLookupItem';
export declare class EmissionsRecordContract {
    protected emissionsState: EmissionRecordState;
    protected EmissionsFactorState: EmissionsFactorState;
    protected utilityLookupState: UtilityLookupItemState;
    constructor(stub: ChaincodeStub);
    /**
     *
     * Store the emissions record
     * @param utilityId for the utility
     * @param partyId for the party (company) which buys power from utility
     * @param fromDate date of the time period
     * @param thruDate date of the time period
     * @param energyUseAmount usage amount
     * @param energyUseUom UOM of energy usage amount -- ie kwh
     */
    recordEmissions(utilityId: string, partyId: string, fromDate: string, thruDate: string, energyUseAmount: string, energyUseUom: string, url: string, md5: string): Promise<Uint8Array>;
    updateEmissionsRecord(recordI: EmissionsRecordInterface): Promise<Uint8Array>;
    updateEmissionsMintedToken(tokenId: string, partyId: string, uuids: string[]): Promise<Uint8Array>;
    getEmissionsData(uuid: string): Promise<Uint8Array>;
    getValidEmissions(uuids: string[]): Promise<Uint8Array>;
    getAllEmissionsData(utilityId: string, partyId: string): Promise<Uint8Array>;
    getAllEmissionsDataByDateRange(fromDate: string, thruDate: string): Promise<Uint8Array>;
    getAllEmissionsDataByDateRangeAndParty(fromDate: string, thruDate: string, partyId: string): Promise<Uint8Array>;
    importUtilityFactor(factorI: EmissionsFactorInterface): Promise<Uint8Array>;
    updateUtilityFactor(factorI: EmissionsFactorInterface): Promise<Uint8Array>;
    getUtilityFactor(uuid: string): Promise<Uint8Array>;
    importUtilityIdentifier(lookupInterface: UtilityLookupItemInterface): Promise<Uint8Array>;
    updateUtilityIdentifier(lookupInterface: UtilityLookupItemInterface): Promise<Uint8Array>;
    getUtilityIdentifier(uuid: string): Promise<Uint8Array>;
    getAllUtilityIdentifiers(): Promise<Uint8Array>;
}
