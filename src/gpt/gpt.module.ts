import { Module } from "@nestjs/common";
import { GptService } from "./gpt.service";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [GptService, ConfigService],
  exports: [GptService], // Exporting the service to make it available in other modules
})
export class GptModule {}
