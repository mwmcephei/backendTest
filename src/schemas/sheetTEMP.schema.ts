import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { MeasureTEMP } from './measureTEMP.schema';

export type SheetTEMPDocument = SheetTEMP & Document;

@Schema()
export class SheetTEMP {
  @Prop()
  name: string;

  @Prop()
  totalBudget: number;

  @Prop()
  overallStatus: number;

  @Prop()
  progress: number;

  @Prop()
  kpiPlans: string[];
  @Prop()
  kpiDates: string[];
  @Prop()
  statusDate: string;
  @Prop()
  budgetDate: string;

  @Prop()
  kpiProgress: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'MeasureTEMP' })
  measures: [MeasureTEMP];
}

export const SheetTEMPSchema = SchemaFactory.createForClass(SheetTEMP);
