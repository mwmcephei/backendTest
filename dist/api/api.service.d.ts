import { Sheet } from '../schemas/sheet.schema';
import { Measure } from '../schemas/measure.schema';
import { Artefact } from '../schemas/artefact.schema';
import { Budget } from '../schemas/budget.schema';
import { Model } from 'mongoose';
import '../types';
export declare class ApiService {
    private artefactModel;
    private measureModel;
    private sheetModel;
    private budgetModel;
    constructor(artefactModel: Model<Artefact>, measureModel: Model<Measure>, sheetModel: Model<Sheet>, budgetModel: Model<Budget>);
    getMeasure(measureID: string): Promise<Measure>;
    getArtefactsOfMeasure(measureID: string): Promise<Artefact[]>;
    getAllMeasures(): Promise<Measure[]>;
    getOverview(): Promise<Sheet>;
    getBudget(): Promise<Budget>;
}