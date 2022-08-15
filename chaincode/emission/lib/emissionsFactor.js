"use strict";
/*
    SPDX-License-Identifier: Apache-2.0
*/
/**
 * The release of GHG into the atmosphere depends mainly on the activity and the product.
 * In order to estimate GHG emissions per unit of available activity,
 * we need to use a factor called emission factor (EF).
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmissionsFactorState = exports.EmissionsFactor = exports.EMISSIONS_FACTOR_CLASS_IDENTIFER = void 0;
const const_1 = require("../util/const");
const state_1 = require("../util/state");
const worldstate_1 = require("../util/worldstate");
const emissions_calc_1 = require("./emissions-calc");
exports.EMISSIONS_FACTOR_CLASS_IDENTIFER = 'org.hyperledger.blockchain-carbon-accounting.emissionsfactoritem';
class EmissionsFactor extends state_1.State {
    constructor(_factor) {
        super([
            _factor.uuid,
            _factor.year || '',
            _factor.division_type || '',
            _factor.division_id || '',
        ]);
        this.factor = _factor;
        this.factor.class = exports.EMISSIONS_FACTOR_CLASS_IDENTIFER;
        this.factor.key = this.getKey();
    }
    toBuffer() {
        return state_1.State.serialize(this.factor);
    }
    fromBuffer(buf) {
        return new EmissionsFactor(state_1.State.deserialize(buf));
    }
}
exports.EmissionsFactor = EmissionsFactor;
class EmissionsFactorState extends worldstate_1.WorldState {
    constructor(stub) {
        super(stub);
    }
    async addEmissionsFactor(factor, uuid) {
        return await this.addState(uuid, factor.factor);
    }
    async getEmissionsFactor(uuid) {
        return new EmissionsFactor(await this.getState(uuid));
    }
    async updateEmissionsFactor(factor, uuid) {
        return await this.updateState(uuid, factor.factor);
    }
    async getEmissionsFactorsByDivision(divisionID, divisionType, year) {
        const maxYearLookup = 5; // if current year not found, try each preceding year up to this many times
        let retryCount = 0;
        let queryString = '';
        let results = [];
        while (results.length === 0 && retryCount <= maxYearLookup) {
            if (year !== undefined) {
                queryString = `{
                "selector" : {
                  "class": {
                     "$eq": "${exports.EMISSIONS_FACTOR_CLASS_IDENTIFER}"
                  },
                  "division_id" : {
                    "$eq": "${divisionID}"
                  },
                  "division_type": {
                    "$eq": "${divisionType}"
                  },
                  "year": {
                    "$eq": "${year + retryCount * -1}"
                }
                }
              }`;
            }
            else {
                queryString = `{
            "selector" : {
              "class": {
                 "$eq": "${exports.EMISSIONS_FACTOR_CLASS_IDENTIFER}"
              },
              "division_id" : {
                "$eq": "${divisionID}"
              },
              "division_type": {
                "$eq": "${divisionType}"
              }
            }
          }`;
            }
            const iterator = await this.stub.getQueryResult(queryString);
            results = await this.getAssetFromIterator(iterator);
            retryCount++;
        }
        if (results.length === 0) {
            throw new Error(`${const_1.ErrStateNotFound} : failed to get Utility Emissions Factors By division`);
        }
        return results;
    }
    // used by recordEmissions
    async getEmissionsFactorByLookupItem(lookup, thruDate) {
        const hasStateData = lookup.state_province !== '';
        const isNercRegion = lookup.divisions?.division_type.toLowerCase() === 'nerc_region';
        const isNonUSCountry = lookup.divisions?.division_type.toLowerCase() === 'country' &&
            lookup.divisions?.division_id.toLowerCase() !== 'usa';
        let divisionID;
        let divisionType;
        let year = undefined;
        if (hasStateData) {
            divisionID = lookup.state_province || '';
            divisionType = 'STATE';
        }
        else if (isNercRegion) {
            divisionID = lookup.divisions?.division_id || '';
            divisionType = lookup.divisions?.division_type || '';
        }
        else if (isNonUSCountry) {
            divisionID = lookup.divisions?.division_id || '';
            divisionType = 'Country';
        }
        else {
            divisionID = 'USA';
            divisionType = 'Country';
        }
        try {
            year = (0, emissions_calc_1.getYearFromDate)(thruDate);
        }
        catch (error) {
            console.error('could not fetch year');
            console.error(error);
        }
        console.log('fetching utilityFactors');
        const utilityFactors = await this.getEmissionsFactorsByDivision(divisionID, divisionType, year);
        console.log(utilityFactors);
        if (utilityFactors.length === 0) {
            throw new Error('No utility emissions factor found for given query');
        }
        return new EmissionsFactor(utilityFactors[0].Record);
    }
}
exports.EmissionsFactorState = EmissionsFactorState;
//# sourceMappingURL=emissionsFactor.js.map