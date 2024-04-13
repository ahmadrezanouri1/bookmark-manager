// following.model.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FollowingDocument = Following & Document;

@Schema()
export class Following {
  @Prop({ type: String, ref: 'User', required: true }) // Reference to User model for following
  user: string;

  @Prop({ required: true })
  followedAt: Date;
}

export const FollowingSchema = SchemaFactory.createForClass(Following);
