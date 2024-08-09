import { env } from "@/env";
import { MainClient } from "binance";

export const binance = new MainClient({
  api_key: env.BINANCE_API_KEY,
  api_secret: env.BINANCE_SECRET_KEY,
});
