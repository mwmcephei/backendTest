import * as mongoose from 'mongoose';
import { ArtefactTEMP } from './artefactTEMP.schema';
import { KPI } from './kpi.schema';
import { BudgetDetail } from './budgetDetail.schema';
export declare type MeasureTEMPDocument = MeasureTEMP & mongoose.Document;
export declare class MeasureTEMP {
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
    help: string;
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
    artefacts: [ArtefactTEMP];
}
export declare const MeasureTEMPSchema: mongoose.Schema<mongoose.Document<MeasureTEMP, any, any>, mongoose.Model<any, any, any>, undefined, any>;
