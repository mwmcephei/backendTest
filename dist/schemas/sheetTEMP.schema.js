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
exports.SheetTEMPSchema = exports.SheetTEMP = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose = require("mongoose");
let SheetTEMP = class SheetTEMP {
};
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], SheetTEMP.prototype, "name", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", Number)
], SheetTEMP.prototype, "totalBudget", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", Number)
], SheetTEMP.prototype, "overallStatus", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", Number)
], SheetTEMP.prototype, "progress", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", Array)
], SheetTEMP.prototype, "kpiPlans", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", Array)
], SheetTEMP.prototype, "kpiDates", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], SheetTEMP.prototype, "statusDate", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], SheetTEMP.prototype, "budgetDate", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", Number)
], SheetTEMP.prototype, "kpiProgress", void 0);
__decorate([
    mongoose_1.Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'MeasureTEMP' }),
    __metadata("design:type", Array)
], SheetTEMP.prototype, "measures", void 0);
SheetTEMP = __decorate([
    mongoose_1.Schema()
], SheetTEMP);
exports.SheetTEMP = SheetTEMP;
exports.SheetTEMPSchema = mongoose_1.SchemaFactory.createForClass(SheetTEMP);
//# sourceMappingURL=sheetTEMP.schema.js.map