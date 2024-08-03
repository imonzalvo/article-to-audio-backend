import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { PollyService } from "./polly.service";
@Module({
  imports: [ConfigModule.forRoot()],
  providers: [PollyService, ConfigService],
  exports: [PollyService],
})

export class PollyModule {}
