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
exports.XlsxParserController = void 0;
const common_1 = require("@nestjs/common");
const xlsx_parser_service_1 = require("./xlsx-parser.service");
let XlsxParserController = class XlsxParserController {
    constructor(xlsxParseService) {
        this.xlsxParseService = xlsxParseService;
    }
    parse(params) {
        console.log('parse');
        const tempAsBool = (params.temp === 'true');
        return this.xlsxParseService.parse(tempAsBool);
    }
    parse_overview(params) {
        console.log('parse_overview');
        const tempAsBool = (params.temp === 'true');
        return this.xlsxParseService.parse_overview(tempAsBool);
    }
    triggerOverviewCreation(params) {
        console.log('createOverview');
        const tempAsBool = (params.temp === 'true');
        return this.xlsxParseService.createOverview(tempAsBool);
    }
    parseKPI(params) {
        console.log('parse_kpi');
        const tempAsBool = (params.temp === 'true');
        return this.xlsxParseService.parseKPI(tempAsBool);
    }
    parseBudgetMonths(params) {
        console.log('parse_budget_months');
        const tempAsBool = (params.temp === 'true');
        return this.xlsxParseService.parseBudgetMonths(tempAsBool);
    }
    parseBudgetPast() {
        return this.xlsxParseService.parseBudgetPast();
    }
    async triggerParsing() {
        return await this.xlsxParseService.triggerParsing();
    }
    parseManually(params) {
        const tempAsBool = (params.temp === 'true');
        return this.xlsxParseService.parseAll(tempAsBool);
    }
    async deleteData(params) {
        const tempAsBool = (params.temp === 'true');
        return await this.xlsxParseService.deleteData(tempAsBool);
    }
};
__decorate([
    common_1.Get('parse/:temp'),
    __param(0, common_1.Param()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], XlsxParserController.prototype, "parse", null);
__decorate([
    common_1.Get('parse_overview/:temp'),
    __param(0, common_1.Param()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], XlsxParserController.prototype, "parse_overview", null);
__decorate([
    common_1.Get('create_overview/:temp'),
    __param(0, common_1.Param()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], XlsxParserController.prototype, "triggerOverviewCreation", null);
__decorate([
    common_1.Get('parse_kpi/:temp'),
    __param(0, common_1.Param()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], XlsxParserController.prototype, "parseKPI", null);
__decorate([
    common_1.Get('parse_budget_months/:temp'),
    __param(0, common_1.Param()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], XlsxParserController.prototype, "parseBudgetMonths", null);
__decorate([
    common_1.Get('parse_budget_past'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], XlsxParserController.prototype, "parseBudgetPast", null);
__decorate([
    common_1.Get('triggerParsing'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], XlsxParserController.prototype, "triggerParsing", null);
__decorate([
    common_1.Get('parseManually/:temp'),
    __param(0, common_1.Param()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], XlsxParserController.prototype, "parseManually", null);
__decorate([
    common_1.Get('deleteData/:temp'),
    __param(0, common_1.Param()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], XlsxParserController.prototype, "deleteData", null);
XlsxParserController = __decorate([
    common_1.Controller('xlsx-parser'),
    __metadata("design:paramtypes", [xlsx_parser_service_1.XlsxParserService])
], XlsxParserController);
exports.XlsxParserController = XlsxParserController;
//# sourceMappingURL=xlsx-parser.controller.js.map