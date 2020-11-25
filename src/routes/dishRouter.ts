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
    res.send("Will send dishes");
  })
  .post((req: IRequest, res: Response) => {
    res.send(`Will add the dish ${req.body.name} with description ${req.body.description}`);
  })
  .put((_: IRequest, res: Response) => {
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
  .post((req: IRequest, res: Response) => {
    res.statusCode = 403;
      res.send(`POST not supported on /dishes/${req.params?.dishId}/`);
  })
  .put((req: IRequest, res: Response) => {
    res.send(`Will update the dish ${req.params?.dishId} with information, name ${req.body.name} and description ${req.body.description}`);
  })
  .delete((req: Request, res: Response) => {
    res.send(`Will delete the dish ${req.params?.dishId}`);
  });

export default router;