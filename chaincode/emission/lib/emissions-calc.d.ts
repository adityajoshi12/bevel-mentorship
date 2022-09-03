import type { EmissionsFactorInterface } from './emissionsFactor';
export declare const getUomFactor: (uom?: string) => number;
export declare const getYearFromDate: (date: string) => number;
export interface CO2EmissionFactorInterface {
    emission: {
        value: number;
        uom: string;
    };
    division_type?: string;
    division_id?: string;
    renewable_energy_use_amount?: number;
    nonrenewable_energy_use_amount?: number;
    year: number;
}
export declare const getCO2EmissionFactor: (factor: EmissionsFactorInterface, usage: number, usageUOM: string) => CO2EmissionFactorInterface;
