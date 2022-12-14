import express, { type Application as ExpressApplication } from "express";
import chalk from "chalk";
import morgan from "morgan";
import helmet from "helmet";
import hpp from "hpp";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";

import { Routes } from "./interfaces/routes.interfaces";
import { errorMiddleware } from "./middlewares/error.middleware";
import { stream as logStream } from "./utils/logger";
import { NODE_ENV, PORT, ORIGIN, CREDENTIALS } from "../config";

const LOG_PREFIX = chalk.bgGrey.black(" API ");

export class App {
  public app: ExpressApplication;

  private env: string;

  private port: string | number;

  constructor(routes: Routes[]) {
    this.app = express();
    this.env = NODE_ENV || "development";
    this.port = PORT || 3000;

    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(LOG_PREFIX, `Environment: ${this.env}`);
      console.log(LOG_PREFIX, `Listening on the port :${this.port}`);
    });
  }

  public getServer() {
    return this.app;
  }

  private initializeMiddlewares() {
    this.app.use(
      morgan(NODE_ENV === "development" ? "dev" : "combined", {
        stream: logStream,
        skip: () => process.env.NODE_ENV === "test",
      })
    );

    this.app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }));
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());

    this.app.use((req, res, next) => {
      res.setHeader("X-Powered-By", "LIGMA");
      next();
    });
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach((route) => this.app.use("/", route.router));
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}
