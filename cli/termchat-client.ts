#!/usr/bin/env -S deno run --allow-net

import { main } from "../src/client.ts";

if (import.meta.main) {
  main();
}