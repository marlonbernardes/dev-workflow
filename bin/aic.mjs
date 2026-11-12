#!/usr/bin/env node
import { main } from "../lib/aic.mjs";

process.exitCode = await main();
