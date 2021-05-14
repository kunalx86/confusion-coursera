import { CustomError, IUserRequest } from '@shared/constants';
import express, { NextFunction, Request, Response } from 'express';
import { User, UserDocument } from 'src/models/Users';
import authMiddleware from "../middleware/auth";
import passport from "passport";

const router = express.Router();

router.route("/register")
  .post(async (req: Request, res: Response) => {
    // const isUser = await User.findOne({
    //   username: req.body.username
    // });
    // if (isUser) {
    //   let err:CustomError = new Error(`User ${isUser.username} already exists`);
    //   err.status = 403;
    //   return next(err);
    // }
    // const user = await User.create({
    //   username: req.body.username,
    //   password: req.body.password,
    //   admin: req.body.admin || false,
    // });
    // res.status(200).send({
    //   status: "Registration succesfull",
    //   user,
    // })
    let user:UserDocument;
    try {
      user = await User.register(new User({
        username: req.body.username,
        admin: req.body.admin || false, 
      }), req.body.password)
    } catch(err) {
      throw err;
    }
    passport.authenticate('local')(req, res, () => {
      res.status(200).send({
        success: true,
        status: "Registration successfull",
        user,
      })
    })
  });

router.route("/login")
  .post(passport.authenticate('local'), (_: Request, res: Response) => {
    // if (req.session.user) {
    //   res.status(200).send({
    //     message: "You are already authenticated. If you want to login as different user please log out first"
    //   });
    // }

    // const user = await User.findOne({
    //   username: req.body.username
    // });

    // if (!user) {
    //   let err:CustomError = new Error(`User with username ${req.body.username} doesn't exist`);
    //   err.status = 403;
    //   return next(err);
    // }

    // if (user.username === req.body.username && user.password === req.body.password) {
    //   req.session.user = user.admin ? "admin" : "regular";
    //   req.session.username = user.username;
    //   res.status(200).send({
    //     message: `You are authenticated as ${req.session.user}`
    //   })
    // }
    // else {
    //   let err:CustomError = new Error("Your password is incorrect");
    //   err.status = 403;
    //   return next(err);
    // }
    res.status(200).send({
      success: true,
      message: "You have logged in successfully",
    })
  });

router.route("/logout")
  .get(authMiddleware, (req: Request, res: Response, next: NextFunction) => {
    req.session.destroy((err) => next(err));
    res.clearCookie("session-id");
    res.send({
      message: "You have been logged out successfully"
    })
  });

export default router;