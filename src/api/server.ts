import { App } from "./App";
import { validateEnv } from "./utils/validate-env";

import { IndexRoute } from "./routes/index.routes";
import { AuthRoute } from "./routes/auth.routes";
import { FolderTreeRoute } from "./routes/folder-tree.routes";

export const startServer = () => {
  validateEnv();

  const app = new App([
    new IndexRoute(),
    new AuthRoute(),
    new FolderTreeRoute(),
  ]);

  app.listen();

  return app;
};
