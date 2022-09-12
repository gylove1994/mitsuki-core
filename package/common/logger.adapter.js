"use strict";
exports.__esModule = true;
exports.Logger = void 0;
var logger_factory_1 = require("./logger.factory");
//todo 待更改
var Logger = /** @class */ (function () {
    function Logger() {
    }
    //todo 返回值类型可限定
    Logger.getLogger = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return this.loggerInstanceFactory ? this.loggerInstanceFactory.apply(this, args) : logger_factory_1.mitsukiLoggerFactory.apply(void 0, args);
    };
    return Logger;
}());
exports.Logger = Logger;
