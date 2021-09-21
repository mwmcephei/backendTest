import * as mongoose from 'mongoose';
export declare type BudgetDetailDocument = BudgetDetail & mongoose.Document;
export declare class BudgetDetail {
    totalApprovedBudget: number;
    spentBudget: number;
    invoicedBudget: number;
    forecastBudge: number;
    contractBudget: number;
}
export declare const BudgetDetailSchema: mongoose.Schema<mongoose.Document<BudgetDetail, any, any>, mongoose.Model<any, any, any>, undefined, any>;
