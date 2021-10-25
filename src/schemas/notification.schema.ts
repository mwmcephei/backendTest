import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema()
export class Notification {

  @Prop()
  title: string;
  @Prop()
  body: string;
  @Prop()
  time: string;
  @Prop()
  type: string;
  @Prop()
  measure: string;
  @Prop()
  seen: boolean;
  @Prop()
  notified: boolean;




}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
