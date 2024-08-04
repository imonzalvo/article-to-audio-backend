import { Injectable, Logger } from "@nestjs/common";
import { OpenAI } from "openai";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class GptService {
  private readonly logger = new Logger(GptService.name);
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>("OPENAI_API_KEY");
    if (!apiKey) {
      throw new Error(
        "OPENAI_API_KEY environment variable is missing or empty"
      );
    }

    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  /* 
    - 1 token -> 3/4 words
    - 1 article ~2200 words
    - Summary? 3000
  */

  async summarizeText(text: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model:
          // 'gpt-4',
          //
          "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are an assistant that explains articles to users. Your work will be then read by a locutor on a podacast that users will listen while commuting. 
          You have the ability to explain articles without losing any important information. You should not mention the word "podcast" or anything related to it, just explain the article.`,
          },
          {
            role: "user",
            content: `Please explain the following article: ${text}.`,
          },
        ],
        max_tokens: 750, // Adjust the length as needed
      });

      const summary = response.choices[0]?.message?.content.trim() || "";
      return summary;
    } catch (error) {
      this.logger.error(`Failed to summarize text: ${error.message}`);
      throw new Error(`Failed to summarize text: ${error.message}`);
    }
  }
}
