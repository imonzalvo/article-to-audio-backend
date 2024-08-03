"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const article_controller_1 = require("./article.controller");
const article_service_1 = require("./article.service");
const article_schema_1 = require("./article.schema");
const user_module_1 = require("../user/user.module");
const gpt_module_1 = require("../gpt/gpt.module");
const scraper_service_1 = require("./scraper.service");
const polly_module_1 = require("../polly/polly.module");
const user_schema_1 = require("../user/user.schema");
let ArticleModule = class ArticleModule {
};
ArticleModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: article_schema_1.Article.name, schema: article_schema_1.ArticleSchema }]),
            mongoose_1.MongooseModule.forFeature([{ name: user_schema_1.User.name, schema: user_schema_1.UserSchema }]),
            user_module_1.UserModule,
            gpt_module_1.GptModule,
            polly_module_1.PollyModule
        ],
        controllers: [article_controller_1.ArticleController],
        providers: [article_service_1.ArticleService, scraper_service_1.ScraperService],
    })
], ArticleModule);
exports.ArticleModule = ArticleModule;
//# sourceMappingURL=article.module.js.map