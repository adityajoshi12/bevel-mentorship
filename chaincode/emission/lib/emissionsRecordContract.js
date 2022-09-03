"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmissionsRecordContract = void 0;
const crypto_js_1 = require("crypto-js");
const emissions_1 = require("./emissions");
const emissions_calc_1 = require("./emissions-calc");
const emissionsFactor_1 = require("./emissionsFactor");
const utilityLookupItem_1 = require("./utilityLookupItem");
// EmissionsRecordContract : core bushiness logic of emissions record chaincode
class EmissionsRecordContract {
    constructor(stub) {
        this.emissionsState = new emissions_1.EmissionRecordState(stub);
        this.EmissionsFactorState = new emissionsFactor_1.EmissionsFactorState(stub);
        this.utilityLookupState = new utilityLookupItem_1.UtilityLookupItemState(stub);
    }
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
    async recordEmissions(utilityId, partyId, fromDate, thruDate, energyUseAmount, energyUseUom, url, md5) {
        // get emissions factors from eGRID database; convert energy use to emissions factor UOM; calculate energy use
        const lookup = await this.utilityLookupState.getUtilityLookupItem(utilityId);
        const factor = await this.EmissionsFactorState.getEmissionsFactorByLookupItem(lookup.item, thruDate);
        const co2Emission = (0, emissions_calc_1.getCO2EmissionFactor)(factor.factor, Number(energyUseAmount), energyUseUom);
        const factorSource = `eGrid ${co2Emission.year} ${co2Emission.division_type} ${co2Emission.division_id}`;
        // create an instance of the emissions record
        const uuid = (0, crypto_js_1.MD5)(utilityId + partyId + fromDate + thruDate).toString();
        const partyIdsha256 = (0, crypto_js_1.SHA256)(partyId).toString();
        const emissionI = {
            uuid,
            utilityId,
            partyId: partyIdsha256,
            fromDate,
            thruDate,
            emissionsAmount: co2Emission.emission.value,
            renewableEnergyUseAmount: co2Emission.renewable_energy_use_amount,
            nonrenewableEnergyUseAmount: co2Emission.nonrenewable_energy_use_amount,
            energyUseUom,
            factorSource,
            url,
            md5,
            tokenId: null,
        };
        const emission = new emissions_1.EmissionsRecord(emissionI);
        await this.emissionsState.addEmissionsRecord(emission, uuid);
        return emission.toBuffer();
    }
    async updateEmissionsRecord(recordI) {
        if (recordI.partyId) {
            recordI.partyId = (0, crypto_js_1.SHA256)(recordI.partyId).toString();
        }
        const record = new emissions_1.EmissionsRecord(recordI);
        await this.emissionsState.updateEmissionsRecord(record, recordI.uuid || '');
        return record.toBuffer();
    }
    async updateEmissionsMintedToken(tokenId, partyId, uuids) {
        for (const uuid of uuids) {
            const record = await this.emissionsState.getEmissionsRecord(uuid);
            record.record.tokenId = tokenId;
            record.record.partyId = (0, crypto_js_1.SHA256)(partyId).toString();
            await this.emissionsState.updateEmissionsRecord(record, uuid);
        }
        const out = {
            keys: uuids,
        };
        return Buffer.from(JSON.stringify(out));
    }
    async getEmissionsData(uuid) {
        const record = await this.emissionsState.getEmissionsRecord(uuid);
        return record.toBuffer();
    }
    async getValidEmissions(uuids) {
        const validEmissions = [];
        const validUUIDS = [];
        for (const uuid of uuids) {
            const emission = await this.emissionsState.getEmissionsRecord(uuid);
            if (emission.record.tokenId !== null) {
                continue;
            }
            validEmissions.push(emission.record);
            validUUIDS.push(emission.record.uuid || '');
        }
        const output = {
            keys: validUUIDS,
            output_to_client: Buffer.from(JSON.stringify(validEmissions)).toString('base64'),
            output_to_store: {
                validUUIDs: Buffer.from(JSON.stringify(validUUIDS)).toString('base64'),
            },
        };
        return Buffer.from(JSON.stringify(output));
    }
    async getAllEmissionsData(utilityId, partyId) {
        const partyIdsha256 = (0, crypto_js_1.SHA256)(partyId).toString();
        const records = await this.emissionsState.getAllEmissionRecords(utilityId, partyIdsha256);
        return Buffer.from(JSON.stringify(records));
    }
    async getAllEmissionsDataByDateRange(fromDate, thruDate) {
        const records = await this.emissionsState.getAllEmissionsDataByDateRange(fromDate, thruDate);
        return Buffer.from(JSON.stringify(records));
    }
    async getAllEmissionsDataByDateRangeAndParty(fromDate, thruDate, partyId) {
        const partyIdsha256 = (0, crypto_js_1.SHA256)(partyId).toString();
        const records = await this.emissionsState.getAllEmissionsDataByDateRangeAndParty(fromDate, thruDate, partyIdsha256);
        return Buffer.from(JSON.stringify(records));
    }
    async importUtilityFactor(factorI) {
        const factor = new emissionsFactor_1.EmissionsFactor(factorI);
        await this.EmissionsFactorState.addEmissionsFactor(factor, factorI.uuid);
        return factor.toBuffer();
    }
    async updateUtilityFactor(factorI) {
        const factor = new emissionsFactor_1.EmissionsFactor(factorI);
        await this.EmissionsFactorState.updateEmissionsFactor(factor, factorI.uuid);
        return factor.toBuffer();
    }
    async getUtilityFactor(uuid) {
        return (await this.EmissionsFactorState.getEmissionsFactor(uuid)).toBuffer();
    }
    async importUtilityIdentifier(lookupInterface) {
        const lookup = new utilityLookupItem_1.UtilityLookupItem(lookupInterface);
        await this.utilityLookupState.addUtilityLookupItem(lookup, lookupInterface.uuid);
        return lookup.toBuffer();
    }
    async updateUtilityIdentifier(lookupInterface) {
        const lookup = new utilityLookupItem_1.UtilityLookupItem(lookupInterface);
        await this.utilityLookupState.updateUtilityLookupItem(lookup, lookupInterface.uuid);
        return lookup.toBuffer();
    }
    async getUtilityIdentifier(uuid) {
        return (await this.utilityLookupState.getUtilityLookupItem(uuid)).toBuffer();
    }
    async getAllUtilityIdentifiers() {
        const result = await this.utilityLookupState.getAllUtilityLookupItems();
        return Buffer.from(JSON.stringify(result));
    }
}
exports.EmissionsRecordContract = EmissionsRecordContract;
//# sourceMappingURL=emissionsRecordContract.js.map