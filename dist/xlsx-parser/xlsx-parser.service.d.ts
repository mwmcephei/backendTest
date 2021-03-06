import { Sheet } from '../schemas/sheet.schema';
import { SheetTEMP } from '../schemas/sheetTEMP.schema';
import { Measure } from '../schemas/measure.schema';
import { MeasureTEMP } from '../schemas/measureTEMP.schema';
import { ArtefactTEMP } from '../schemas/artefactTEMP.schema';
import { Artefact } from '../schemas/artefact.schema';
import { Notification } from '../schemas/notification.schema';
import { NotificationStatus } from '../schemas/notificationStatus.schema';
import { Budget } from '../schemas/budget.schema';
import { BudgetTEMP } from '../schemas/budgetTEMP.schema';
import { Model } from 'mongoose';
import '../types';
import 'src/types';
import { Risk, SheetType, KpiProgressData, InitialOverview, PastBudget } from 'src/types';
import { Upload } from 'src/schemas/upload.schema';
export declare class XlsxParserService {
    private artefactModel;
    private artefactTEMPModel;
    private measureModel;
    private measureTEMPModel;
    private sheetModel;
    private sheetTEMPModel;
    private budgetModel;
    private budgetTEMPModel;
    private pastBudgetModel;
    private notificationModel;
    private notificationStatusModel;
    private uploadModel;
    constructor(artefactModel: Model<Artefact>, artefactTEMPModel: Model<ArtefactTEMP>, measureModel: Model<Measure>, measureTEMPModel: Model<MeasureTEMP>, sheetModel: Model<Sheet>, sheetTEMPModel: Model<SheetTEMP>, budgetModel: Model<Budget>, budgetTEMPModel: Model<BudgetTEMP>, pastBudgetModel: Model<PastBudget>, notificationModel: Model<Notification>, notificationStatusModel: Model<NotificationStatus>, uploadModel: Model<Upload>);
    triggerParsing(): Promise<string>;
    parseAll(temp: any): Promise<boolean>;
    deleteData(temp: any): Promise<unknown>;
    checkForChanges(measuresOLD: any, measuresNew: any): void;
    datetimNow(): string;
    eqSet(as: any, bs: any): boolean;
    moveFilesAfterParsing(): Promise<void>;
    createOverview(temp: any): Promise<InitialOverview>;
    getKPIProgressData(kpiFile: string): KpiProgressData[];
    parse(temp: boolean): Promise<string>;
    getArtefactsFromLinesArray(sheet: SheetType[]): SheetType[];
    parse_overview(temp: any): any[];
    parseKPI(temp: any): Promise<string>;
    parseBudgetMonths(temp: any): Promise<string>;
    budgetStringToNumber(input: any): number;
    parseBudgetPast(): Promise<PastBudget[]>;
    formatRiskDate(input: any): any;
    getRisk(line: number, xlsxFileAsJsonObject: any): Risk;
}
