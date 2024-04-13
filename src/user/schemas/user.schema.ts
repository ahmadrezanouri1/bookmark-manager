// user.model.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { FollowerDocument } from './follower.schema';
import { FollowingDocument } from './following.schema';
import { BookmarkDocument } from './bookmark.schema';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  username: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop()
  name: string;

  @Prop()
  lastName: string;
  @Prop({ type: String, default: '' }) // Default value is an empty string
  otp: string;

  @Prop() // Reference to Follower model
  followers: FollowerDocument[];

  @Prop() // Reference to Following model
  following: FollowingDocument[];

  @Prop() // Reference to Bookmark model
  bookmarks: BookmarkDocument[];
}

export const UserSchema = SchemaFactory.createForClass(User);
