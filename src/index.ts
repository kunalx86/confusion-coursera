import './preStart'; // Must be the first import

// import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';

import express, { NextFunction, Request, Response } from 'express';
import session from 'express-session';
const FileStore = require('session-file-store')(session);

import StatusCodes from 'http-status-codes';
import 'express-async-errors';
import mongoose from "mongoose";

import BaseRouter from './routes';
import logger from '@shared/Logger';
import { CustomError } from '@shared/constants';
import passport from "passport"
const authenticate = require("./authenticate");

// import { SessionOptions } from 'http2';

(async () => {
  const app = express();
  FileStore(session);
  const { BAD_REQUEST } = StatusCodes;
  const url = process.env.MONGO_URL || "";
  try {
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to DB");
  } catch (err) {
    console.error(err);
  }
  /************************************************************************************
   *                              Mongoose Connection Setup
   ***********************************************************************************/



  /************************************************************************************
   *                              Set basic express settings
   ***********************************************************************************/

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  // app.use(cookieParser(process.env.COOKIE_SECRET));
  app.use(session({
    name: 'session-id',
    secret: process.env.SESSION_SECRET || "",
    saveUninitialized: false,
    resave: false,
    store: new FileStore(),
  }));

  app.use(passport.initialize());
  app.use(passport.session())

  // Show routes called in console during development
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }

  // Security
  if (process.env.NODE_ENV === 'production') {
    app.use(helmet());
  }

  // app.use((req: Request, res: Response, next: NextFunction) => {
  //   if (!req.session.user) {
  //     const authHeader = req.headers['authorization'];
  //     if (!authHeader) {
  //       let err:CustomError = new Error("You are not authenticated!");
  //       res.setHeader('WWW-Authenticate', 'Basic')
  //       err.status = 401;
  //       return next(err);
  //     }
  //     const auth = Buffer.from(authHeader.split(' ')[1], "base64").toString().split(':');
  //     const [username, password] = auth;

  //     if (username === 'admin' && password === 'password') {
  //       req.session.user = "admin";
  //       next();
  //     }
  //     else {
  //       let err:CustomError = new Error("You are not authenticated!");
  //       res.setHeader('WWW-Authenticate', 'Basic')
  //       err.status = 401;
  //       return next(err);
  //     }
  //   }
  //   else {
  //     if (req.session.user === 'admin') {
  //       next();
  //     }
  //     else {
  //       let err:CustomError = new Error("You are not admin!");
  //       err.status = 401;
  //       return next(err);
  //     }
  //   }
  // });

  // Add APIs
  app.use('/api', BaseRouter);

  // Print API errors
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
    logger.err(err, true);
    return res.status(err.status || BAD_REQUEST).json({
      error: err.message,
    });
  });

  // Start the server
  const port = Number(process.env.PORT || 3000);
  app.listen(port, () => {
    logger.info('Express server started on port: ' + port);
  });
})();