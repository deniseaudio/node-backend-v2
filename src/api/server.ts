import { App } from "./App";
import { validateEnv } from "./utils/validate-env";

export const startServer = () => {
  validateEnv();

  const app = new App();

  app.listen();

  return app;
};
