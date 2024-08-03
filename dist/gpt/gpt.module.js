"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GptModule = void 0;
const common_1 = require("@nestjs/common");
const gpt_service_1 = require("./gpt.service");
const config_1 = require("@nestjs/config");
let GptModule = class GptModule {
};
GptModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule.forRoot()],
        providers: [gpt_service_1.GptService, config_1.ConfigService],
        exports: [gpt_service_1.GptService],
    })
], GptModule);
exports.GptModule = GptModule;
//# sourceMappingURL=gpt.module.js.map