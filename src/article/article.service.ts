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

  async createFromUrl(url: string, userId: string): Promise<Article> {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new BadRequestException("User not found");
    }

    const { title, content, author } = await this.scraperService.scrapeArticle(
      url
    );

    if (!title || !content) {
      throw new BadRequestException(
        "Failed to scrape article: missing title or content"
      );
    }

    const summary = await this.gptService.summarizeText(content);
    const audioKey = await this.pollyService.textToSpeech(
      summary,
      "article-to-audio"
    ); // Replace with your actual S3 bucket name

    const createdArticle = new this.articleModel({
      title,
      content,
      summary,
      user: user._id,
      summaryAudioKey: audioKey, // Store the S3 key of the audio file
      originalAuthor: author || "Unknown Author",
      sourceUrl: url,
    });

    const savedArticle = await createdArticle.save();

    // Update the user's articles list
    await this.userModel.findByIdAndUpdate(
      userId,
      { $push: { articles: savedArticle._id } },
      { new: true, useFindAndModify: false }
    );

    return savedArticle;
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
