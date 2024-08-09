"use server";

import { BotCard, BotMessage } from "@/components/llm/message";
import { PriceCard } from "@/components/llm/price-card";
import { PriceCardSkeleton } from "@/components/llm/price-card-skeleton";
import { StatsCard } from "@/components/llm/stats-card";
import { StatsCardSkeleton } from "@/components/llm/stats-card-skeleton";
import { env } from "@/env";
import { groq } from "@/lib/ai-model";
import { binance } from "@/lib/crypto";
import { CoreMessage, ToolInvocation } from "ai";
import { createAI, getMutableAIState, streamUI } from "ai/rsc";
import { Loader2 } from "lucide-react";
import { ReactNode } from "react";
import { z } from "zod";

const initialPrompt = `You are a cryto bot and you can help users get the prices of cryptocurrencies.

Messages inside [] means that it's a UI element or a user event. For example:

- "[Price of BTC = 1000000]" means that the interface of the cryptocurrency price of BTC is shown to the user
- "[Stats of BTC]" means that the interface of the cryptocurrency stats of BTC is shown to the user

If the user wants the price, call \`get_crypto_price\` to show the price.
If the user wants the market capitalisation or stats of a given cryptocurrency, call \`get_crypto_stats\` to show the stats.
If the user wants a stock price, it is an impossible task, so you should respond that you are a demo that can only provide cryptocurrency data.

If the user wants to do anything else unrelated to the aforementioned function calls, you should chat with the user and answer any questions they may have.`;

export async function sendMessage(message: string): Promise<ClientMessage> {
  const history = getMutableAIState<typeof AI>();

  history.update([...history.get(), { role: "user", content: message }]);

  const reply = await streamUI({
    model: groq("llama-3.1-70b-versatile"),
    messages: [
      { role: "system", content: initialPrompt, toolInvocations: [] },
      ...history.get(),
    ] as CoreMessage[],
    initial: (
      <BotMessage className="items-center flex shrink-0 select-none justify-center">
        <Loader2 className="size-5 animate-spin stroke-zinc-900" />
      </BotMessage>
    ),
    text: ({ content, done }) => {
      if (done) {
        history.done([...history.get(), { role: "assistant", content }]);
      }

      return <BotMessage>{content}</BotMessage>;
    },
    temperature: 0,
    tools: {
      get_crypto_price: {
        description:
          "Get the current price of a given crytocurrency. Use this to show the price to the user.",
        parameters: z.object({
          symbol: z
            .string()
            .describe("The symbol of the cryptocurrency. E.g. BTC/SOL/ETH"),
        }),
        generate: async function* ({ symbol }) {
          yield (
            <BotCard loading>
              <PriceCardSkeleton />
            </BotCard>
          );

          const stats = await binance.get24hrChangeStatististics({
            symbol: `${symbol}USDT`,
          });

          const price = Number(stats.lastPrice);
          const delta = Number(stats.priceChange);

          history.done([
            ...history.get(),
            {
              role: "assistant",
              name: "get_crypto_price",
              content: `[Price of ${symbol} = ${price}]`,
            },
          ]);

          return (
            <BotCard>
              <PriceCard delta={delta} price={price} symbol={symbol} />
            </BotCard>
          );
        },
      },
      get_crypto_stats: {
        description:
          "Get the market stats of a given crytocurrency. Use this to show the stats to the user.",
        parameters: z.object({
          slug: z
            .string()
            .describe(
              "The name of the crytocurrency in lowercase. E.g. bitcoin/solana/ethereum"
            ),
        }),
        generate: async function* ({ slug }) {
          yield (
            <BotCard loading>
              <StatsCardSkeleton />
            </BotCard>
          );

          const url = new URL(
            "https://api.coinmarketcap.com/data-api/v3/cryptocurrency/detail"
          );

          url.searchParams.append("slug", slug);
          url.searchParams.append("limit", "1");
          url.searchParams.append("sortBy", "market_cap");

          const res = await fetch(url, {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "X-CMC_PRO_API_KEY": env.CMC_API_KEY,
            },
          });

          if (!res.ok) {
            history.done([
              ...history.get(),
              {
                role: "assistant",
                name: "get_crypto_stats",
                content: "Crypto not found!",
              },
            ]);
            return <BotMessage>Crypto not found</BotMessage>;
          }

          const json = (await res.json()) as {
            data: {
              id: number;
              name: string;
              symbol: string;
              volume: number;
              volumeChangePercentage24h: number;
              statistics: {
                rank: number;
                totalSupply: number;
                marketCap: number;
                marketCapDominance: number;
              };
            };
          };
          const data = json.data;
          const stats = data.statistics;

          const marketStats = {
            name: data.name,
            symbol: data.symbol,
            volume: data.volume,
            volumeChangePercentage24h: data.volumeChangePercentage24h,
            rank: stats.rank,
            marketCap: stats.marketCap,
            totalSupply: stats.totalSupply,
            dominance: stats.marketCapDominance,
          };

          history.done([
            ...history.get(),
            {
              role: "assistant",
              name: "get_crypto_stats",
              content: `[Stats of ${data.symbol}]`,
            },
          ]);

          return (
            <BotCard>
              <StatsCard {...marketStats} />
            </BotCard>
          );
        },
      },
    },
  });

  return {
    id: Date.now(),
    role: "assistant",
    display: reply.value,
  };
}

interface ServerMessage {
  id?: number;
  name?: "get_crypto_price" | "get_crypto_stats";
  role: "user" | "assistant" | "system";
  content: string;
}

interface ClientMessage {
  id: number;
  role: "user" | "assistant";
  display: ReactNode;
  toolInvocations?: ToolInvocation[];
}

export type AIState = ServerMessage[];
export type UIState = ClientMessage[];

export const AI = createAI({
  initialAIState: [] as AIState,
  initialUIState: [] as UIState,
  actions: { sendMessage },
});
