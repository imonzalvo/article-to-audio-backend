export declare class PollyService {
    private readonly logger;
    private readonly polly;
    private readonly s3;
    constructor();
    textToSpeech(text: string, bucketName: string): Promise<string>;
}
