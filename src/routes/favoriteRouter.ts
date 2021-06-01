import { CustomError, IFavoriteRequest } from "@shared/constants";
import express from "express";
import { verifyUser } from "src/authenticate";
import { Favorite } from "src/models/Favorites";

const router = express.Router();

router.route('/')
  .get(verifyUser, async (req, res, next) => {
    const favorite = await Favorite.findOne({
      user: req.user?.id
    }).populate('dishes').populate('user');
    res.status(200).send(favorite);
  })
  .post(verifyUser, async (req: IFavoriteRequest, res, next) => {
    let favorite;
    try {
      const status = await checkFavoriteDocument(req.user?.id);
      if (status === false) {
        favorite = await Favorite.create({
          user: req.user?.id,
          dishes: [],
        });
      }
      else {
        favorite = status;
      }
      for (const dish of req.body.dishes) {
        if (favorite.dishes.indexOf(dish) !== -1) continue;
        favorite.dishes.push(dish);
      }
      await favorite.save();
    } catch (err) {
      console.error(err);
      let error: CustomError = new Error("Something went wrong");
      error.status = 500;
      return next(error);
    }
    res.send(favorite);
  })
  .delete(verifyUser, async (req, res, next) => {
    const status = await checkFavoriteDocument(req.user?.id);
    if (status === false) {
      res.send({
        message: "Deleted"
      })
    }
    try {
      const removed = await Favorite.remove({
        user: req.user?.id
      });
      res.status(200).send(removed);
    } catch (err) {
      let error: CustomError = new Error("Something went wrong");
      error.status = 500;
      return next(error);
    }
  });

router.route('/:dishId')
  .post(verifyUser, async (req, res, next) => {
    let favorite;
    try {
      const status = await checkFavoriteDocument(req.user?._id);
      if (status === false) {
        favorite = await Favorite.create({
          user: req.user?._id,
          dishes: [],
        });
        console.log(favorite);
      }
      else {
        favorite = status;
        if (favorite.dishes.indexOf(req.params.dishId) !== -1) {
          let error: CustomError = new Error("Dish already exists");
          error.status = 400;
          return next(error);
        }
      }
      favorite.dishes.push(req.params.dishId);
      await favorite.save();
    } catch (err) {
      let error: CustomError = new Error("Something went wrong");
      error.status = 500;
      return next(error);
    }
    res.send(favorite);
  })
  .delete(verifyUser, async (req, res, next) => {
    let favorite;
    try {
      const status = await checkFavoriteDocument(req.user?._id);
      if (status === false) {
        let error: CustomError = new Error("Your favorite document doesn't exist");
        error.status = 400;
        return next(error);
      }
      favorite = status;
      const idx = favorite.dishes.indexOf(req.params.dishId);
      if (idx === -1) {
        let error: CustomError = new Error("Dish specified doesn't exist in your favorite");
        error.status = 400;
        return next(error);
      }
      favorite.dishes.splice(idx, 1);
      await favorite.save();
      res.status(200).send(favorite);
    } catch(err) {
      let error: CustomError = new Error("Something went wrong");
      error.status = 500;
      return next(error);
    }
  });

const checkFavoriteDocument = async (userId: string) => {
  const favorite = await Favorite.findOne({
    user: userId
  });
  return favorite ? favorite : false;
}

export default router;