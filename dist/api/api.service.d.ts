import { Sheet } from '../schemas/sheet.schema';
import { Measure } from '../schemas/measure.schema';
import { Artefact } from '../schemas/artefact.schema';
import { Budget } from '../schemas/budget.schema';
import { Model } from 'mongoose';
import '../types';
import { PastBudget } from '../types';
export declare class ApiService {
    private artefactModel;
    private measureModel;
    private sheetModel;
    private budgetModel;
    private pastBudgetModel;
    constructor(artefactModel: Model<Artefact>, measureModel: Model<Measure>, sheetModel: Model<Sheet>, budgetModel: Model<Budget>, pastBudgetModel: Model<PastBudget>);
    getMeasure(measureID: string): Promise<Measure>;
    getArtefactsOfMeasure(measureID: string): Promise<Artefact[]>;
    getAllMeasures(): Promise<Measure[]>;
    getOverview(): Promise<Sheet>;
    getBudget(): Promise<Budget>;
    getPastBudgets(): Promise<PastBudget[]>;
}
