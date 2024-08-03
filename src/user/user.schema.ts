import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Article } from '../article/article.schema';

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  picture: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Article' }] })
  articles: Article[];
}

export const UserSchema = SchemaFactory.createForClass(User);