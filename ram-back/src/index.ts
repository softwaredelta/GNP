// (c) Delta Software 2023, rights reserved.

import { start } from "./app";

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
