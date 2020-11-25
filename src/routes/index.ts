import { Router, Request, Response } from 'express';

// Init router and path
const router = Router();

// Add sub-routes
router.get('/', (_: Request, res: Response) => {
  res.send("Hello!");
});

// Export the base-router
export default router;
