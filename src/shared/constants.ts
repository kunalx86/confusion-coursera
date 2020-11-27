import { Request } from "express";
import { ICommentDocument } from "src/models/Comments";
import { IDishDocument } from "src/models/Dishes";

export interface IRequest extends Request {
  body: {
    name: string,
    description: string,
  }
}

export interface IDishRequest extends Request {
  body: IDishDocument
}

export interface ICommentRequest extends Request {
  body: ICommentDocument
}