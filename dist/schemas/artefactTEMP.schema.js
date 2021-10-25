"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArtefactTEMPSchema = void 0;
const mongoose = require("mongoose");
exports.ArtefactTEMPSchema = new mongoose.Schema({
    id: { type: Number },
    description: { type: String },
    progress: { type: Number },
    budget: { type: String },
    achievement: { type: String },
    work: { type: String },
});
//# sourceMappingURL=artefactTEMP.schema.js.map