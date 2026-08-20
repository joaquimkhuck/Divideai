import { Router, type IRouter } from "express";
import healthRouter from "./health";
import billsRouter from "./bills";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use(billsRouter);
router.use(statsRouter);

export default router;
