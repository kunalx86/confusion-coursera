import * as mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

export interface IFavoriteDocument {
  user?: string,
  dishes: mongoose.Types.Array<mongoose.Schema.Types.ObjectId>,
}

export type FavoriteDocument = IFavoriteDocument & mongoose.Document;

const userSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    index: false,
    ref: 'User',
  },
  dishes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dish'
  }]
})

userSchema.plugin(passportLocalMongoose);

export const Favorite = mongoose.model<FavoriteDocument>("Favorite", userSchema);