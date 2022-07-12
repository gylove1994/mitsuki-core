"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirstController = void 0;
const mitsuki_core_1 = require("./../core/mitsuki-core");
const first_service_1 = require("./first-service");
const decorators_1 = require("../core/decorators");
let FirstController = class FirstController {
    constructor(firstService) {
        this.firstService = firstService;
    }
    helloMitsuki(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.firstService.helloMitsuki(msg.data);
        });
    }
    saveToTempDatabase(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.firstService.saveToTempDatabase(msg.data);
        });
    }
    online() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('bot上线啦！！！！！');
        });
    }
};
__decorate([
    (0, decorators_1.FriendMessage)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mitsuki_core_1.FriendMessageData]),
    __metadata("design:returntype", Promise)
], FirstController.prototype, "helloMitsuki", null);
__decorate([
    (0, decorators_1.GroupMessage)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mitsuki_core_1.GroupMessageData]),
    __metadata("design:returntype", Promise)
], FirstController.prototype, "saveToTempDatabase", null);
__decorate([
    (0, decorators_1.BotOnlineEvent)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FirstController.prototype, "online", null);
FirstController = __decorate([
    (0, decorators_1.Controller)(),
    __metadata("design:paramtypes", [first_service_1.FirstService])
], FirstController);
exports.FirstController = FirstController;
//# sourceMappingURL=first-controller.js.map