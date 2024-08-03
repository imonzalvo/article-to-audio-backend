import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { Article, ArticleSchema } from './article.schema';
import { UserModule } from '../user/user.module';
import { GptModule } from '../gpt/gpt.module';
import { ScraperService } from './scraper.service';
import { PollyModule } from 'src/polly/polly.module';
import { User, UserSchema } from 'src/user/user.schema';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Article.name, schema: ArticleSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    UserModule,
    GptModule,
    PollyModule
  ],
  controllers: [ArticleController],
  providers: [ArticleService, ScraperService],
})
export class ArticleModule {}