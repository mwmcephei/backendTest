"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.XlsxParserModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const xlsx_parser_service_1 = require("./xlsx-parser.service");
const xlsx_parser_controller_1 = require("./xlsx-parser.controller");
const sheet_schema_1 = require("../schemas/sheet.schema");
const measure_schema_1 = require("../schemas/measure.schema");
const artefact_schema_1 = require("../schemas/artefact.schema");
const pastBudget_schema_1 = require("../schemas/pastBudget.schema");
const budget_schema_1 = require("../schemas/budget.schema");
let XlsxParserModule = class XlsxParserModule {
};
XlsxParserModule = __decorate([
    common_1.Module({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: 'Sheet', schema: sheet_schema_1.SheetSchema },
                { name: 'Measure', schema: measure_schema_1.MeasureSchema },
                { name: 'Artefact', schema: artefact_schema_1.ArtefactSchema },
                { name: 'Budget', schema: budget_schema_1.BudgetSchema },
                { name: 'PastBudget', schema: pastBudget_schema_1.PastBudgetSchema },
            ]),
        ],
        providers: [xlsx_parser_controller_1.XlsxParserController, xlsx_parser_service_1.XlsxParserService],
        controllers: [xlsx_parser_controller_1.XlsxParserController],
    })
], XlsxParserModule);
exports.XlsxParserModule = XlsxParserModule;
//# sourceMappingURL=xlsx-parser.module.js.map