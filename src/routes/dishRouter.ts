import express, { Request, Response } from "express";
import * as mongoose from "mongoose";

import { IDishRequest } from "../shared/constants"; 
import { Dishes } from "../models/Dishes";

const router = express.Router();

router.route("/")
  .get(async (_: Request, res: Response) => {
    try {
      const dishes = await Dishes.find({});
      res.status(200).json(dishes);
    } catch (err) {
      console.error(err);
    }
  })
  .post((req: IDishRequest, res: Response) => {
    res.send(`Will add the dish ${req.body.name} with description ${req.body.description}`);
  })
  .put((_: IDishRequest, res: Response) => {
    res.statusCode = 403;
    res.send("PUT not supported on /dishes");
  })
  .delete((_: Request, res: Response) => {
    res.send("Will delete all the dishes");
  });

router.route('/:dishId') 
  .get((req: Request, res: Response) => {
    res.send(`Will send the dish ${req.params?.dishId}`);
  })
  .post((req: IDishRequest, res: Response) => {
    res.statusCode = 403;
      res.send(`POST not supported on /dishes/${req.params?.dishId}/`);
  })
  .put((req: IDishRequest, res: Response) => {
    res.send(`Will update the dish ${req.params?.dishId} with information, name ${req.body.name} and description ${req.body.description}`);
  })
  .delete((req: Request, res: Response) => {
    res.send(`Will delete the dish ${req.params?.dishId}`);
  });

export default router;