import { Request } from "express";

export interface IRequest extends Request {
  body: {
    name: string,
    description: string,
  }
}