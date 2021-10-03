import { Document } from 'mongoose';
export declare type PastBudgetDocument = PastBudget & Document;
export declare class PastBudget {
    title: string;
    name: string;
    budget: number;
    category: string;
    year: number;
}
export declare const PastBudgetSchema: import("mongoose").Schema<Document<PastBudget, any, any>, import("mongoose").Model<any, any, any>, undefined, any>;
