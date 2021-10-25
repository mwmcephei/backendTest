import { ApiService } from './api.service';
import { Notification } from '../schemas/notification.schema';
import { NotificationStatus } from '../schemas/notificationStatus.schema';
export declare class UploadDto {
    filename: string;
    file: object;
}
export declare class SetNotificationDto {
    title: string;
    body: string;
    seen: boolean;
}
export declare class ApiController {
    private readonly apiService;
    constructor(apiService: ApiService);
    getMeasure(params: any): Promise<import("../schemas/measure.schema").Measure>;
    getArtefactsOfMeasure(params: any): Promise<import("../schemas/artefact.schema").Artefact[]>;
    getMeasureID(params: any): Promise<string>;
    getOverview(): Promise<import("../schemas/sheet.schema").Sheet>;
    getAllMeasures(): Promise<import("../schemas/measure.schema").Measure[]>;
    getBudget(): Promise<import("../schemas/budget.schema").Budget>;
    getPastBudgets(): Promise<import("../types").PastBudget[]>;
    getNotifications(params: any): Promise<Notification[]>;
    lookAtNotifications(): Promise<Notification[]>;
    setNotification(notification: SetNotificationDto): Promise<Notification>;
    checkNotifications(): Promise<NotificationStatus>;
    getUploadInfo(): Promise<{
        filesInBuffer: import("../schemas/upload.schema").Upload[];
        filesAlreadyParsed: any;
    }>;
    uploadedFile(category: any, file: any): Promise<boolean>;
}
export declare const xlsxFileFilter: (req: any, file: any, callback: any) => any;
export declare const mapFileNames: (fileName: any) => "budget_report.xlsx" | "KPI-report_1.xlsx" | "status_report.xlsx" | "test_data.xlsx" | "budget_past.xlsx" | "none";
export declare const listDir: (path: any) => Promise<any>;
