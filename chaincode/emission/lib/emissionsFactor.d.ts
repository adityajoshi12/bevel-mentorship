/**
 * The release of GHG into the atmosphere depends mainly on the activity and the product.
 * In order to estimate GHG emissions per unit of available activity,
 * we need to use a factor called emission factor (EF).
 */
import { ChaincodeStub } from 'fabric-shim';
import { State } from '../util/state';
import { QueryResult, WorldState } from '../util/worldstate';
import { UtilityLookupItemInterface } from './utilityLookupItem';
export declare const EMISSIONS_FACTOR_CLASS_IDENTIFER = "org.hyperledger.blockchain-carbon-accounting.emissionsfactoritem";
export interface EmissionsFactorInterface {
    class: string;
    key?: string;
    uuid: string;
    type: string;
    scope?: string;
    level_1: string;
    level_2: string;
    level_3: string;
    level_4?: string;
    text?: string;
    year?: string;
    from_year?: string;
    thru_year?: string;
    country?: string;
    division_type?: string;
    division_id?: string;
    division_name?: string;
    activity_uom?: string;
    net_generation?: string;
    net_generation_uom?: string;
    co2_equivalent_emissions?: string;
    co2_equivalent_emissions_uom?: string;
    source?: string;
    non_renewables?: string;
    renewables?: string;
    percent_of_renewables?: string;
}
export declare class EmissionsFactor extends State {
    factor: EmissionsFactorInterface;
    constructor(_factor: EmissionsFactorInterface);
    toBuffer(): Uint8Array;
    fromBuffer(buf: Uint8Array): EmissionsFactor;
}
export declare class EmissionsFactorState extends WorldState<EmissionsFactorInterface> {
    constructor(stub: ChaincodeStub);
    addEmissionsFactor(factor: EmissionsFactor, uuid: string): Promise<void>;
    getEmissionsFactor(uuid: string): Promise<EmissionsFactor>;
    updateEmissionsFactor(factor: EmissionsFactor, uuid: string): Promise<void>;
    getEmissionsFactorsByDivision(divisionID: string, divisionType: string, year?: number): Promise<QueryResult<EmissionsFactorInterface>[]>;
    getEmissionsFactorByLookupItem(lookup: UtilityLookupItemInterface, thruDate: string): Promise<EmissionsFactor>;
}
