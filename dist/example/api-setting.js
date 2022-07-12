"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
class ApiSetting {
    constructor(api) {
        this.apiSetting = api;
    }
}
exports.api = new ApiSetting({
    "adapters": ["http", "ws"],
    "enableVerify": false,
    "verifyKey": "1145141919",
    "debug": true,
    "singleMode": true,
    "cacheSize": 4096,
    "adapterSettings": {
        "http": {
            "port": 8081,
            "host": "localhost",
            "cors": ["*"]
        },
        "ws": {
            "port": 8080,
            "host": "localhost"
        }
    }
});
//# sourceMappingURL=api-setting.js.map