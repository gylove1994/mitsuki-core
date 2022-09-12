"use strict";
exports.__esModule = true;
exports.isOperatorFunction = exports.isChatMessage = exports.isFriendMessage = exports.isGroupMessage = void 0;
var rxjs_1 = require("rxjs");
function isGroupMessage(val) {
    if (val.type == 'GroupMessage') {
        return true;
    }
    else {
        return false;
    }
}
exports.isGroupMessage = isGroupMessage;
function isFriendMessage(val) {
    if (val.type == 'FriendMessage') {
        return true;
    }
    else {
        return false;
    }
}
exports.isFriendMessage = isFriendMessage;
function isChatMessage(val) {
    if (val.type == 'FriendMessage' || val.type == 'FriendMessage' || val.type == 'TempMessage') {
        return true;
    }
    else {
        return false;
    }
}
exports.isChatMessage = isChatMessage;
function isOperatorFunction(val) {
    try {
        new rxjs_1.Observable().pipe(val);
        return true;
    }
    catch (err) {
        return false;
    }
}
exports.isOperatorFunction = isOperatorFunction;
