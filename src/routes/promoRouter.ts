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
    res.send("Will send promotions");
  })
  .post((req: IRequest, res: Response) => {
    res.send(`Will add the promotion ${req.body.name} with description ${req.body.description}`);
  })
  .put((_: IRequest, res: Response) => {
    res.statusCode = 403;
    res.send("PUT not supported on /promotions");
  })
  .delete((_: Request, res: Response) => {
    res.send("Will delete all the promotions");
  });

router.route('/:promoId') 
  .get((req: Request, res: Response) => {
    res.send(`Will send the promotion ${req.params?.promoId}`);
  })
  .post((req: IRequest, res: Response) => {
    res.statusCode = 403;
      res.send(`POST not supported on /promotions/${req.params?.promoId}/`);
  })
  .put((req: IRequest, res: Response) => {
    res.send(`Will update the promotion ${req.params?.promoId} with information, name ${req.body.name} and description ${req.body.description}`);
  })
  .delete((req: Request, res: Response) => {
    res.send(`Will delete the promotion ${req.params?.promoId}`);
  });

export default router;