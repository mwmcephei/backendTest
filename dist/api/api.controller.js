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
exports.listDir = exports.mapFileNames = exports.xlsxFileFilter = exports.ApiController = exports.SetNotificationDto = exports.UploadDto = void 0;
const common_1 = require("@nestjs/common");
const api_service_1 = require("./api.service");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const globalVars_1 = require("../globalVars");
const fs = require('fs');
const util = require('util');
class UploadDto {
}
exports.UploadDto = UploadDto;
class SetNotificationDto {
}
exports.SetNotificationDto = SetNotificationDto;
let ApiController = class ApiController {
    constructor(apiService) {
        this.apiService = apiService;
    }
    getMeasure(params) {
        return this.apiService.getMeasure(params.measureID);
    }
    getArtefactsOfMeasure(params) {
        return this.apiService.getArtefactsOfMeasure(params.measureID);
    }
    async getMeasureID(params) {
        const measureID = await this.apiService.getMeasureID(params.measureTitle);
        console.log("measureID");
        console.log(params.measureTitle);
        console.log(measureID);
        return measureID;
    }
    getOverview() {
        return this.apiService.getOverview();
    }
    getAllMeasures() {
        return this.apiService.getAllMeasures();
    }
    getBudget() {
        return this.apiService.getBudget();
    }
    getPastBudgets() {
        return this.apiService.getPastBudgets();
    }
    async getNotifications(params) {
        const allAsBool = (params.all === 'true');
        const result = await this.apiService.getNotifications(allAsBool);
        if (result) {
            await this.apiService.setToNotified(result);
        }
        return result;
    }
    lookAtNotifications() {
        return this.apiService.lookAtNotifications();
    }
    async setNotification(notification) {
        console.log(notification);
        return this.apiService.setNotification(notification);
    }
    checkNotifications() {
        return this.apiService.checkNotifications();
    }
    async getUploadInfo() {
        const filesInBuffer = await this.apiService.getUploadInfo();
        const filesAlreadyParsed = await exports.listDir(globalVars_1.rootPath + '/src/realData/');
        return {
            filesInBuffer,
            filesAlreadyParsed
        };
    }
    async uploadedFile(category, file) {
        console.log("file");
        console.log(file);
        console.log(category.name);
        await this.apiService.createNotificationForFileChange(category.name);
        const targetFileName = exports.mapFileNames(category.name);
        console.log(targetFileName);
        const response = {
            originalname: file.originalname,
            filename: file.filename,
        };
        return this.apiService.HandleFileUpload(file.originalname, targetFileName);
    }
};
__decorate([
    common_1.Get('measure/:measureID'),
    __param(0, common_1.Param()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ApiController.prototype, "getMeasure", null);
__decorate([
    common_1.Get('measure/:measureID/artefacts'),
    __param(0, common_1.Param()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ApiController.prototype, "getArtefactsOfMeasure", null);
__decorate([
    common_1.Get('getMeasureID/:measureTitle'),
    __param(0, common_1.Param()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ApiController.prototype, "getMeasureID", null);
__decorate([
    common_1.Get('overview'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ApiController.prototype, "getOverview", null);
__decorate([
    common_1.Get('measures'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ApiController.prototype, "getAllMeasures", null);
__decorate([
    common_1.Get('budget'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ApiController.prototype, "getBudget", null);
__decorate([
    common_1.Get('pastBudget'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ApiController.prototype, "getPastBudgets", null);
__decorate([
    common_1.Get("getNotifications/:all"),
    __param(0, common_1.Param()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ApiController.prototype, "getNotifications", null);
__decorate([
    common_1.Get("lookAtNotifications"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ApiController.prototype, "lookAtNotifications", null);
__decorate([
    common_1.Post("setNotification"),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SetNotificationDto]),
    __metadata("design:returntype", Promise)
], ApiController.prototype, "setNotification", null);
__decorate([
    common_1.Get('checkNotifications'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ApiController.prototype, "checkNotifications", null);
__decorate([
    common_1.Get('uploadInfo'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ApiController.prototype, "getUploadInfo", null);
__decorate([
    common_1.Post('upload'),
    common_1.UseInterceptors(platform_express_1.FileInterceptor('file', {
        storage: multer_1.diskStorage({
            destination: './files',
            filename: function (req, file, callback) {
                console.log(req.body);
                callback(null, file.originalname);
            },
        }),
        fileFilter: exports.xlsxFileFilter,
    })),
    __param(0, common_1.Body()),
    __param(1, common_1.UploadedFile()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ApiController.prototype, "uploadedFile", null);
ApiController = __decorate([
    common_1.Controller('api'),
    __metadata("design:paramtypes", [api_service_1.ApiService])
], ApiController);
exports.ApiController = ApiController;
const xlsxFileFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(xlsx)$/)) {
        return callback(new Error('Only xlsx files are allowed!'), false);
    }
    callback(null, true);
};
exports.xlsxFileFilter = xlsxFileFilter;
const mapFileNames = (fileName) => {
    switch (parseInt(fileName)) {
        case 1:
            return "budget_report.xlsx";
            break;
        case 2:
            return "KPI-report_1.xlsx";
            break;
        case 3:
            return "status_report.xlsx";
            break;
        case 4:
            return "test_data.xlsx";
            break;
        case 5:
            return "budget_past.xlsx";
            break;
        default:
            return "none";
            break;
    }
};
exports.mapFileNames = mapFileNames;
const listDir = async (path) => {
    const fsPromises = fs.promises;
    try {
        return fsPromises.readdir(path);
    }
    catch (err) {
        console.error('Error occured while reading directory!', err);
    }
};
exports.listDir = listDir;
//# sourceMappingURL=api.controller.js.map