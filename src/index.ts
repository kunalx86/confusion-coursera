import './preStart'; // Must be the first import

import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';

import express, { NextFunction, Request, Response } from 'express';
import StatusCodes from 'http-status-codes';
import 'express-async-errors';
import mongoose from "mongoose";

import BaseRouter from './routes';
import logger from '@shared/Logger';

(async () => {
  const app = express();
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
  app.use(cookieParser());

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
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.err(err, true);
    return res.status(BAD_REQUEST).json({
      error: err.message,
    });
  });

  // Start the server
  const port = Number(process.env.PORT || 3000);
  app.listen(port, () => {
    logger.info('Express server started on port: ' + port);
  });
})();