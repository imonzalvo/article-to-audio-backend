import { ConfigService } from "@nestjs/config";
export declare class GptService {
    private configService;
    private readonly logger;
    private openai;
    constructor(configService: ConfigService);
    summarizeText(text: string): Promise<string>;
}
