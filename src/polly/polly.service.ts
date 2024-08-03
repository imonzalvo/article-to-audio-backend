import { Injectable, Logger } from "@nestjs/common";
import * as AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class PollyService {
  private readonly logger = new Logger(PollyService.name);
  private readonly polly: AWS.Polly;
  private readonly s3: AWS.S3;

  constructor() {
    AWS.config.update({
      region: "us-east-1",
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
    this.polly = new AWS.Polly();
    this.s3 = new AWS.S3();
  }

  async textToSpeech(text: string, bucketName: string): Promise<string> {
    const params = {
      Text: text,
      OutputFormat: "mp3",
      VoiceId: "Mia",
      Engine: "neural",
    };

    const { AudioStream } = await this.polly.synthesizeSpeech(params).promise();
    const audioKey = `${uuidv4()}.mp3`;

    const s3Params = {
      Bucket: bucketName,
      Key: `test/${audioKey}`,
      Body: AudioStream,
      ContentType: "audio/mpeg",
    };

    await this.s3.upload(s3Params).promise();
    this.logger.log(`Audio content stored at: ${audioKey}`);
    return audioKey;
  }
}
