"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.msgData = exports.ORIGIN_METHOD = exports.DES_PARAM_TYPE = exports.PARAM_TYPE = exports.METHOD_TYPE = exports.CLASS_TYPE = exports.MODULES_OPTIONS = exports.OUTER_METADATA = exports.INIT_METADATA = exports.CONTAINER_METADATA = exports.PARAM_METADATA = exports.METHOD_METADATA = exports.PROVIDER_METADATA = exports.CONTROLLER_METADATA = void 0;
//元信息的value
exports.CONTROLLER_METADATA = 'ioc:controller';
exports.PROVIDER_METADATA = 'ioc:provider';
exports.METHOD_METADATA = 'ioc:method';
exports.PARAM_METADATA = 'ioc:param';
exports.CONTAINER_METADATA = 'ioc:container';
exports.INIT_METADATA = 'ioc:init';
exports.OUTER_METADATA = 'ioc:outer_class';
//元信息的key
exports.MODULES_OPTIONS = 'moduleOptions';
exports.CLASS_TYPE = 'classType';
exports.METHOD_TYPE = 'methodType';
exports.PARAM_TYPE = 'paramType';
exports.DES_PARAM_TYPE = 'design:paramtypes';
exports.ORIGIN_METHOD = 'originMethod';
class msgData {
    constructor(data) {
        this.data = data;
    }
}
exports.msgData = msgData;
//# sourceMappingURL=types.js.map