"use strict";
exports.__esModule = true;
exports.mitsukiLoggerFactory = void 0;
var chalk_1 = require("chalk");
var winston_1 = require("winston");
function mitsukiLoggerFactory(label) {
    var logger = winston_1["default"].createLogger({
        format: winston_1.format.combine(winston_1.format.colorize(), winston_1.format.label({ label: label }), winston_1.format.ms(), winston_1.format.json(), winston_1.format.printf(function (_a) {
            var level = _a.level, label = _a.label, message = _a.message, ms = _a.ms;
            return "[".concat(chalk_1["default"].yellow('pid:' + process.pid), "] [").concat(chalk_1["default"].blue(label), "] [").concat(level, "] ").concat(chalk_1["default"].rgb(200, 200, 200)(message), " ").concat(chalk_1["default"].yellowBright(ms));
        })),
        transports: [new winston_1["default"].transports.Console()]
    });
    return logger;
}
exports.mitsukiLoggerFactory = mitsukiLoggerFactory;
