import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ownerToken } from "./middlewares/owner";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
// Non-credentialed CORS only: the owner cookie is the sole credential, so we
// never set Access-Control-Allow-Credentials — browsers will refuse to expose
// credentialed cross-origin responses, keeping the cookie same-origin-only.
app.use(cors());
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(ownerToken);

app.use("/api", router);

export default app;
