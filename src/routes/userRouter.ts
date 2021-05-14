import { CustomError, IUserRequest } from '@shared/constants';
import express, { NextFunction, Request, Response } from 'express';
import { Users } from 'src/models/Users';
import authMiddleware from "../middleware/auth";

const router = express.Router();

router.route("/register")
  .post(async (req: IUserRequest, res: Response, next: NextFunction) => {
    const isUser = await Users.findOne({
      username: req.body.username
    });
    if (isUser) {
      let err:CustomError = new Error(`User ${isUser.username} already exists`);
      err.status = 403;
      return next(err);
    }

    const user = await Users.create({
      username: req.body.username,
      password: req.body.password,
      admin: req.body.admin || false,
    });
    res.status(200).send({
      status: "Registration succesfull",
      user,
    })
  });

router.route("/login")
  .post(async (req: IUserRequest, res: Response, next: NextFunction) => {
    if (req.session.user) {
      res.status(200).send({
        message: "You are already authenticated. If you want to login as different user please log out first"
      });
    }

    const user = await Users.findOne({
      username: req.body.username
    });

    if (!user) {
      let err:CustomError = new Error(`User with username ${req.body.username} doesn't exist`);
      err.status = 403;
      return next(err);
    }

    if (user.username === req.body.username && user.password === req.body.password) {
      req.session.user = user.admin ? "admin" : "regular";
      req.session.username = user.username;
      res.status(200).send({
        message: `You are authenticated as ${req.session.user}`
      })
    }
    else {
      let err:CustomError = new Error("Your password is incorrect");
      err.status = 403;
      return next(err);
    }
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