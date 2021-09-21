import { Sheet } from '../schemas/sheet.schema';
import { Measure } from '../schemas/measure.schema';
import { Artefact } from '../schemas/artefact.schema';
import { Budget } from '../schemas/budget.schema';
import { Model } from 'mongoose';
import '../types';
import 'src/types';
import { SheetType, KpiProgressData, InitialOverview } from 'src/types';
export declare class XlsxParserService {
    private artefactModel;
    private measureModel;
    private sheetModel;
    private budgetModel;
    constructor(artefactModel: Model<Artefact>, measureModel: Model<Measure>, sheetModel: Model<Sheet>, budgetModel: Model<Budget>);
    createOverview(): Promise<InitialOverview>;
    getKPIProgressData(kpiFile: string): KpiProgressData[];
    parse(): string;
    getArtefactsFromLinesArray(sheet: SheetType[], sheetName: string): SheetType[];
    parse_overview(): void;
    parseKPI(): Promise<string>;
    parseBudgetMonths(): Promise<string>;
    budgetStringToNumber(input: any): number;
}
