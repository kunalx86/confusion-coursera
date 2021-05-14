import * as mongoose from "mongoose";

export interface IUserDocument {
  username: string,
  password: string,
  admin?: boolean,
}

export type UserDocument = IUserDocument & mongoose.Document;

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  admin: {
    type: Boolean,
    default: false,
  }
})

export const Users = mongoose.model<UserDocument>("User", userSchema);