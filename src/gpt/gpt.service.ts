import { Injectable, Logger } from '@nestjs/common';
import { OpenAI } from 'openai';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GptService {
  private readonly logger = new Logger(GptService.name);
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is missing or empty');
    }

    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async summarizeText(text: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 
        // 'gpt-4', 
        // 
        'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are an assistant that summarizes articles in spanish.' },
          { role: 'user', content: `Please summarize the following text: ${text} in spanish.` },
        ],
        max_tokens: 150, // Adjust the length as needed
      });

      const summary = response.choices[0]?.message?.content.trim() || '';
      return summary;
    } catch (error) {
      this.logger.error(`Failed to summarize text: ${error.message}`);
      throw new Error(`Failed to summarize text: ${error.message}`);
    }
  }
}
