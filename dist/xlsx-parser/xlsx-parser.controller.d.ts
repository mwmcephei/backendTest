import { XlsxParserService } from './xlsx-parser.service';
export declare class XlsxParserController {
    private xlsxParseService;
    constructor(xlsxParseService: XlsxParserService);
    parse(params: any): Promise<string>;
    parse_overview(params: any): any[];
    triggerOverviewCreation(params: any): Promise<import("../types").InitialOverview>;
    parseKPI(params: any): Promise<string>;
    parseBudgetMonths(params: any): Promise<string>;
    parseBudgetPast(): Promise<import("../types").PastBudget[]>;
    triggerParsing(): Promise<string>;
    parseManually(params: any): Promise<boolean>;
    deleteData(params: any): Promise<unknown>;
}
