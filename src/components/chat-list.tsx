"use client";

import { AI } from "@/app/actions";
import { useUIState } from "ai/rsc";

function ChatList() {
  const [messages, setMessages] = useUIState<typeof AI>();

  if (!messages.length) return null;

  return (
    <div className="relative mx-auto max-w-2xl px-4">
      {messages.map((message) => (
        <div key={message.id} className="pb-4">
          {message.display}
        </div>
      ))}
    </div>
  );
}
export default ChatList;
