import { Router, type IRouter } from "express";
import healthRouter from "./health";
import billsRouter from "./bills";
import statsRouter from "./stats";
import accountRouter from "./account";

const router: IRouter = Router();

router.use(healthRouter);
router.use(billsRouter);
router.use(statsRouter);
router.use(accountRouter);

export default router;
