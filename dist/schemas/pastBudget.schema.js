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
exports.PastBudgetSchema = exports.PastBudget = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let PastBudget = class PastBudget {
};
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], PastBudget.prototype, "name", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", Number)
], PastBudget.prototype, "budget", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], PastBudget.prototype, "category", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", Number)
], PastBudget.prototype, "year", void 0);
PastBudget = __decorate([
    mongoose_1.Schema()
], PastBudget);
exports.PastBudget = PastBudget;
exports.PastBudgetSchema = mongoose_1.SchemaFactory.createForClass(PastBudget);
//# sourceMappingURL=pastBudget.schema.js.map