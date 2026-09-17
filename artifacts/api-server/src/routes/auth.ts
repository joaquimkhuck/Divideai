import { Router, type IRouter } from "express";
import { getAuth } from "@clerk/express";
import { GetAuthMeResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/auth/me", (req, res) => {
  if (!process.env.CLERK_SECRET_KEY) {
    res.json(GetAuthMeResponse.parse({ authenticated: false, userId: null }));
    return;
  }

  const { userId } = getAuth(req);
  res.json(GetAuthMeResponse.parse({ authenticated: Boolean(userId), userId }));
});

export default router;
