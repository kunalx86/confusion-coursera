import express, { Request, Response } from "express";

import { IPromotionRequest } from "../shared/constants"; 
import { Promotions } from "../models/Promotions";

const router = express.Router();

router.route("/")
  .get(async (_: Request, res: Response, next: Function) => {
    try {
      const promotions = await Promotions.find({});
      res.status(200).json(promotions);
    } catch (err) {
      next(err);
    }
  })
  .post(async (req: IPromotionRequest, res: Response, next: Function) => {
    try {
      const promotion = await Promotions.create(req.body);
      res.status(201).json(promotion);
    } catch (err) {
      next(err);
    }
  })
  .put((_: IPromotionRequest, res: Response) => {
    res.statusCode = 403;
    res.send("PUT not supported on /api/promotions");
  })
  .delete(async (_: Request, res: Response, next: Function) => {
    try {
      const promotions = await Promotions.remove({});
      res.status(200).json(promotions);
    } catch (err) {
      next(err);
    }
  });

router.route('/:promotionId') 
  .get(async (req: Request, res: Response, next: Function) => {
    try {
      const promotion = await Promotions.findById(req.params.promotionId);
      if (promotion) {
        res.status(200).json(promotion);
      } else {
        res.status(404).json({
          error: `No such promotion ${req.params.promotionId}` 
        });
      }
    } catch (err) {
      next(err);
    }
  })
  .post((req: IPromotionRequest, res: Response) => {
    res.statusCode = 403;
    res.send(`POST not supported on /api/promotions/${req.params?.promotionId}/`);
  })
  .put(async (req: IPromotionRequest, res: Response, next: Function) => {
    try {
      const promotion = await Promotions.findByIdAndUpdate(req.params.promotionId, {
        $set: req.body,
      }, {
        new: true,
      });
      if (promotion) {
        res.status(200).json(promotion);
      } else {
        res.status(404).json({
          error: `No such promotion ${req.params.promotionId}`,
        })
      }  
    } catch (err) {
      next(err);
    }
  })
  .delete(async (req: Request, res: Response, next: Function) => {
    try {
      const promotion = await Promotions.findByIdAndRemove(req.params.promotionId);
      if (promotion) {
        res.status(200).json(promotion);
      } else {
        res.status(404).json({
          error: `No such promotion ${req.params.promotionId}`
        });
      }
    } catch (err) {
      next(err);
    }
  });

export default router;