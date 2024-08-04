import {
  Controller,
  Req,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
} from "@nestjs/common";
import { ArticleService } from "./article.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("articles")
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @UseGuards(JwtAuthGuard)
  @Post("scrape")
  createFromUrl(@Req() req, @Body() body: { url: string }) {
    const userId = req.user.userId;
    console.log("convirtiendo");
    return this.articleService.createFromUrl(body.url, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get("audio-keys")
  async getAudioKeys(@Req() req): Promise<any[]> {
    const userId = req.user.userId;
    console.log("user", userId);
    const articles = await this.articleService.findByUser(userId);
    return articles.map((article) => ({
      id: article._id,
      title: article.title,
      url: this.articleService.generatePublicUrl(article.summaryAudioKey),
    }));
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.articleService.findOne(id);
  }
}
