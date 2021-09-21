import { ApiService } from './api.service';
export declare class ApiController {
    private readonly apiService;
    constructor(apiService: ApiService);
    test(): string;
    getMeasure(params: any): Promise<import("../schemas/measure.schema").Measure>;
    getArtefactsOfMeasure(params: any): Promise<import("../schemas/artefact.schema").Artefact[]>;
    getOverview(): Promise<import("../schemas/sheet.schema").Sheet>;
    getAllMeasures(): Promise<import("../schemas/measure.schema").Measure[]>;
    getBudget(): Promise<import("../schemas/budget.schema").Budget>;
}
