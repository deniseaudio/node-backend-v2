import { App } from "./App";
import { validateEnv } from "./utils/validate-env";

import { IndexRoute } from "./routes/index.routes";
import { AuthRoute } from "./routes/auth.routes";
import { FolderTreeRoute } from "./routes/folder-tree.routes";
import { SongRoute } from "./routes/song.routes";

export const startServer = () => {
  validateEnv();

  const app = new App([
    new IndexRoute(),
    new AuthRoute(),
    new FolderTreeRoute(),
    new SongRoute(),
  ]);

  app.listen();

  return app;
};
