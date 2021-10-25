import * as mongoose from 'mongoose';


export const ArtefactTEMPSchema = new mongoose.Schema({
  id: { type: Number },
  description: { type: String },
  progress: { type: Number },
  budget: { type: String },
  achievement: { type: String },
  work: { type: String },
});

export interface ArtefactTEMP {
  id: number;
  description: string;
  progress: number;
  budget: string;
  achievement: string;
  work: string;
}