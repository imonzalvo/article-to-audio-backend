import { Model } from "mongoose";
import { Article, ArticleDocument } from "./article.schema";
import { UserService } from "../user/user.service";
import { ScraperService } from "./scraper.service";
import { GptService } from "../gpt/gpt.service";
import { PollyService } from "src/polly/polly.service";
import { User } from "../user/user.schema";
export declare class ArticleService {
    private articleModel;
    private userModel;
    private userService;
    private scraperService;
    private gptService;
    private pollyService;
    constructor(articleModel: Model<ArticleDocument>, userModel: Model<User>, userService: UserService, scraperService: ScraperService, gptService: GptService, pollyService: PollyService);
    createFromUrl(url: string, userId: string, sendUpdate: (data: any) => void): Promise<Article>;
    findOne(id: string): Promise<Article>;
    findByUser(userId: string): Promise<Article[]>;
    generatePublicUrl(key: string): string;
}
