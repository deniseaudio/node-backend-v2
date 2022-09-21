import { App } from "./App";
import { validateEnv } from "./utils/validate-env";
import { IndexRoute } from "./routes/IndexRoute";

export const startServer = () => {
  validateEnv();

  const app = new App([new IndexRoute()]);

  app.listen();

  return app;
};
