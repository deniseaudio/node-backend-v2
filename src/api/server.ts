import { App } from "./App";
import { validateEnv } from "./utils/validate-env";

import { IndexRoute } from "./routes/index.routes";
import { AuthRoute } from "./routes/auth.routes";

export const startServer = () => {
  validateEnv();

  const app = new App([new IndexRoute(), new AuthRoute()]);

  app.listen();

  return app;
};
