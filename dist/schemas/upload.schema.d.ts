import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
export declare type UploadDocument = Upload & Document;
export declare class Upload {
    name: string;
    date: string;
    ok: boolean;
}
export declare const UploadSchema: mongoose.Schema<mongoose.Document<Upload, any, any>, mongoose.Model<any, any, any>, undefined, any>;
