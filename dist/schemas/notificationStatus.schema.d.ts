import { Document } from 'mongoose';
export declare type NotificationStatusDocument = NotificationStatus & Document;
export declare class NotificationStatus {
    change: boolean;
}
export declare const NotificationStatusSchema: import("mongoose").Schema<Document<NotificationStatus, any, any>, import("mongoose").Model<any, any, any>, undefined, any>;
