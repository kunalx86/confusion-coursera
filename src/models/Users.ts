import * as mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

export interface IUserDocument {
  username: string,
  password: string,
  admin?: boolean,
}

export type UserDocument = IUserDocument & mongoose.Document;

const userSchema = new mongoose.Schema({
  admin: {
    type: Boolean,
    default: false,
  }
})

userSchema.plugin(passportLocalMongoose);

export const User = mongoose.model<UserDocument>("User", userSchema);