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
exports.ArticleController = void 0;
const common_1 = require("@nestjs/common");
const article_service_1 = require("./article.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let ArticleController = class ArticleController {
    constructor(articleService) {
        this.articleService = articleService;
    }
    async createFromUrl(req, body, res) {
        const userId = req.user.userId;
        res.setHeader("Content-Type", "text/plain");
        res.setHeader("Transfer-Encoding", "chunked");
        const sendUpdate = (data) => {
            res.write(JSON.stringify(data) + "\n");
        };
        try {
            await this.articleService.createFromUrl(body.url, userId, sendUpdate);
            res.end();
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                sendUpdate({ error: error.message, status: 400 });
            }
            else {
                console.log("error: ", error);
                sendUpdate({ error: "An unexpected error occurred", status: 500 });
            }
            res.end();
        }
    }
    async getAudioKeys(req) {
        const userId = req.user.userId;
        console.log("user", userId);
        const articles = await this.articleService.findByUser(userId);
        return articles.map((article) => ({
            id: article._id,
            title: article.title,
            url: this.articleService.generatePublicUrl(article.summaryAudioKey),
        }));
    }
    findOne(id) {
        return this.articleService.findOne(id);
    }
};
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)("scrape"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "createFromUrl", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)("audio-keys"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "getAudioKeys", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ArticleController.prototype, "findOne", null);
ArticleController = __decorate([
    (0, common_1.Controller)("articles"),
    __metadata("design:paramtypes", [article_service_1.ArticleService])
], ArticleController);
exports.ArticleController = ArticleController;
//# sourceMappingURL=article.controller.js.map