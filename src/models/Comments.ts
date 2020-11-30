import * as mongoose from "mongoose";

export interface ICommentDocument {
  rating: number,
  comment: string,
  author: string,
};

export type CommentDocument = ICommentDocument & mongoose.Document;

export const commentSchema = new mongoose.Schema({
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  }, 
  comment: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  }
}, {
  timestamps: true,
})

export const Comments = mongoose.model<CommentDocument>("Comment", commentSchema);