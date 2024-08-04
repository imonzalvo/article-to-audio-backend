import { Response } from "express";
import { ArticleService } from "./article.service";
export declare class ArticleController {
    private readonly articleService;
    constructor(articleService: ArticleService);
    createFromUrl(req: any, body: {
        url: string;
    }, res: Response): Promise<void>;
    getAudioKeys(req: any): Promise<any[]>;
    findOne(id: string): Promise<import("./article.schema").Article>;
}
