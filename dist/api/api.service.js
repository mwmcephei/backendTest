"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const globalVars_1 = require("../globalVars");
require("../types");
const upload_schema_1 = require("../schemas/upload.schema");
const fs = require('fs');
let ApiService = class ApiService {
    constructor(artefactModel, measureModel, sheetModel, budgetModel, pastBudgetModel, notificationModel, notificationStatusModel, uploadModel) {
        this.artefactModel = artefactModel;
        this.measureModel = measureModel;
        this.sheetModel = sheetModel;
        this.budgetModel = budgetModel;
        this.pastBudgetModel = pastBudgetModel;
        this.notificationModel = notificationModel;
        this.notificationStatusModel = notificationStatusModel;
        this.uploadModel = uploadModel;
    }
    async getMeasure(measureID) {
        try {
            const measure = await this.measureModel.findById(measureID);
            return measure;
        }
        catch (error) {
            return error;
        }
    }
    async getArtefactsOfMeasure(measureID) {
        try {
            const measure = await this.measureModel
                .findById(measureID)
                .sort({ id: 'asc' });
            const populatedMeasure = await measure
                .populate('artefacts')
                .execPopulate();
            return populatedMeasure.artefacts;
        }
        catch (error) {
            return error;
        }
    }
    async getMeasureID(measureTitle) {
        console.log("_________________getMeasureID______________");
        console.log(measureTitle);
        try {
            const measure = await this.measureModel.findOne({
                title: measureTitle,
            });
            return measure._id;
        }
        catch (error) {
            return error;
        }
    }
    async getAllMeasures() {
        try {
            const result = await this.measureModel.find().sort({ id: 'asc' });
            return result;
        }
        catch (error) {
            return error;
        }
    }
    async getOverview() {
        try {
            const excelSheet = await this.sheetModel.findOne();
            console.log(excelSheet);
            return excelSheet;
        }
        catch (error) {
            return error;
        }
    }
    async getBudget() {
        try {
            const budget = await this.budgetModel.findOne();
            return budget;
        }
        catch (error) {
            return error;
        }
    }
    async getPastBudgets() {
        try {
            const result = await this.pastBudgetModel.find();
            console.log(result);
            return result;
        }
        catch (error) {
            return error;
        }
    }
    async lookAtNotifications() {
        try {
            const allNots = await this.notificationModel.find();
            if (allNots) {
                allNots.forEach(async (n) => {
                    await n.update({
                        seen: true
                    });
                });
            }
            return allNots;
        }
        catch (error) {
            return error;
        }
    }
    async getNotifications(all) {
        try {
            let result;
            if (all) {
                console.log("all");
                console.log(all);
                result = await this.notificationModel.find();
            }
            else {
                result = await this.notificationModel.find({
                    notified: false
                });
                if (result) {
                    for (let i = 0; i > result.length; i++) {
                        const updated = await result[i].update({ notified: true });
                    }
                }
            }
            console.log(result);
            return result;
        }
        catch (error) {
            return error;
        }
    }
    async setToNotified(result) {
        if (result) {
            for (let i = 0; i < result.length; i++) {
                const updated = await result[i].update({ notified: true });
            }
        }
    }
    async setNotification(notification) {
        try {
            console.log("save new NOTIFICATION");
            console.log(notification);
            const newNot = new this.notificationModel(notification);
            await newNot.save();
            return newNot;
        }
        catch (error) {
            return error;
        }
    }
    async checkNotifications() {
        try {
            const change = await this.notificationStatusModel.findOne({
                change: true,
            });
            if (change) {
                console.log("found notification");
                await change.update({
                    change: false
                });
                return change;
            }
            else {
                console.log("no notification");
                const newChange = new this.notificationStatusModel({
                    change: false
                });
                return newChange;
            }
        }
        catch (error) {
            return error;
        }
    }
    async filesChanged() {
        console.log("something hapening");
        try {
            const existingChange = await this.notificationStatusModel.findOne();
            if (existingChange) {
                await existingChange.update({
                    change: true
                });
            }
            else {
                const newChange = new this.notificationStatusModel({
                    change: true
                });
                await newChange.save();
            }
        }
        catch (error) {
            return error;
        }
    }
    async HandleFileUpload(originalname, targetFileName) {
        fs.rename(globalVars_1.rootPath + '/files/' + originalname, globalVars_1.rootPath + '/data/' + targetFileName, function (err) {
            if (err)
                console.log('ERROR: ' + err);
        });
        return true;
    }
    async createNotificationForFileChange(fileCategory) {
        let fileName = "";
        switch (parseInt(fileCategory)) {
            case 1:
                fileName = "Budget Report";
                break;
            case 2:
                fileName = "KPI Report";
                break;
            case 3:
                fileName = "Status Report";
                break;
            case 4:
                fileName = "Measure Overview";
                break;
            case 5:
                fileName = "All Budgets";
                break;
            default:
                fileName = "";
                break;
        }
        const notification = {
            title: "File Upload",
            body: "A new " + fileName + " file has been uploaded",
            time: this.datetimNow(),
            type: "file",
            measure: "",
            seen: false,
            notified: false
        };
        const newNot = new this.notificationModel(notification);
        await newNot.save();
        const upload = await this.uploadModel.findOne({
            name: fileName
        });
        if (upload) {
            await upload.update({
                date: new Date().toISOString().split('T')[0],
                ok: true
            });
        }
        else {
            const newUpload = new this.uploadModel({
                name: fileName,
                date: new Date().toISOString().split('T')[0],
                ok: true
            });
            await newUpload.save();
        }
        return true;
    }
    async getUploadInfo() {
        try {
            const uploadInfo = await this.uploadModel.find();
            return uploadInfo;
        }
        catch (error) {
            return error;
        }
    }
    datetimNow() {
        const currentdate = new Date();
        return currentdate.getDate() + "."
            + (currentdate.getMonth() + 1) + "."
            + currentdate.getFullYear() + " "
            + currentdate.getHours() + ":"
            + currentdate.getMinutes();
    }
};
ApiService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectModel('Artefact')),
    __param(1, mongoose_1.InjectModel('Measure')),
    __param(2, mongoose_1.InjectModel('Sheet')),
    __param(3, mongoose_1.InjectModel('Budget')),
    __param(4, mongoose_1.InjectModel('PastBudget')),
    __param(5, mongoose_1.InjectModel('Notification')),
    __param(6, mongoose_1.InjectModel('NotificationStatus')),
    __param(7, mongoose_1.InjectModel('Upload')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], ApiService);
exports.ApiService = ApiService;
//# sourceMappingURL=api.service.js.map