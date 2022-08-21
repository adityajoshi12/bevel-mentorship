"use strict";
/*
    SPDX-License-Identifier: Apache-2.0
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtilityLookupItemState = exports.UtilityLookupItem = exports.UTILITY_LOOKUP_ITEM_CLASS_IDENTIFIER = void 0;
const state_1 = require("../util/state");
const worldstate_1 = require("../util/worldstate");
/* tslint:disable:max-classes-per-file */
exports.UTILITY_LOOKUP_ITEM_CLASS_IDENTIFIER = 'org.hyperledger.blockchain-carbon-accounting.utilitylookuplist';
class UtilityLookupItem extends state_1.State {
    constructor(_item) {
        super([_item.uuid]);
        this.item = _item;
        this.item.class = exports.UTILITY_LOOKUP_ITEM_CLASS_IDENTIFIER;
        this.item.key = this.getKey();
    }
    toBuffer() {
        return state_1.State.serialize(this.item);
    }
    fromBuffer(buf) {
        return new UtilityLookupItem(state_1.State.deserialize(buf));
    }
}
exports.UtilityLookupItem = UtilityLookupItem;
class UtilityLookupItemState extends worldstate_1.WorldState {
    constructor(stub) {
        super(stub);
    }
    async addUtilityLookupItem(item, uuid) {
        return await this.addState(uuid, item.item);
    }
    async getUtilityLookupItem(uuid) {
        return new UtilityLookupItem(await this.getState(uuid));
    }
    async getAllUtilityLookupItems() {
        const queryString = `{"selector": {"class": "${exports.UTILITY_LOOKUP_ITEM_CLASS_IDENTIFIER}"}}`;
        return await this.query(queryString);
    }
    async updateUtilityLookupItem(item, uuid) {
        return await this.updateState(uuid, item.item);
    }
}
exports.UtilityLookupItemState = UtilityLookupItemState;
//# sourceMappingURL=utilityLookupItem.js.map