import { XlsxParserService } from './xlsx-parser.service';
export declare class XlsxParserController {
    private xlsxParseService;
    constructor(xlsxParseService: XlsxParserService);
    parse(): string;
    parse_overview(): void;
    triggerOverviewCreation(): Promise<import("../types").InitialOverview>;
    parseKPI(): Promise<string>;
    parseBudgetMonths(): Promise<string>;
    parseBudgetPast(): Promise<import("../types").PastBudget[]>;
}
