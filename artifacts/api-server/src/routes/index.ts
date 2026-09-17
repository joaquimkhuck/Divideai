import { Router, type IRouter } from "express";
import healthRouter from "./health";
import billsRouter from "./bills";
import statsRouter from "./stats";
import authRouter from "./auth";
import paymentsRouter from "./payments";

const router: IRouter = Router();

router.use(healthRouter);
router.use(billsRouter);
router.use(statsRouter);
router.use(authRouter);
router.use(paymentsRouter);

export default router;
