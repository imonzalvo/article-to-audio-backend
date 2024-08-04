import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { User } from "../user/user.schema";

export type ArticleDocument = Article & Document;

@Schema()
export class Article {
  _id: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  summary: string;

  @Prop({ required: true })
  summaryAudioKey: string;

  @Prop({ type: Types.ObjectId, ref: "User" })
  user: User;

  @Prop({ required: true })
  originalAuthor: string;

  @Prop({ required: true })
  sourceUrl: string;

  @Prop({ type: Date, default: Date.now })
  created_at: Date;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
