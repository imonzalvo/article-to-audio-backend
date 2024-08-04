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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const article_schema_1 = require("./article.schema");
const user_service_1 = require("../user/user.service");
const scraper_service_1 = require("./scraper.service");
const gpt_service_1 = require("../gpt/gpt.service");
const polly_service_1 = require("../polly/polly.service");
const user_schema_1 = require("../user/user.schema");
const mongoose_3 = require("mongoose");
let ArticleService = class ArticleService {
    constructor(articleModel, userModel, userService, scraperService, gptService, pollyService) {
        this.articleModel = articleModel;
        this.userModel = userModel;
        this.userService = userService;
        this.scraperService = scraperService;
        this.gptService = gptService;
        this.pollyService = pollyService;
    }
    async createFromUrl(url, userId, sendUpdate) {
        const user = await this.userService.findOne(userId);
        if (!user) {
            throw new common_1.BadRequestException("User not found");
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const userObjectId = new mongoose_3.Types.ObjectId(userId);
        const articlesCreatedToday = await this.articleModel.countDocuments({
            user: userObjectId,
            created_at: { $gte: today },
        });
        if (articlesCreatedToday >= 30) {
            throw new common_1.BadRequestException("You have reached the daily limit of 3 articles");
        }
        sendUpdate({ progress: 10, message: "Reading article..." });
        const { title, content, author } = await this.scraperService.scrapeArticle(url);
        if (!title || !content) {
            throw new common_1.BadRequestException("Failed to scrape article: missing title or content");
        }
        sendUpdate({ progress: 30, message: 1 });
        const summary = await this.gptService.summarizeText(content);
        sendUpdate({ progress: 60, message: 2 });
        const audioKey = await this.pollyService.textToSpeech(summary, "article-to-audio");
        sendUpdate({ progress: 90, message: 3 });
        const createdArticle = new this.articleModel({
            title,
            content,
            summary,
            user: user._id,
            summaryAudioKey: audioKey,
            originalAuthor: author || "Unknown Author",
            sourceUrl: url,
        });
        const savedArticle = await createdArticle.save();
        await this.userModel.findByIdAndUpdate(userId, { $push: { articles: savedArticle._id } }, { new: true, useFindAndModify: false });
        sendUpdate({ progress: 100, message: 4 });
        return savedArticle;
    }
    async findOne(id) {
        return (this.articleModel
            .findById(id)
            .exec());
    }
    async findByUser(userId) {
        const userObjectId = new mongoose_3.Types.ObjectId(userId);
        return this.articleModel.find({ user: userObjectId }).exec();
    }
    generatePublicUrl(key) {
        const bucketName = "article-to-audio";
        const region = "us-east-1";
        return `https://${bucketName}.s3.amazonaws.com/test/${key}`;
    }
};
ArticleService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(article_schema_1.Article.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        user_service_1.UserService,
        scraper_service_1.ScraperService,
        gpt_service_1.GptService,
        polly_service_1.PollyService])
], ArticleService);
exports.ArticleService = ArticleService;
//# sourceMappingURL=article.service.js.map