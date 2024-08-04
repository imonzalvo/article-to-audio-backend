import {
  Controller,
  Req,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Res,
  BadRequestException,
} from "@nestjs/common";
import { Response } from "express";

import { ArticleService } from "./article.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("articles")
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @UseGuards(JwtAuthGuard)
  @Post("scrape")
  async createFromUrl(
    @Req() req,
    @Body() body: { url: string },
    @Res() res: Response
  ) {
    const userId = req.user.userId;
    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Transfer-Encoding", "chunked");

    const sendUpdate = (data: any) => {
      res.write(JSON.stringify(data) + "\n");
    };

    try {
      await this.articleService.createFromUrl(body.url, userId, sendUpdate);
      res.end();
    } catch (error) {
      if (error instanceof BadRequestException) {
        sendUpdate({ error: error.message, status: 400 });
      } else {
        sendUpdate({ error: "An unexpected error occurred", status: 500 });
      }
      res.end();
    }
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
