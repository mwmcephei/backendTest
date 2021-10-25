import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Measure } from './measure.schema';

export type UploadDocument = Upload & Document;

@Schema()
export class Upload {
  @Prop()
  name: string;
  @Prop()
  date: string;
  @Prop()
  ok: boolean;
}

export const UploadSchema = SchemaFactory.createForClass(Upload);
