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
exports.MeasureSchema = exports.Measure = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose = require("mongoose");
const kpi_schema_1 = require("./kpi.schema");
const budgetDetail_schema_1 = require("./budgetDetail.schema");
let Measure = class Measure {
};
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], Measure.prototype, "title", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", Number)
], Measure.prototype, "id", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], Measure.prototype, "name", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], Measure.prototype, "description", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], Measure.prototype, "focusArea", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], Measure.prototype, "focusAreaFull", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], Measure.prototype, "time", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], Measure.prototype, "lastUpdate", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], Measure.prototype, "measureLead", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], Measure.prototype, "measureSponsor", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], Measure.prototype, "lineOrgSponsor", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], Measure.prototype, "solutionManager", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", Number)
], Measure.prototype, "approved", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", Number)
], Measure.prototype, "spent", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], Measure.prototype, "kpiName", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", Number)
], Measure.prototype, "actuals", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", Number)
], Measure.prototype, "target", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", Number)
], Measure.prototype, "risk", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", Number)
], Measure.prototype, "budget", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", Number)
], Measure.prototype, "artefact", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", Number)
], Measure.prototype, "kpiProgress", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", Array)
], Measure.prototype, "monthlySpendings", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", Array)
], Measure.prototype, "risks", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", budgetDetail_schema_1.BudgetDetail)
], Measure.prototype, "budgetDetail", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", kpi_schema_1.KPI)
], Measure.prototype, "kpiData", void 0);
__decorate([
    mongoose_1.Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Artefact' }),
    __metadata("design:type", Array)
], Measure.prototype, "artefacts", void 0);
Measure = __decorate([
    mongoose_1.Schema()
], Measure);
exports.Measure = Measure;
exports.MeasureSchema = mongoose_1.SchemaFactory.createForClass(Measure);
//# sourceMappingURL=measure.schema.js.map