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
exports.MeasureTEMPSchema = exports.MeasureTEMP = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose = require("mongoose");
const kpi_schema_1 = require("./kpi.schema");
const budgetDetail_schema_1 = require("./budgetDetail.schema");
let MeasureTEMP = class MeasureTEMP {
};
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], MeasureTEMP.prototype, "title", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", Number)
], MeasureTEMP.prototype, "id", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], MeasureTEMP.prototype, "name", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], MeasureTEMP.prototype, "description", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], MeasureTEMP.prototype, "focusArea", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], MeasureTEMP.prototype, "focusAreaFull", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], MeasureTEMP.prototype, "time", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], MeasureTEMP.prototype, "lastUpdate", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], MeasureTEMP.prototype, "measureLead", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], MeasureTEMP.prototype, "measureSponsor", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], MeasureTEMP.prototype, "lineOrgSponsor", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], MeasureTEMP.prototype, "solutionManager", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", Number)
], MeasureTEMP.prototype, "approved", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", Number)
], MeasureTEMP.prototype, "spent", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], MeasureTEMP.prototype, "kpiName", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], MeasureTEMP.prototype, "help", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", Number)
], MeasureTEMP.prototype, "actuals", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", Number)
], MeasureTEMP.prototype, "target", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", Number)
], MeasureTEMP.prototype, "risk", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", Number)
], MeasureTEMP.prototype, "budget", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", Number)
], MeasureTEMP.prototype, "artefact", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", Number)
], MeasureTEMP.prototype, "kpiProgress", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", Array)
], MeasureTEMP.prototype, "monthlySpendings", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", Array)
], MeasureTEMP.prototype, "risks", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", budgetDetail_schema_1.BudgetDetail)
], MeasureTEMP.prototype, "budgetDetail", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", kpi_schema_1.KPI)
], MeasureTEMP.prototype, "kpiData", void 0);
__decorate([
    mongoose_1.Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'ArtefactTEMP' }),
    __metadata("design:type", Array)
], MeasureTEMP.prototype, "artefacts", void 0);
MeasureTEMP = __decorate([
    mongoose_1.Schema()
], MeasureTEMP);
exports.MeasureTEMP = MeasureTEMP;
exports.MeasureTEMPSchema = mongoose_1.SchemaFactory.createForClass(MeasureTEMP);
//# sourceMappingURL=measureTEMP.schema.js.map