import express, { Request, Response } from "express";

import { ILeaderRequest } from "../shared/constants"; 
import { Leader } from "../models/Leaders";

const router = express.Router();

router.route("/")
  .get(async (_: Request, res: Response, next: Function) => {
    try {
      const leaders = await Leader.find({});
      res.status(200).json(leaders);
    } catch (err) {
      next(err);
    }
  })
  .post(async (req: ILeaderRequest, res: Response, next: Function) => {
    try {
      const leader = await Leader.create(req.body);
      res.status(201).json(leader);
    } catch (err) {
      next(err);
    }
  })
  .put((_: ILeaderRequest, res: Response) => {
    res.statusCode = 403;
    res.send("PUT not supported on /api/leaders");
  })
  .delete(async (_: Request, res: Response, next: Function) => {
    try {
      const leaders = await Leader.remove({});
      res.status(200).json(leaders);
    } catch (err) {
      next(err);
    }
  });

router.route('/:leaderId') 
  .get(async (req: Request, res: Response, next: Function) => {
    try {
      const leader = await Leader.findById(req.params.leaderId);
      if (leader) {
        res.status(200).json(leader);
      } else {
        res.status(404).json({
          error: `No such leader ${req.params.leaderId}` 
        });
      }
    } catch (err) {
      next(err);
    }
  })
  .post((req: ILeaderRequest, res: Response) => {
    res.statusCode = 403;
    res.send(`POST not supported on /api/leaders/${req.params?.leaderId}/`);
  })
  .put(async (req: ILeaderRequest, res: Response, next: Function) => {
    try {
      const leader = await Leader.findByIdAndUpdate(req.params.leaderId, {
        $set: req.body,
      }, {
        new: true,
      });
      if (leader) {
        res.status(200).json(leader);
      } else {
        res.status(404).json({
          error: `No such leader ${req.params.leaderId}`,
        })
      }  
    } catch (err) {
      next(err);
    }
  })
  .delete(async (req: Request, res: Response, next: Function) => {
    try {
      const leader = await Leader.findByIdAndRemove(req.params.leaderId);
      if (leader) {
        res.status(200).json(leader);
      } else {
        res.status(404).json({
          error: `No such leader ${req.params.leaderId}`
        });
      }
    } catch (err) {
      next(err);
    }
  });

export default router;