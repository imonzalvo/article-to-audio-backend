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
var PollyService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PollyService = void 0;
const common_1 = require("@nestjs/common");
const AWS = require("aws-sdk");
const uuid_1 = require("uuid");
let PollyService = PollyService_1 = class PollyService {
    constructor() {
        this.logger = new common_1.Logger(PollyService_1.name);
        AWS.config.update({
            region: "us-east-1",
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        });
        this.polly = new AWS.Polly();
        this.s3 = new AWS.S3();
    }
    async textToSpeech(text, bucketName) {
        const params = {
            Text: text,
            OutputFormat: "mp3",
            VoiceId: "Ruth",
            Engine: "generative",
        };
        const { AudioStream } = await this.polly.synthesizeSpeech(params).promise();
        const audioKey = `${(0, uuid_1.v4)()}.mp3`;
        const s3Params = {
            Bucket: bucketName,
            Key: `test/${audioKey}`,
            Body: AudioStream,
            ContentType: "audio/mpeg",
        };
        await this.s3.upload(s3Params).promise();
        this.logger.log(`Audio content stored at: ${audioKey}`);
        return audioKey;
    }
};
PollyService = PollyService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PollyService);
exports.PollyService = PollyService;
//# sourceMappingURL=polly.service.js.map