import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    GROQ_API_KEY: z.string(),
    BINANCE_API_KEY: z.string(),
    BINANCE_SECRET_KEY: z.string(),
    CMC_API_KEY: z.string(),
  },
  client: {},
  runtimeEnv: {
    GROQ_API_KEY: process.env.GROQ_API_KEY,
    BINANCE_API_KEY: process.env.BINANCE_API_KEY,
    BINANCE_SECRET_KEY: process.env.BINANCE_SECRET_KEY,
    CMC_API_KEY: process.env.CMC_API_KEY,
  },
});
