import * as mongoose from 'mongoose';
export declare type KPIDocument = KPI & mongoose.Document;
export declare class KPI {
    title: string;
    target: number;
    actuals: number;
    baseline: number;
    plan1: number;
    plan2: number;
    plan3: number;
    plan4: number;
}
export declare const KPISchema: mongoose.Schema<mongoose.Document<KPI, any, any>, mongoose.Model<any, any, any>, undefined, any>;
