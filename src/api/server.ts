import { App } from "./App";
import { validateEnv } from "./utils/validate-env";

import { IndexRoute } from "./routes/index.routes";
import { AuthRoute } from "./routes/auth.routes";
import { FolderTreeRoute } from "./routes/folder-tree.routes";
import { SongRoute } from "./routes/song.routes";
import { UserRoute } from "./routes/user.routes";
import { SearchRoute } from "./routes/search.routes";
import { StatusRoute } from "./routes/status.routes";

export const startServer = () => {
  validateEnv();

  const app = new App([
    new IndexRoute(),
    new AuthRoute(),
    new FolderTreeRoute(),
    new SongRoute(),
    new UserRoute(),
    new SearchRoute(),
    new StatusRoute(),
  ]);

  app.listen();

  return app;
};
