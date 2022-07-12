"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirstModule = void 0;
const first_controller_1 = require("./first-controller");
const first_service_1 = require("./first-service");
const decorators_1 = require("../core/decorators");
const api_setting_1 = require("./api-setting");
let FirstModule = class FirstModule {
};
FirstModule = __decorate([
    (0, decorators_1.Module)({
        imports: [api_setting_1.api],
        controllers: [first_controller_1.FirstController],
        providers: [first_service_1.FirstService],
        modules: []
    })
], FirstModule);
exports.FirstModule = FirstModule;
//# sourceMappingURL=first-module.js.map