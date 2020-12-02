import * as mongoose from "mongoose";

export interface IPromotionDocument {
  name: string,
  image: string,
  label?: string,
  price: number,
  description: string,
  featured?: boolean
};

export type PromotionDocument = IPromotionDocument & mongoose.Document;

const promotionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
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

export const Promotions = mongoose.model<PromotionDocument>("Promotion", promotionSchema);