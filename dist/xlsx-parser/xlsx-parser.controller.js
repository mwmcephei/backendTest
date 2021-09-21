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
Object.defineProperty(exports, "__esModule", { value: true });
exports.XlsxParserController = void 0;
const common_1 = require("@nestjs/common");
const xlsx_parser_service_1 = require("./xlsx-parser.service");
let XlsxParserController = class XlsxParserController {
    constructor(xlsxParseService) {
        this.xlsxParseService = xlsxParseService;
    }
    parse() {
        console.log('parse');
        return this.xlsxParseService.parse();
    }
    parse_overview() {
        console.log('parse_overview');
        return this.xlsxParseService.parse_overview();
    }
    triggerOverviewCreation() {
        console.log('createOverview');
        return this.xlsxParseService.createOverview();
    }
    parseKPI() {
        console.log('parse_kpi');
        return this.xlsxParseService.parseKPI();
    }
    parseBudgetMonths() {
        console.log('parse_budget_months');
        return this.xlsxParseService.parseBudgetMonths();
    }
};
__decorate([
    common_1.Get('parse'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], XlsxParserController.prototype, "parse", null);
__decorate([
    common_1.Get('parse_overview'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], XlsxParserController.prototype, "parse_overview", null);
__decorate([
    common_1.Get('create_overview'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], XlsxParserController.prototype, "triggerOverviewCreation", null);
__decorate([
    common_1.Get('parse_kpi'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], XlsxParserController.prototype, "parseKPI", null);
__decorate([
    common_1.Get('parse_budget_months'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], XlsxParserController.prototype, "parseBudgetMonths", null);
XlsxParserController = __decorate([
    common_1.Controller('xlsx-parser'),
    __metadata("design:paramtypes", [xlsx_parser_service_1.XlsxParserService])
], XlsxParserController);
exports.XlsxParserController = XlsxParserController;
//# sourceMappingURL=xlsx-parser.controller.js.map