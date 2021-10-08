/// <reference types="multer" />
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
    getOverview(): Promise<import("../schemas/sheet.schema").Sheet>;
    getAllMeasures(): Promise<import("../schemas/measure.schema").Measure[]>;
    getBudget(): Promise<import("../schemas/budget.schema").Budget>;
    getPastBudgets(): Promise<import("../types").PastBudget[]>;
    getNotifications(): Promise<Notification[]>;
    lookAtNotifications(): Promise<Notification[]>;
    setNotification(notification: SetNotificationDto): Promise<Notification>;
    checkNotifications(): Promise<NotificationStatus>;
    uploadFile(file: Express.Multer.File): Promise<NotificationStatus[]>;
}
export declare const editFileName: (req: any, file: any, callback: any) => void;
