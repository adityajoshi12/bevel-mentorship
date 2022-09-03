"use strict";
/*
    SPDX-License-Identifier: Apache-2.0
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorldState = void 0;
const state_1 = require("./state");
const const_1 = require("./const");
class WorldState extends state_1.State {
    constructor(stub) {
        // keys are not used for the WorldState class
        super([]);
        this.stub = stub;
    }
    async addState(id, asset) {
        let error = undefined;
        try {
            await this.getState(id);
        }
        catch (err) {
            error = err;
        }
        if (!error) {
            throw new Error(`${const_1.ErrStateAlreadyExists} : asset with ID = ${id} already exists`);
        }
        return await this.stub.putState(id, state_1.State.serialize(asset));
    }
    async updateState(id, asset) {
        // check if asset exists or not
        await this.getState(id);
        return await this.stub.putState(id, state_1.State.serialize(asset));
    }
    async getState(id) {
        const byteState = await this.stub.getState(id);
        if (!byteState || byteState.length === 0) {
            throw new Error(`${const_1.ErrStateNotFound} : asset with ID = ${id} not found`);
        }
        return state_1.State.deserialize(byteState);
    }
    async query(queryString = `{"selector": {}}`) {
        let iterator;
        try {
            iterator = await this.stub.getQueryResult(queryString);
        }
        catch (error) {
            throw new Error(`${const_1.ErrInvalidQueryString} : ${error.message}`);
        }
        return await this.getAssetFromIterator(iterator);
    }
    async getAssetFromIterator(iterator) {
        const out = [];
        let result = await iterator.next();
        while (!result.done) {
            try {
                out.push({
                    Key: result.value.key,
                    Record: state_1.State.deserialize(result.value.value),
                });
                result = await iterator.next();
            }
            catch (error) {
                break;
            }
        }
        iterator.close();
        return out;
    }
}
exports.WorldState = WorldState;
//# sourceMappingURL=worldstate.js.map