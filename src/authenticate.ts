import passport from "passport";
import passportLocal from "passport-local"
import { User } from "./models/Users";

passport.use(new passportLocal.Strategy(User.authenticate()));
passport.serializeUser((user, done) => {
  done(null, user.id)
});
passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => done(null, user))
    .catch(err => done(err))
});