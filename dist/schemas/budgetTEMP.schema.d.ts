import { Document } from 'mongoose';
export declare type BudgetTEMPDocument = BudgetTEMP & Document;
export declare class BudgetTEMP {
    monthlySpendings: [number];
    approvedBudgetPerMonth: number;
    year: number;
}
export declare const BudgetTEMPSchema: import("mongoose").Schema<Document<BudgetTEMP, any, any>, import("mongoose").Model<any, any, any>, undefined, any>;
