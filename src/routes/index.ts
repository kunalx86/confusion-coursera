import { CustomError } from '@shared/constants';
import { Router, Request, Response, NextFunction } from 'express';
import dishRouter from "./dishRouter";
import leaderRouter from "./leaderRouter";
import promoRouter from "./promoRouter";
import userRouter from "./userRouter";
import authMiddleware from "../middleware/auth";

// Init router and path
const router = Router();

// Add sub-routes
router.get("/", (_: Request, res: Response) => {
  res.send("Hello!");
});

router.get("/whoami", authMiddleware, (req: Request, res: Response) => {
  res.status(200).send({
    message: `You are user ${req.session.username}`,
  });
})

router.use("/users", userRouter);
router.use("/dishes", authMiddleware, dishRouter);
router.use("/leaders", authMiddleware, leaderRouter);
router.use("/promotions", authMiddleware, promoRouter);

// Export the base-router
export default router;
