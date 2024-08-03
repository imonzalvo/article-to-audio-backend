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
var GptService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GptService = void 0;
const common_1 = require("@nestjs/common");
const openai_1 = require("openai");
const config_1 = require("@nestjs/config");
let GptService = GptService_1 = class GptService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(GptService_1.name);
        const apiKey = this.configService.get('OPENAI_API_KEY');
        if (!apiKey) {
            throw new Error('OPENAI_API_KEY environment variable is missing or empty');
        }
        this.openai = new openai_1.OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }
    async summarizeText(text) {
        var _a, _b;
        try {
            const response = await this.openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: 'You are an assistant that summarizes articles in spanish.' },
                    { role: 'user', content: `Please summarize the following text: ${text} in spanish.` },
                ],
                max_tokens: 150,
            });
            const summary = ((_b = (_a = response.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content.trim()) || '';
            return summary;
        }
        catch (error) {
            this.logger.error(`Failed to summarize text: ${error.message}`);
            throw new Error(`Failed to summarize text: ${error.message}`);
        }
    }
};
GptService = GptService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], GptService);
exports.GptService = GptService;
//# sourceMappingURL=gpt.service.js.map