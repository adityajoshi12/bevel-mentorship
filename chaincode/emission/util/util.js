"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringToBytes = exports.logger = void 0;
const fabric_shim_1 = require("fabric-shim");
// logger : provide global logger for logging
exports.logger = fabric_shim_1.Shim.newLogger('EMISSION_RECORD_CHAINCODE');
const encoder = new TextEncoder();
const stringToBytes = (msg) => {
    return encoder.encode(msg);
};
exports.stringToBytes = stringToBytes;
//# sourceMappingURL=util.js.map