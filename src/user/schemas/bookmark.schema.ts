// bookmark.model.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserDocument } from './user.schema';

export type BookmarkDocument = Bookmark & Document;

@Schema()
export class Bookmark {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  url: string;

  @Prop({ type: String, ref: 'User', required: true }) // Reference to User model
  user: UserDocument;
}

export const BookmarkSchema = SchemaFactory.createForClass(Bookmark);
