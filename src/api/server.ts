import { App } from "./App";
import { validateEnv } from "./utils/validate-env";

import { IndexRoute } from "./routes/IndexRoute";
import { AuthRoute } from "./routes/AuthRoute";

export const startServer = () => {
  validateEnv();

  const app = new App([new IndexRoute(), new AuthRoute()]);

  app.listen();

  return app;
};
