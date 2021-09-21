import * as mongoose from 'mongoose';
import { Artefact } from './artefact.schema';
import { KPI } from './kpi.schema';
import { BudgetDetail } from './budgetDetail.schema';
export declare type MeasureDocument = Measure & mongoose.Document;
export declare class Measure {
    title: string;
    id: number;
    name: string;
    description: string;
    focusArea: string;
    focusAreaFull: string;
    time: string;
    lastUpdate: string;
    measureLead: string;
    measureSponsor: string;
    lineOrgSponsor: string;
    solutionManager: string;
    approved: number;
    spent: number;
    kpiName: string;
    actuals: number;
    target: number;
    risk: number;
    budget: number;
    artefact: number;
    kpiProgress: number;
    monthlySpendings: number[];
    risks: [
        {
            risk: string;
            description: string;
            criticality: string;
            migration: string;
            resolutionDate: string | number;
        }
    ];
    budgetDetail: BudgetDetail;
    kpiData: KPI;
    artefacts: [Artefact];
}
export declare const MeasureSchema: mongoose.Schema<mongoose.Document<Measure, any, any>, mongoose.Model<any, any, any>, undefined, any>;
