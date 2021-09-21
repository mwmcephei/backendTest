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
exports.SheetSchema = exports.Sheet = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose = require("mongoose");
let Sheet = class Sheet {
};
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], Sheet.prototype, "name", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", Number)
], Sheet.prototype, "totalBudget", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", Number)
], Sheet.prototype, "overallStatus", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", Number)
], Sheet.prototype, "progress", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", Number)
], Sheet.prototype, "kpiProgress", void 0);
__decorate([
    mongoose_1.Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Measure' }),
    __metadata("design:type", Array)
], Sheet.prototype, "measures", void 0);
Sheet = __decorate([
    mongoose_1.Schema()
], Sheet);
exports.Sheet = Sheet;
exports.SheetSchema = mongoose_1.SchemaFactory.createForClass(Sheet);
//# sourceMappingURL=sheet.schema.js.map