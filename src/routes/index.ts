import { CustomError } from '@shared/constants';
import { Router, Request, Response, NextFunction } from 'express';
import dishRouter from "./dishRouter";
import leaderRouter from "./leaderRouter";
import promoRouter from "./promoRouter";
import userRouter from "./userRouter";
import { verifyUser } from 'src/authenticate';

// Init router and path
const router = Router();

// Add sub-routes
router.get("/", (_: Request, res: Response) => {
  res.send("Hello!");
});

router.get("/whoami", verifyUser, (req: Request, res: Response) => {
  res.status(200).send({
    message: `You are user ${req.user?.username}`,
  });
})

router.use("/users", userRouter);
router.use("/dishes", dishRouter);
router.use("/leaders", leaderRouter);
router.use("/promotions", promoRouter);

// Export the base-router
export default router;
