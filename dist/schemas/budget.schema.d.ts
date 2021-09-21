import { Document } from 'mongoose';
export declare type BudgetDocument = Budget & Document;
export declare class Budget {
    monthlySpendings: [number];
    approvedBudgetPerMonth: number;
    year: number;
}
export declare const BudgetSchema: import("mongoose").Schema<Document<Budget, any, any>, import("mongoose").Model<any, any, any>, undefined, any>;
