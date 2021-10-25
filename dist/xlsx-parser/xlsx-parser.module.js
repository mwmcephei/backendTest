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
const sheetTEMP_schema_1 = require("../schemas/sheetTEMP.schema");
const measure_schema_1 = require("../schemas/measure.schema");
const measureTEMP_schema_1 = require("../schemas/measureTEMP.schema");
const artefact_schema_1 = require("../schemas/artefact.schema");
const artefactTEMP_schema_1 = require("../schemas/artefactTEMP.schema");
const pastBudget_schema_1 = require("../schemas/pastBudget.schema");
const budget_schema_1 = require("../schemas/budget.schema");
const budgetTEMP_schema_1 = require("../schemas/budgetTEMP.schema");
const notification_schema_1 = require("../schemas/notification.schema");
const notificationStatus_schema_1 = require("../schemas/notificationStatus.schema");
const upload_schema_1 = require("../schemas/upload.schema");
let XlsxParserModule = class XlsxParserModule {
};
XlsxParserModule = __decorate([
    common_1.Module({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: 'Sheet', schema: sheet_schema_1.SheetSchema },
                { name: 'SheetTEMP', schema: sheetTEMP_schema_1.SheetTEMPSchema },
                { name: 'Measure', schema: measure_schema_1.MeasureSchema },
                { name: 'MeasureTEMP', schema: measureTEMP_schema_1.MeasureTEMPSchema },
                { name: 'Artefact', schema: artefact_schema_1.ArtefactSchema },
                { name: 'ArtefactTEMP', schema: artefactTEMP_schema_1.ArtefactTEMPSchema },
                { name: 'Budget', schema: budget_schema_1.BudgetSchema },
                { name: 'BudgetTEMP', schema: budgetTEMP_schema_1.BudgetTEMPSchema },
                { name: 'PastBudget', schema: pastBudget_schema_1.PastBudgetSchema },
                { name: 'Notification', schema: notification_schema_1.NotificationSchema },
                { name: 'NotificationStatus', schema: notificationStatus_schema_1.NotificationStatusSchema },
                { name: 'Upload', schema: upload_schema_1.UploadSchema },
            ]),
        ],
        providers: [xlsx_parser_controller_1.XlsxParserController, xlsx_parser_service_1.XlsxParserService],
        controllers: [xlsx_parser_controller_1.XlsxParserController],
    })
], XlsxParserModule);
exports.XlsxParserModule = XlsxParserModule;
//# sourceMappingURL=xlsx-parser.module.js.map