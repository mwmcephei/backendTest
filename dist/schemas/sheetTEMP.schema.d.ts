import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { MeasureTEMP } from './measureTEMP.schema';
export declare type SheetTEMPDocument = SheetTEMP & Document;
export declare class SheetTEMP {
    name: string;
    totalBudget: number;
    overallStatus: number;
    progress: number;
    kpiPlans: string[];
    kpiDates: string[];
    statusDate: string;
    budgetDate: string;
    kpiProgress: number;
    measures: [MeasureTEMP];
}
export declare const SheetTEMPSchema: mongoose.Schema<mongoose.Document<SheetTEMP, any, any>, mongoose.Model<any, any, any>, undefined, any>;
