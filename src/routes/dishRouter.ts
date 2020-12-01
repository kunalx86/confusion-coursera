import express, { Request, Response } from "express";

import { IDishRequest } from "../shared/constants"; 
import { Dishes } from "../models/Dishes";

const router = express.Router();

router.route("/")
  .get(async (_: Request, res: Response, next: Function) => {
    try {
      const dishes = await Dishes.find({});
      res.status(200).json(dishes);
    } catch (err) {
      next(err);
    }
  })
  .post(async (req: IDishRequest, res: Response, next: Function) => {
    try {
      const dish = await Dishes.create(req.body);
      console.log(`Dish created: ${dish}`);
      res.status(201).json(dish);
    } catch (err) {
      next(err);
    }
  })
  .put((_: IDishRequest, res: Response) => {
    res.statusCode = 403;
    res.send("PUT not supported on /dishes");
  })
  .delete(async (_: Request, res: Response, next: Function) => {
    try {
      const dishes = await Dishes.remove({});
      res.status(200).json(dishes);
    } catch (err) {
      next(err);
    }
  });

router.route('/:dishId') 
  .get(async (req: Request, res: Response, next: Function) => {
    try {
      const dish = await Dishes.findById(req.params.dishId);
      if (dish) {
        res.status(200).json(dish);
      } else {
        res.status(404).json({
          message: `No such dish ${req.params.dishId}` 
        });
      }
    } catch (err) {
      next(err);
    }
  })
  .post((req: IDishRequest, res: Response) => {
    res.statusCode = 403;
      res.send(`POST not supported on /dishes/${req.params?.dishId}/`);
  })
  .put(async (req: IDishRequest, res: Response, next: Function) => {
    try {
      const dish = await Dishes.findByIdAndUpdate(req.params.dishId, {
        $set: req.body,
      }, {
        new: true,
      });
      if (dish) {
        res.status(200).json(dish);
      } else {
        res.status(404).json({
          message: `No such dish ${req.params.dishId}`,
        })
      }  
    } catch (err) {
      next(err);
    }
  })
  .delete(async (req: Request, res: Response, next: Function) => {
    try {
      const dish = await Dishes.findByIdAndRemove(req.params.dishId);
      if (dish) {
        res.status(200).json(dish);
      } else {
        res.status(404).json({
          message: `No such dish ${req.params.dishId}`
        });
      }
    } catch (err) {
      next(err);
    }
  });

export default router;