"use strict";
/*
    SPDX-License-Identifier: Apache-2.0
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmissionRecordState = exports.EmissionsRecord = void 0;
const state_1 = require("../util/state");
const worldstate_1 = require("../util/worldstate");
// EMISSION_CLASS_IDENTIFIER : identifier for emissions record inside HL Fabric
const EMISSION_CLASS_IDENTIFIER = 'org.hyperledger.blockchain-carbon-accounting.emissionsrecord';
/**
 * EmissionsRecord class extends State class
 * Class will be used by application and smart contract to define a paper
 */
class EmissionsRecord extends state_1.State {
    constructor(_record) {
        super([
            _record.utilityId || '',
            _record.partyId || '',
            _record.fromDate || '',
            _record.thruDate || '',
        ]);
        this.record = _record;
        this.record.class = EMISSION_CLASS_IDENTIFIER;
        this.record.key = this.getKey();
    }
    toBuffer() {
        return state_1.State.serialize(this.record);
    }
    fromBuffer(buf) {
        return new EmissionsRecord(state_1.State.deserialize(buf));
    }
}
exports.EmissionsRecord = EmissionsRecord;
/**
 * EmissionsRecordWorldState class is wrapper around chaincode stub
 * for managing lifecycle of a EmissionRecord
 */
class EmissionRecordState extends worldstate_1.WorldState {
    constructor(stub) {
        super(stub);
    }
    async addEmissionsRecord(record, uuid) {
        return await this.addState(uuid, record.record);
    }
    async getEmissionsRecord(uuid) {
        return new EmissionsRecord(await this.getState(uuid));
    }
    async updateEmissionsRecord(record, uuid) {
        return await this.updateState(uuid, record.record);
    }
    async getAllEmissionRecords(utilityId, partyId) {
        const queryString = `{"selector": {"class": "${EMISSION_CLASS_IDENTIFIER}","utilityId": "${utilityId}", "partyId": "${partyId}"}}`;
        return await this.query(queryString);
    }
    async getAllEmissionsDataByDateRange(fromDate, thruDate) {
        const queryString = `{
      "selector": {
        "class": {
           "$eq": "${EMISSION_CLASS_IDENTIFIER}"
        },
        "fromDate": {
          "$gte": "${fromDate}"
        },
        "thruDate": {
          "$lte": "${thruDate}"
        }
      }
    }`;
        return await this.query(queryString);
    }
    async getAllEmissionsDataByDateRangeAndParty(fromDate, thruDate, partyId) {
        const queryString = `{
      "selector": {
        "class": {
          "$eq": "${EMISSION_CLASS_IDENTIFIER}"
        },
        "fromDate": {
          "$gte": "${fromDate}"
        },
        "thruDate": {
          "$lte": "${thruDate}"
        },
        "partyId": {
          "$eq": "${partyId}"
        }
      }
    }`;
        return this.query(queryString);
    }
}
exports.EmissionRecordState = EmissionRecordState;
//# sourceMappingURL=emissions.js.map