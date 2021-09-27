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
let ApiService = class ApiService {
    constructor(artefactModel, measureModel, sheetModel, budgetModel, pastBudgetModel) {
        this.artefactModel = artefactModel;
        this.measureModel = measureModel;
        this.sheetModel = sheetModel;
        this.budgetModel = budgetModel;
        this.pastBudgetModel = pastBudgetModel;
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
            console.log("ARTEFACTSARTEFACTSARTEFACTSARTEFACTSARTEFACTSARTEFACTSARTEFACTSARTEFACTS");
            console.log(populatedMeasure.artefacts);
            return populatedMeasure.artefacts;
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
            const excelSheet = await this.sheetModel.findOne({
                name: globalVars_1.fileNames.main_file,
            });
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
};
ApiService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectModel('Artefact')),
    __param(1, mongoose_1.InjectModel('Measure')),
    __param(2, mongoose_1.InjectModel('Sheet')),
    __param(3, mongoose_1.InjectModel('Budget')),
    __param(4, mongoose_1.InjectModel('PastBudget')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], ApiService);
exports.ApiService = ApiService;
//# sourceMappingURL=api.service.js.map