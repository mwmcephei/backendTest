"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArtefactSchema = void 0;
const mongoose = require("mongoose");
exports.ArtefactSchema = new mongoose.Schema({
    id: { type: Number },
    description: { type: String },
    progress: { type: Number },
    budget: { type: String },
    achievement: { type: String },
    work: { type: String },
});
//# sourceMappingURL=artefact.schema.js.map