import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Article, ArticleDocument } from "./article.schema";
import { CreateArticleDto } from "./dto/create-article.dto";
import { UserService } from "../user/user.service";
import { ScraperService } from "./scraper.service";
import { GptService } from "../gpt/gpt.service";
import { PollyService } from "src/polly/polly.service";
import { User } from "../user/user.schema";
import { Types } from "mongoose";

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
    @InjectModel(User.name) private userModel: Model<User>,
    private userService: UserService,
    private scraperService: ScraperService,
    private gptService: GptService,
    private pollyService: PollyService
  ) {}

  async createFromUrl(
    url: string,
    userId: string,
    sendUpdate: (data: any) => void
  ): Promise<Article> {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new BadRequestException("User not found");
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const userObjectId = new Types.ObjectId(userId);

    const articlesCreatedToday = await this.articleModel.countDocuments({
      user: userObjectId,
      created_at: { $gte: today },
    });

    // Check if the user has reached the daily limit
    if (articlesCreatedToday >= 2) {
      throw new BadRequestException(
        "You have reached the daily limit of 3 articles"
      );
    }

    sendUpdate({ progress: 10, message: "Reading article..." });
    const { title, content, author } = await this.scraperService.scrapeArticle(
      url
    );

    console.log("aritcle", author)

    if (!title || !content) {
      throw new BadRequestException(
        "Failed to scrape article: missing title or content"
      );
    }

    // sendUpdate({ progress: 30, message: "Summarizing content..." });
    // const summary = await this.gptService.summarizeText(content);

    // sendUpdate({ progress: 60, message: "Converting to speech..." });
    // const audioKey = await this.pollyService.textToSpeech(
    //   summary,
    //   "article-to-audio"
    // );

    // sendUpdate({ progress: 90, message: "Saving article..." });
    // const createdArticle = new this.articleModel({
    //   title,
    //   content,
    //   summary,
    //   user: user._id,
    //   summaryAudioKey: audioKey,
    //   originalAuthor: author || "Unknown Author",
    //   sourceUrl: url,
    // });

    // const savedArticle = await createdArticle.save();

    // await this.userModel.findByIdAndUpdate(
    //   userId,
    //   { $push: { articles: savedArticle._id } },
    //   { new: true, useFindAndModify: false }
    // );

    // sendUpdate({ progress: 100, message: "Article processing complete" });

    // return savedArticle;
    return null;
  }

  async findOne(id: string): Promise<Article> {
    return (
      this.articleModel
        .findById(id)
        // .populate('user')
        .exec()
    );
  }

  async findByUser(userId: string): Promise<Article[]> {
    const userObjectId = new Types.ObjectId(userId);
    return this.articleModel.find({ user: userObjectId }).exec();
  }

  generatePublicUrl(key: string): string {
    const bucketName = "article-to-audio";
    const region = "us-east-1";

    return `https://${bucketName}.s3.amazonaws.com/test/${key}`;
  }
}
