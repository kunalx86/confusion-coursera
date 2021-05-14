import express, { Request, Response } from "express";

import { ICommentRequest, IDishRequest } from "../shared/constants"; 
import { Dish } from "../models/Dishes";
import { Comment } from "../models/Comments";
import { verifyUser } from "src/authenticate";

const router = express.Router();

router.route("/")
  .get(async (_: Request, res: Response, next: Function) => {
    try {
      const dishes = await Dish.find({});
      res.status(200).json(dishes);
    } catch (err) {
      next(err);
    }
  })
  .post(verifyUser, async (req: IDishRequest, res: Response, next: Function) => {
    try {
      const dish = await Dish.create(req.body);
      res.status(201).json(dish);
    } catch (err) {
      next(err);
    }
  })
  .put(verifyUser, (_: IDishRequest, res: Response) => {
    res.statusCode = 403;
    res.send("PUT not supported on /api/dishes");
  })
  .delete(verifyUser, async (_: Request, res: Response, next: Function) => {
    try {
      const dishes = await Dish.remove({});
      res.status(200).json(dishes);
    } catch (err) {
      next(err);
    }
  });

router.route('/:dishId') 
  .get(async (req: Request, res: Response, next: Function) => {
    try {
      const dish = await Dish.findById(req.params.dishId);
      if (dish) {
        res.status(200).json(dish);
      } else {
        res.status(404).json({
          error: `No such dish ${req.params.dishId}` 
        });
      }
    } catch (err) {
      next(err);
    }
  })
  .post(verifyUser, (req: IDishRequest, res: Response) => {
    res.statusCode = 403;
    res.send(`POST not supported on /api/dishes/${req.params?.dishId}/`);
  })
  .put(verifyUser, async (req: IDishRequest, res: Response, next: Function) => {
    try {
      const dish = await Dish.findByIdAndUpdate(req.params.dishId, {
        $set: req.body,
      }, {
        new: true,
      });
      if (dish) {
        res.status(200).json(dish);
      } else {
        res.status(404).json({
          error: `No such dish ${req.params.dishId}`,
        })
      }  
    } catch (err) {
      next(err);
    }
  })
  .delete(verifyUser, async (req: Request, res: Response, next: Function) => {
    try {
      const dish = await Dish.findByIdAndRemove(req.params.dishId);
      if (dish) {
        res.status(200).json(dish);
      } else {
        res.status(404).json({
          error: `No such dish ${req.params.dishId}`
        });
      }
    } catch (err) {
      next(err);
    }
  });

// router.use("/:dishId/comments", commentRouter);
router.route("/:dishId/comments")
  .get(async (req: Request, res: Response, next: Function) => {
    try {
      const dish = await Dish.findById(req.params.dishId);
      if (dish) {
        res.status(200).json({
          comments: dish.comments
        });
      } else {
        res.status(404).json({
          error: `No such dish ${req.params.dishId}`
        });
      }
    } catch (err) {
      next(err);
    }
  })
  .post(verifyUser, async (req: ICommentRequest, res: Response, next: Function) => {
    try {
      const dish = await Dish.findById(req.params.dishId);
      if (dish) {
        dish.comments?.push(new Comment(req.body));
        const newDish = await dish.save();
        res.status(200).json({
          dish: newDish
        });
      } else {
        res.status(404).json({
          error: `No such dish ${req.params.dishId}`
        });
      }
    } catch (err) {
      next(err);
    }
  })
  .put(verifyUser, (req: IDishRequest, res: Response) => {
    res.statusCode = 403;
    res.send(`PUT not supported on /api/dishes/${req.params.dishId}/comments`);
  })
  .delete(verifyUser, async (req: Request, res: Response, next: Function) => {
    try {
      const dish = await Dish.findById(req.params.dishId);
      if (dish) {
        if (dish.comments) {
          for (let i = (dish.comments.length - 1); i >= 0; --i) {
            dish.comments.id(dish.comments[i]._id).remove();            
          }
        }
        const newDish = await dish.save();
        res.status(200).json({
          dish: newDish
        });
      } else {
        res.status(404).json({
          error: `No such dish ${req.params.dishId}`
        });
      }
    } catch (err) {
      next(err);
    }
  });

router.route('/:dishId/comments/:commentId') 
  .get(async (req: Request, res: Response, next: Function) => {
    try {
      const dish = await Dish.findById(req.params.dishId);
      if (dish && dish.comments?.id(req.params.commentId)) {
        res.status(200).json({
          comment: dish.comments.id(req.params.commentId)
        });
      } else if (!dish) {
        res.status(404).json({
          message: `No such dish ${req.params.dishId}` 
        });
      } else {
        res.status(404).json({
          error: `No such comment ${req.params.commentId}`
        });
      }
    } catch (err) {
      next(err);
    }
  })
  .post(verifyUser, (req: IDishRequest, res: Response) => {
    res.statusCode = 403;
    res.send(`POST not supported on /dishes/${req.params?.dishId}/comments/${req.params.commentId}`);
  })
  .put(verifyUser, async (req: ICommentRequest, res: Response, next: Function) => {
    try {
      const dish = await Dish.findById(req.params.dishId);
      if (dish && dish.comments?.id(req.params.commentId)) {
        if (req.body.rating) {
          dish.comments.id(req.params.commentId).rating = req.body.rating;
        }
        if (req.body.comment) {
          dish.comments.id(req.params.commentId).comment = req.body.comment;
        }
        const newDish = await dish.save();
        res.status(200).json({
          comment: newDish.comments?.id(req.params.commentId)
        });
      } else if (!dish) {
        res.status(404).json({
          message: `No such dish ${req.params.dishId}` 
        });
      } else {
        res.status(404).json({
          error: `No such comment ${req.params.commentId}`
        });
      }
    } catch (err) {
      next(err);
    }
  })
  .delete(verifyUser, async (req: Request, res: Response, next: Function) => {
    try {
      const dish = await Dish.findById(req.params.dishId);
      if (dish && dish.comments?.id(req.params.commentId)) {
        dish.comments.id(req.params.commentId).remove();
        const newDish = await dish.save();
        res.status(200).json({
          dish: newDish
        });
      } else if (!dish) {
        res.status(404).json({
          message: `No such dish ${req.params.dishId}` 
        });
      } else {
        res.status(404).json({
          error: `No such comment ${req.params.commentId}`
        });
      }
    } catch (err) {
      next(err);
    }
  });

export default router;