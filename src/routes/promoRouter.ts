import express, { Request, Response } from "express";

import { IPromotionRequest } from "../shared/constants"; 
import { Promotion } from "../models/Promotions";
import { verifyUser } from "src/authenticate";

const router = express.Router();

router.route("/")
  .get(async (_: Request, res: Response, next: Function) => {
    try {
      const promotions = await Promotion.find({});
      res.status(200).json(promotions);
    } catch (err) {
      next(err);
    }
  })
  .post(verifyUser, async (req: IPromotionRequest, res: Response, next: Function) => {
    try {
      const promotion = await Promotion.create(req.body);
      res.status(201).json(promotion);
    } catch (err) {
      next(err);
    }
  })
  .put(verifyUser, (_: IPromotionRequest, res: Response) => {
    res.statusCode = 403;
    res.send("PUT not supported on /api/promotions");
  })
  .delete(verifyUser, async (_: Request, res: Response, next: Function) => {
    try {
      const promotions = await Promotion.remove({});
      res.status(200).json(promotions);
    } catch (err) {
      next(err);
    }
  });

router.route('/:promotionId') 
  .get(async (req: Request, res: Response, next: Function) => {
    try {
      const promotion = await Promotion.findById(req.params.promotionId);
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
  .post(verifyUser, (req: IPromotionRequest, res: Response) => {
    res.statusCode = 403;
    res.send(`POST not supported on /api/promotions/${req.params?.promotionId}/`);
  })
  .put(verifyUser, async (req: IPromotionRequest, res: Response, next: Function) => {
    try {
      const promotion = await Promotion.findByIdAndUpdate(req.params.promotionId, {
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
  .delete(verifyUser, async (req: Request, res: Response, next: Function) => {
    try {
      const promotion = await Promotion.findByIdAndRemove(req.params.promotionId);
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