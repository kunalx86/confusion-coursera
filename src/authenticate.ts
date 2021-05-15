import passport from "passport";
import passportLocal from "passport-local"
import jwt from "jsonwebtoken";
import jwtpassport from "passport-jwt";
import { User } from "./models/Users";
import { CustomError, JWTPayload } from "@shared/constants";
import { NextFunction, Request, Response } from "express";

passport.use(new passportLocal.Strategy(User.authenticate()));
passport.serializeUser((user, done) => {
  done(null, user.id)
});
passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => user ? done(null, user) : done(new Error("User doesn't exist")))
    .catch(err => done(err))
});

export const getToken = (user: JWTPayload): string => {
  return jwt.sign(user, process.env.JWT_SECRET_KEY || "default_key", {
    expiresIn: 3600,
  });
}

export const jwtPassport = passport.use(new jwtpassport.Strategy({
    jwtFromRequest: jwtpassport.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET_KEY || "default_key"
  }, 
  (jwt_payload, done) => {
    User.findById(jwt_payload._id)
      .then(user => user ? done(null, user) : done(new Error("User doesn't exist")))
      .catch(err => done(err));
  })
)

export const verifyUser = passport.authenticate('jwt', { session: false });

export const verifyAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.admin) next();
  else {
    let err:CustomError = new Error("You are not authorized to perform this operation!");
    err.status = 403;
    return next(err);
  }
}