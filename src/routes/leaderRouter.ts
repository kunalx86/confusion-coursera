import express, { Request, Response } from "express";

import { IRequest } from "../shared/constants"; 

const router = express.Router();

router.route("/")
  .all((_: Request, res: Response, next: Function) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
  })
  .get((_: Request, res: Response) => {
    res.send("Will send leaders");
  })
  .post((req: IRequest, res: Response) => {
    res.send(`Will add the leader ${req.body.name} with description ${req.body.description}`);
  })
  .put((_: IRequest, res: Response) => {
    res.statusCode = 403;
    res.send("PUT not supported on /leaders");
  })
  .delete((_: Request, res: Response) => {
    res.send("Will delete all the leaders");
  });

router.route('/:leaderId') 
  .get((req: Request, res: Response) => {
    res.send(`Will send the leader ${req.params?.leaderId}`);
  })
  .post((req: IRequest, res: Response) => {
    res.statusCode = 403;
      res.send(`POST not supported on /leaders/${req.params?.leaderId}/`);
  })
  .put((req: IRequest, res: Response) => {
    res.send(`Will update the leader ${req.params?.leaderId} with information, name ${req.body.name} and description ${req.body.description}`);
  })
  .delete((req: Request, res: Response) => {
    res.send(`Will delete the leader ${req.params?.leaderId}`);
  });

export default router;