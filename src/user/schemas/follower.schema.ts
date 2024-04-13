// follower.model.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FollowerDocument = Follower & Document;

@Schema()
export class Follower {
  @Prop({ type: String, ref: 'User', required: true }) // Reference to User model for follower
  user: string;

  @Prop({ required: true })
  followedAt: Date;
}

export const FollowerSchema = SchemaFactory.createForClass(Follower);
