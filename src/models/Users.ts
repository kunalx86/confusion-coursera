import * as mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

export interface IUserDocument {
  firstname?: string,
  lastname?: string,
  username: string,
  password: string,
  admin?: boolean,
}

export type UserDocument = IUserDocument & mongoose.Document;

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    default: '',
  },
  lastname: {
    type: String,
    default: '',
  },
  admin: {
    type: Boolean,
    default: false,
  }
})

userSchema.plugin(passportLocalMongoose);

export const User = mongoose.model<UserDocument>("User", userSchema);