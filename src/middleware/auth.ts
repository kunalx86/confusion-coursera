import { CustomError } from "@shared/constants";
import { Request, Response, NextFunction } from "express";

export default (req: Request, _: Response, next: NextFunction) => {
  if (req.user) {
    next();
  }
  else {
    let err:CustomError = new Error("You are not authenticated");
    err.status = 403;
    return next(err);
  }
}