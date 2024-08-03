import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { ArticleModule } from './article/article.module';
import { GptModule } from './gpt/gpt.module';
import { ConfigModule } from '@nestjs/config';
import { PollyModule } from './polly/polly.module';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    UserModule,
    ArticleModule,
    AuthModule,
    GptModule,
    PollyModule
  ],
})
export class AppModule {}