import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NotificationStatusDocument = NotificationStatus & Document;

@Schema()
export class NotificationStatus {
  @Prop()
  change: boolean;




}

export const NotificationStatusSchema = SchemaFactory.createForClass(NotificationStatus);
