#!/usr/bin/env node
import { main } from "../lib/note.mjs";

process.exitCode = await main();
