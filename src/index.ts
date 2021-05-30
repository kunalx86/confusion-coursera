import './preStart'; // Must be the first import

import morgan from 'morgan';
import helmet from 'helmet';

import express, { NextFunction, Request, Response } from 'express';
import cors from "cors";
import StatusCodes from 'http-status-codes';
import 'express-async-errors';
import mongoose from "mongoose";

import BaseRouter from './routes';
import logger from '@shared/Logger';
import { CustomError } from '@shared/constants';
import passport from "passport"
import "./authenticate";
import { corsWithOptions } from './cors';

(async () => {
  const app = express();
  const { BAD_REQUEST } = StatusCodes;
  /************************************************************************************
   *                              Mongoose Connection Setup
   ***********************************************************************************/
  
  const url = process.env.MONGO_URL || "";
  try {
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to DB");
  } catch (err) {
    console.error(err);
  }
  
  /************************************************************************************
   *                              Set basic express settings
   ***********************************************************************************/

  // app.use(corsWithOptions);
  app.use(
    cors({
      origin: [`http://localhost:${Number(process.env.PORT || 5000)}`],
      credentials: true,
    })
  )
  // app.options("*", corsWithOptions);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(passport.initialize());

  // Show routes called in console during development
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }

  // Security
  if (process.env.NODE_ENV === 'production') {
    app.use(helmet());
  }
    
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