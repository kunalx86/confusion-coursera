import * as mongoose from "mongoose";
import { commentSchema, CommentDocument } from "./Comments";

export interface IDishDocument {
  name: string,
  description: string,
  image: string,
  category: "mains" | "appetizer" | "dessert",
  label?: string,
  price: number,
  default?: boolean,
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
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    default: ""
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  comments: {
    type: [commentSchema]
  }
},{
  timestamps: true,
});

export const Dishes = mongoose.model<DishDocument>("Dish", dishSchema);