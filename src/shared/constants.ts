import { Request } from "express";
import { ICommentDocument } from "src/models/Comments";
import { IDishDocument } from "src/models/Dishes";
import { ILeaderDocument } from "src/models/Leaders";
import { IPromotionDocument } from "src/models/Promotions";
import { IUserDocument } from "src/models/Users";

export interface IDishRequest extends Request {
  body: IDishDocument
}

export interface ICommentRequest extends Request {
  body: ICommentDocument
}

export interface IPromotionRequest extends Request {
  body: IPromotionDocument
}

export interface ILeaderRequest extends Request {
  body: ILeaderDocument
}

export interface IUserRequest extends Request {
  body: IUserDocument
}

interface ExpressError {
  status?: number
}

export type CustomError = ExpressError & Error;