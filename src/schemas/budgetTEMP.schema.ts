import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BudgetTEMPDocument = BudgetTEMP & Document;

@Schema()
export class BudgetTEMP {
  @Prop()
  monthlySpendings: [number];

  @Prop()
  approvedBudgetPerMonth: number;

  @Prop()
  year: number;
}

export const BudgetTEMPSchema = SchemaFactory.createForClass(BudgetTEMP);
