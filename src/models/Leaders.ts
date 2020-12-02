import * as mongoose from "mongoose";

export interface ILeaderDocument {
  name: string,
  image: string,
  designation: string,
  abbr: string,
  description: string,
  featured?: boolean
};

export type LeaderDocument = ILeaderDocument & mongoose.Document;

const leaderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  designation: {
    type: String,
    required: true
  },
  abbr: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export const Leaders = mongoose.model<LeaderDocument>("Leader", leaderSchema);