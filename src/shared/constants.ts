import { Request } from "express";
import { ICommentDocument } from "src/models/Comments";
import { IDishDocument } from "src/models/Dishes";
import { ILeaderDocument } from "src/models/Leaders";
import { IPromotionDocument } from "src/models/Promotions";

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