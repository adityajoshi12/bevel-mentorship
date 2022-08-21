"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fabric_shim_1 = require("fabric-shim");
const emissionsRecordContract_1 = require("./lib/emissionsRecordContract");
const const_1 = require("./util/const");
const util_1 = require("./util/util");
class EmissionsChaincode {
    constructor() {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        this.methods = {
            importUtilityIdentifier: this.importUtilityIdentifier,
            updateUtilityIdentifier: this.updateUtilityIdentifier,
            updateEmissionsMintedToken: this.updateEmissionsMintedToken,
            getUtilityIdentifier: this.getUtilityIdentifier,
            getAllUtilityIdentifiers: this.getAllUtilityIdentifiers,
            importUtilityFactor: this.importUtilityFactor,
            updateUtilityFactor: this.updateUtilityFactor,
            getUtilityFactor: this.getUtilityFactor,
            recordEmissions: this.recordEmissions,
            updateEmissionsRecord: this.updateEmissionsRecord,
            getEmissionsData: this.getEmissionsData,
            getAllEmissionsData: this.getAllEmissionsData,
            getAllEmissionsDataByDateRange: this.getAllEmissionsDataByDateRange,
            getAllEmissionsDataByDateRangeAndParty: this.getAllEmissionsDataByDateRangeAndParty,
            // for lockdata
            getValidEmissions: this.getValidEmissions,
        };
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async Init(_stub) {
        return fabric_shim_1.Shim.success(undefined);
    }
    async Invoke(stub) {
        const { fcn, params } = stub.getFunctionAndParameters();
        const method = this.methods[fcn];
        if (!method) {
            util_1.logger.error(`${const_1.ErrMethodNotSupported} : ${fcn} is not supported`);
            return fabric_shim_1.Shim.error(new TextEncoder().encode(`${const_1.ErrMethodNotSupported} : ${fcn} is not supported`));
        }
        return await method(stub, params);
    }
    async recordEmissions(stub, args) {
        util_1.logger.info(`recordEmissions method called with args : ${args}`);
        const fields = [
            'utilityId',
            'partyId',
            'fromDate',
            'thruDate',
            'energyUseAmount',
            'energyUseUom',
            'url',
            'md5',
        ];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const fieldsMap = {
            utilityId: null,
            partyId: null,
            fromDate: null,
            thruDate: null,
            energyUseAmount: null,
            energyUseUom: null,
            url: null,
            md5: null,
        };
        const fieldsLen = Math.min(args.length, fields.length);
        for (let i = 0; i < fieldsLen; i++) {
            fieldsMap[fields[i]] = args[i];
        }
        let byte;
        try {
            byte = await new emissionsRecordContract_1.EmissionsRecordContract(stub).recordEmissions(fieldsMap.utilityId, fieldsMap.partyId, fieldsMap.fromDate, fieldsMap.thruDate, fieldsMap.energyUseAmount, fieldsMap.energyUseUom, fieldsMap.url, fieldsMap.md5);
        }
        catch (error) {
            console.log(error);
            return fabric_shim_1.Shim.error((0, util_1.stringToBytes)(error.message));
        }
        util_1.logger.debug(`${const_1.MsgSuccess} recordEmissions success ${byte.toString()}`);
        return fabric_shim_1.Shim.success(byte);
    }
    async updateEmissionsRecord(stub, args) {
        const fields = [
            'uuid',
            'utilityId',
            'partyId',
            'fromDate',
            'thruDate',
            'emissionsAmount',
            'renewableEnergyUseAmount',
            'nonrenewableEnergyUseAmount',
            'energyUseUom',
            'factorSource',
            'url',
            'md5',
            'tokenId',
        ];
        const numberFields = [
            'emissionsAmount',
            'renewableEnergyUseAmount',
            'nonrenewableEnergyUseAmount',
        ];
        let recordI = {};
        const fieldsLen = Math.min(args.length, fields.length);
        for (let i = 0; i < fieldsLen; i++) {
            const v = args[i];
            if (numberFields.indexOf(fields[i]) > -1) {
                recordI = { ...recordI, [fields[i]]: Number(v) };
            }
            else {
                recordI = { ...recordI, [fields[i]]: v };
            }
        }
        let byte;
        try {
            byte = await new emissionsRecordContract_1.EmissionsRecordContract(stub).updateEmissionsRecord(recordI);
        }
        catch (error) {
            util_1.logger.error(error);
            return fabric_shim_1.Shim.error((0, util_1.stringToBytes)(error.message));
        }
        return fabric_shim_1.Shim.success(byte);
    }
    /**
     * @description will update emissions record(s) with minted token
     * @param args client input
     *      - args[0] : tokenId:string
     *      - args[1...] : uuids:Array<string>
     */
    async updateEmissionsMintedToken(stub, args) {
        util_1.logger.info(`updateEmissionsMintedToken method will args : ${args}`);
        if (args.length < 3) {
            util_1.logger.error(`${const_1.ErrInvalidArgument} : updateEmissionsMintedToken requires 3 or more args, but provided ${args.length}`);
            return fabric_shim_1.Shim.error((0, util_1.stringToBytes)(`${const_1.ErrInvalidArgument} : updateEmissionsMintedToken requires 3 or more args, but provided ${args.length}`));
        }
        const tokenId = args[0];
        const partyId = args[1];
        const uuids = args.slice(2);
        try {
            const out = await new emissionsRecordContract_1.EmissionsRecordContract(stub).updateEmissionsMintedToken(tokenId, partyId, uuids);
            return fabric_shim_1.Shim.success(out);
        }
        catch (error) {
            util_1.logger.error(error);
            return fabric_shim_1.Shim.error((0, util_1.stringToBytes)(error.message));
        }
    }
    async getEmissionsData(stub, args) {
        util_1.logger.info(`getEmissionsData method called with args : ${args}`);
        if (args.length !== 1) {
            util_1.logger.error(`${const_1.ErrInvalidNumberOfArgument} : getEmissionsData requires 1 arg , but provided ${args.length}`);
            return fabric_shim_1.Shim.error((0, util_1.stringToBytes)(`${const_1.ErrInvalidNumberOfArgument} : getEmissionsData requires 1 arg , but provided ${args.length}`));
        }
        let byte;
        try {
            byte = await new emissionsRecordContract_1.EmissionsRecordContract(stub).getEmissionsData(args[0]);
        }
        catch (error) {
            util_1.logger.error(error);
            return fabric_shim_1.Shim.error((0, util_1.stringToBytes)(error.message));
        }
        return fabric_shim_1.Shim.success(byte);
    }
    async getValidEmissions(stub, args) {
        util_1.logger.info(`getValidEmissions method called with args : ${args}`);
        let byte;
        try {
            byte = await new emissionsRecordContract_1.EmissionsRecordContract(stub).getValidEmissions(args);
            return fabric_shim_1.Shim.success(byte);
        }
        catch (error) {
            util_1.logger.error(error);
            return fabric_shim_1.Shim.error((0, util_1.stringToBytes)(error.message));
        }
    }
    async getAllEmissionsData(stub, args) {
        util_1.logger.info(`getAllEmissionsData method called with args : ${args}`);
        if (args.length !== 2) {
            util_1.logger.error(`${const_1.ErrInvalidNumberOfArgument} : getAllEmissionsData requires 2 arg , but provided ${args.length}`);
            return fabric_shim_1.Shim.error((0, util_1.stringToBytes)(`${const_1.ErrInvalidNumberOfArgument} : getAllEmissionsData requires 2 arg , but provided ${args.length}`));
        }
        let byte;
        try {
            byte = await new emissionsRecordContract_1.EmissionsRecordContract(stub).getAllEmissionsData(args[0], args[1]);
        }
        catch (error) {
            util_1.logger.error(error);
            return fabric_shim_1.Shim.error((0, util_1.stringToBytes)(error.message));
        }
        return fabric_shim_1.Shim.success(byte);
    }
    async getAllEmissionsDataByDateRange(stub, args) {
        util_1.logger.info(`getAllEmissionsDataByDateRange method called with args : ${args}`);
        if (args.length !== 2) {
            util_1.logger.error(`${const_1.ErrInvalidNumberOfArgument} : getAllEmissionsDataByDateRange requires 2 arg , but provided ${args.length}`);
            return fabric_shim_1.Shim.error((0, util_1.stringToBytes)(`${const_1.ErrInvalidNumberOfArgument} : getAllEmissionsDataByDateRange requires 2 arg , but provided ${args.length}`));
        }
        let byte;
        try {
            byte = await new emissionsRecordContract_1.EmissionsRecordContract(stub).getAllEmissionsDataByDateRange(args[0], args[1]);
        }
        catch (error) {
            util_1.logger.error(error);
            return fabric_shim_1.Shim.error((0, util_1.stringToBytes)(error.message));
        }
        return fabric_shim_1.Shim.success(byte);
    }
    async getAllEmissionsDataByDateRangeAndParty(stub, args) {
        util_1.logger.info(`getAllEmissionsDataByDateRangeAndParty method called with args : ${args}`);
        if (args.length !== 3) {
            util_1.logger.error(`${const_1.ErrInvalidNumberOfArgument} : getAllEmissionsDataByDateRangeAndParty requires 3 arg , but provided ${args.length}`);
            return fabric_shim_1.Shim.error((0, util_1.stringToBytes)(`${const_1.ErrInvalidNumberOfArgument} : getAllEmissionsDataByDateRangeAndParty requires 3 arg , but provided ${args.length}`));
        }
        let byte;
        try {
            byte = await new emissionsRecordContract_1.EmissionsRecordContract(stub).getAllEmissionsDataByDateRangeAndParty(args[0], args[1], args[2]);
        }
        catch (error) {
            util_1.logger.error(error);
            return fabric_shim_1.Shim.error((0, util_1.stringToBytes)(error.message));
        }
        return fabric_shim_1.Shim.success(byte);
    }
    /**
     * @param args : ['uuid', 'year', 'country',
     * 'division_type','division_id','division_name','net_generation',
     * 'net_generation_uom','co2_equivalent_emissions','co2_equivalent_emissions_uom',
     * 'source','non_renewables','renewables','percent_of_renewables']
     */
    async importUtilityFactor(stub, args) {
        util_1.logger.info(`importUtilityFactor method called with args : ${args}`);
        // uuid is required for importing utility factor
        if (args.length < 1) {
            util_1.logger.error(`${const_1.ErrInvalidNumberOfArgument} : importUtilityFactor method requires at-least 1 argument, but got ${args.length}`);
            return fabric_shim_1.Shim.error((0, util_1.stringToBytes)(`${const_1.ErrInvalidNumberOfArgument} : importUtilityFactor method requires at-least 1 argument, but got ${args.length}`));
        }
        // order of args input
        const fields = [
            'uuid',
            'year',
            'country',
            'division_type',
            'division_id',
            'division_name',
            'net_generation',
            'net_generation_uom',
            'co2_equivalent_emissions',
            'co2_equivalent_emissions_uom',
            'source',
            'non_renewables',
            'renewables',
            'percent_of_renewables',
        ];
        const min = Math.min(fields.length, args.length);
        const factorI = {
            uuid: args[0],
        };
        for (let i = 1; i < min; i++) {
            factorI[fields[i]] = args[i];
        }
        let byte;
        try {
            byte = await new emissionsRecordContract_1.EmissionsRecordContract(stub).importUtilityFactor(factorI);
        }
        catch (error) {
            util_1.logger.error(error);
            return fabric_shim_1.Shim.error((0, util_1.stringToBytes)(error.message));
        }
        util_1.logger.debug(`${const_1.MsgSuccess} importUtilityFactor success ${byte.toString()}`);
        return fabric_shim_1.Shim.success(byte);
    }
    /**
     * @param args : ['uuid', 'year', 'country',
     * 'division_type','division_id','division_name','net_generation',
     * 'net_generation_uom','co2_equivalent_emissions','co2_equivalent_emissions_uom',
     * 'source','non_renewables','renewables','percent_of_renewables']
     */
    async updateUtilityFactor(stub, args) {
        util_1.logger.info(`updateUtilityFactor method called with args : ${args}`);
        // uuid is required for importing utility factor
        if (args.length < 1) {
            util_1.logger.error(`${const_1.ErrInvalidNumberOfArgument} : updateUtilityFactor method requires at-least 1 argument, but got ${args.length}`);
            return fabric_shim_1.Shim.error((0, util_1.stringToBytes)(`${const_1.ErrInvalidNumberOfArgument} : updateUtilityFactor method requires at-least 1 argument, but got ${args.length}`));
        }
        // order of args input
        const fields = [
            'uuid',
            'year',
            'country',
            'division_type',
            'division_id',
            'division_name',
            'net_generation',
            'net_generation_uom',
            'co2_equivalent_emissions',
            'co2_equivalent_emissions_uom',
            'source',
            'non_renewables',
            'renewables',
            'percent_of_renewables',
        ];
        const min = Math.min(fields.length, args.length);
        const factorI = {
            uuid: args[0],
        };
        for (let i = 1; i < min; i++) {
            factorI[fields[i]] = args[i];
        }
        let byte;
        try {
            byte = await new emissionsRecordContract_1.EmissionsRecordContract(stub).updateUtilityFactor(factorI);
        }
        catch (error) {
            util_1.logger.error(error);
            return fabric_shim_1.Shim.error((0, util_1.stringToBytes)(error.message));
        }
        util_1.logger.debug(`${const_1.MsgSuccess} updateUtilityFactor success ${byte.toString()}`);
        return fabric_shim_1.Shim.success(byte);
    }
    /**
     * @param args : ['uuid']
     */
    async getUtilityFactor(stub, args) {
        util_1.logger.info(`getUtilityFactor method called with args : ${args}`);
        if (args.length !== 1) {
            util_1.logger.error(`${const_1.ErrInvalidNumberOfArgument} : getUtilityFactor requires 1 arg , but provided ${args.length}`);
            return fabric_shim_1.Shim.error((0, util_1.stringToBytes)(`${const_1.ErrInvalidNumberOfArgument} : getUtilityFactor requires 1 arg , but provided ${args.length}`));
        }
        let byte;
        try {
            byte = await new emissionsRecordContract_1.EmissionsRecordContract(stub).getUtilityFactor(args[0]);
        }
        catch (error) {
            util_1.logger.error(error);
            return fabric_shim_1.Shim.error((0, util_1.stringToBytes)(error.message));
        }
        return fabric_shim_1.Shim.success(byte);
    }
    /**
     * @param args : ['uuid', 'year', 'utility_number', 'utility_name', 'country', 'state_province', '{"division_type" : "","division_id" : ""}']
     */
    async importUtilityIdentifier(stub, args) {
        util_1.logger.info(`importUtilityIdentifier method called with args : ${args}`);
        // uuid is required for importing utility identifer
        if (args.length < 1) {
            util_1.logger.error(`${const_1.ErrInvalidNumberOfArgument} : importUtilityIdentifier method requires at-least 1 argument, but got ${args.length}`);
            return fabric_shim_1.Shim.error((0, util_1.stringToBytes)(`${const_1.ErrInvalidNumberOfArgument} : importUtilityIdentifier method requires at-least 1 argument, but got ${args.length}`));
        }
        const fields = [
            'uuid',
            'year',
            'utility_number',
            'utility_name',
            'country',
            'state_province',
            'divisions',
        ];
        const min = Math.min(args.length, fields.length);
        const identifier = { uuid: args[0] };
        for (let i = 1; i < min; i++) {
            const k = fields[i];
            const v = args[i];
            if (k === 'divisions') {
                let division;
                try {
                    division = JSON.parse(v);
                }
                catch (error) {
                    util_1.logger.error(`${const_1.ErrInvalidArgument} : invalid division json input ${error}`);
                    return fabric_shim_1.Shim.error((0, util_1.stringToBytes)(error.message));
                }
                identifier.divisions = division;
            }
            else {
                identifier[k] = v;
            }
        }
        let byte;
        try {
            byte = await new emissionsRecordContract_1.EmissionsRecordContract(stub).importUtilityIdentifier(identifier);
        }
        catch (error) {
            util_1.logger.error(error);
            return fabric_shim_1.Shim.error((0, util_1.stringToBytes)(error.message));
        }
        util_1.logger.debug(`${const_1.MsgSuccess} importUtilityIdentifier success ${byte.toString()}`);
        return fabric_shim_1.Shim.success(byte);
    }
    /**
     * @param args : ['uuid', 'year', 'utility_number', 'utility_name', 'country', 'state_province', '{"division_type" : "","division_id" : ""}']
     */
    async updateUtilityIdentifier(stub, args) {
        util_1.logger.info(`updateUtilityIdentifier method called with args : ${args}`);
        // uuid is required for importing utility identifer
        if (args.length < 1) {
            util_1.logger.error(`${const_1.ErrInvalidNumberOfArgument} : updateUtilityIdentifier method requires at-least 1 argument, but got ${args.length}`);
            return fabric_shim_1.Shim.error((0, util_1.stringToBytes)(`${const_1.ErrInvalidNumberOfArgument} : updateUtilityIdentifier method requires at-least 1 argument, but got ${args.length}`));
        }
        const fields = [
            'uuid',
            'year',
            'utility_number',
            'utility_name',
            'country',
            'state_province',
            'divisions',
        ];
        const min = Math.min(args.length, fields.length);
        const identifier = { uuid: args[0] };
        for (let i = 1; i < min; i++) {
            const k = fields[i];
            const v = args[i];
            if (k === 'divisions') {
                // division exists
                const divisionJSON = JSON.parse(v);
                let division;
                if (divisionJSON.division_type && divisionJSON.division_id) {
                    division = {
                        division_id: divisionJSON.division_id,
                        division_type: divisionJSON.division_type,
                    };
                }
                else {
                    util_1.logger.error(`${const_1.ErrInvalidArgument} : invalid division , got : ${v}`);
                    return fabric_shim_1.Shim.error((0, util_1.stringToBytes)(`${const_1.ErrInvalidArgument} : division should represented by : '{"division_type" : "","division_id" : ""}`));
                }
                identifier.divisions = division;
            }
            else {
                identifier[k] = v;
            }
        }
        let byte;
        try {
            byte = await new emissionsRecordContract_1.EmissionsRecordContract(stub).updateUtilityIdentifier(identifier);
        }
        catch (error) {
            util_1.logger.error(error);
            return fabric_shim_1.Shim.error((0, util_1.stringToBytes)(error.message));
        }
        util_1.logger.debug(`${const_1.MsgSuccess} updateUtilityIdentifier success ${byte.toString()}`);
        return fabric_shim_1.Shim.success(byte);
    }
    /**
     * @param args : ['uuid']
     */
    async getUtilityIdentifier(stub, args) {
        util_1.logger.info(`getUtilityIdentifier method called with args : ${args}`);
        if (args.length !== 1) {
            util_1.logger.error(`${const_1.ErrInvalidNumberOfArgument} : getUtilityIdentifier requires 1 arg , but provided ${args.length}`);
            return fabric_shim_1.Shim.error((0, util_1.stringToBytes)(`${const_1.ErrInvalidNumberOfArgument} : getUtilityIdentifier requires 1 arg , but provided ${args.length}`));
        }
        let byte;
        try {
            byte = await new emissionsRecordContract_1.EmissionsRecordContract(stub).getUtilityIdentifier(args[0]);
        }
        catch (error) {
            util_1.logger.error(error);
            return fabric_shim_1.Shim.error((0, util_1.stringToBytes)(error.message));
        }
        util_1.logger.debug(`${const_1.MsgSuccess} getUtilityIdentifier success ${byte.toString()}`);
        return fabric_shim_1.Shim.success(byte);
    }
    async getAllUtilityIdentifiers(stub, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _args) {
        let byte;
        try {
            byte = await new emissionsRecordContract_1.EmissionsRecordContract(stub).getAllUtilityIdentifiers();
        }
        catch (error) {
            util_1.logger.error(error);
            return fabric_shim_1.Shim.error((0, util_1.stringToBytes)(error.message));
        }
        return fabric_shim_1.Shim.success(byte);
    }
}
fabric_shim_1.Shim.start(new EmissionsChaincode());
//# sourceMappingURL=index.js.map