import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document } from 'mongoose';

export type PastBudgetDocument = PastBudget & Document;

@Schema()
export class PastBudget {
  @Prop()
  title: string;
  @Prop()
  name: string;
  @Prop()
  budget: number;
  @Prop()
  category: string;
  @Prop()
  year: number;


}

export const PastBudgetSchema = SchemaFactory.createForClass(PastBudget);
