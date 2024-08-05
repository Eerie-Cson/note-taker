import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NoteDocument = Note & Document;

@Schema()
export class Note {
  @Prop({ enum: ['admin', 'user'], default: 'user' })
  role: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  content: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop()
  category: string;
}

export const NoteSchema = SchemaFactory.createForClass(Note);
