import { MiraiApiHttpSetting } from "mirai-ts";

class ApiSetting{
  public apiSetting:MiraiApiHttpSetting;
  constructor(api:MiraiApiHttpSetting){
    this.apiSetting = api;
  }
}


export const api = new ApiSetting({
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
})