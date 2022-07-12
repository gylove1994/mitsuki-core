"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const first_module_1 = require("./first-module");
const mitsuki_core_1 = require("../core/mitsuki-core");
const api_setting_1 = require("./api-setting");
const mitsuki = (0, mitsuki_core_1.MitsukiFactory)(first_module_1.FirstModule, api_setting_1.api.apiSetting);
mitsuki.ready();
//# sourceMappingURL=index.js.map