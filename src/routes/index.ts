import { Router, Request, Response } from 'express';
import dishRouter from "./dishRouter";
import leaderRouter from "./leaderRouter";
import promoRouter from "./promoRouter";

// Init router and path
const router = Router();

// Add sub-routes
router.get('/', (_: Request, res: Response) => {
  res.send("Hello!");
});

router.use("/dishes", dishRouter);
router.use("/leaders", leaderRouter);
router.use("/promotions", promoRouter);

// Export the base-router
export default router;
