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
exports.editFileName = exports.ApiController = exports.SetNotificationDto = exports.UploadDto = void 0;
const common_1 = require("@nestjs/common");
const api_service_1 = require("./api.service");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
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
    getNotifications() {
        return this.apiService.getNotifications();
    }
    lookAtNotifications() {
        return this.apiService.lookAtNotifications();
    }
    async setNotification(notification) {
        console.log("NOTIFICATIONNNNN");
        console.log(notification);
        return this.apiService.setNotification(notification);
    }
    checkNotifications() {
        return this.apiService.checkNotifications();
    }
    uploadFile(file) {
        console.log(file);
        return this.apiService.filesChanged();
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
    common_1.Get("getNotifications"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
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
    common_1.Post('upload'),
    common_1.UseInterceptors(platform_express_1.FileInterceptor('file', {
        storage: multer_1.diskStorage({
            destination: "./uploads",
            filename: exports.editFileName
        })
    })),
    __param(0, common_1.UploadedFile()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ApiController.prototype, "uploadFile", null);
ApiController = __decorate([
    common_1.Controller('api'),
    __metadata("design:paramtypes", [api_service_1.ApiService])
], ApiController);
exports.ApiController = ApiController;
const editFileName = (req, file, callback) => {
    const name = file.originalname;
    callback(null, `${name}`);
};
exports.editFileName = editFileName;
//# sourceMappingURL=api.controller.js.map