import express, { NextFunction, Request, Response } from 'express';
import { User, UserDocument } from 'src/models/Users';
import passport from "passport";
import { getToken, verifyAdmin, verifyUser } from 'src/authenticate';

const router = express.Router();

router.get('/', verifyUser, verifyAdmin, async (req: Request, res: Response) => {
  const users = await User.find({});
  res.status(200).send(users);
})

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
      }), req.body.password)
    } catch(err) {
      throw err;
    }
    user.firstname = req.body.firstname || '';
    user.lastname = req.body.lastname || '';
    await user.save();
    passport.authenticate('local')(req, res, () => {
      res.status(200).send({
        success: true,
        status: "Registration successfull",
        user,
      })
    })
  });

router.route("/login")
  .post(passport.authenticate('local'), (req: Request, res: Response) => {
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
    const token = getToken({
      _id: req.user?.id
    });
    res.status(200).send({
      success: true,
      message: "You have logged in successfully",
      token,
    })
  });

router.route("/logout")
  .get(verifyUser, (req: Request, res: Response, next: NextFunction) => {
    req.session.destroy((err) => next(err));
    res.clearCookie("session-id");
    res.send({
      message: "You have been logged out successfully"
    })
  });

export default router;