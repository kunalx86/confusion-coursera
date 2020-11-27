import * as mongoose from "mongoose";
// import mongooseCurrency from "mongoose-currency";
import { commentSchema, CommentDocument } from "./Comments";

export interface IDishDocument {
  name: string,
  description: string,
  comments?: Array<CommentDocument>,
};

export type DishDocument = IDishDocument & mongoose.Document;

const dishSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  comments: {
    type: [commentSchema]
  }
},{
  timestamps: true,
});

export const Dish: mongoose.Model<DishDocument> = mongoose.model<DishDocument>("Dish", dishSchema);