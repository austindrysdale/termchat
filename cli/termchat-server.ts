#!/usr/bin/env -S deno run --allow-net

import { main } from "../src/server.ts";

if (import.meta.main) {
  main();
}