"use client";

import { AI } from "@/app/actions";
import useEnterSubmit from "@/lib/hooks/use-enter-submit";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActions, useUIState } from "ai/rsc";
import { ArrowDown, PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import TextAutosizeArea from "react-textarea-autosize";
import { z } from "zod";
import { UserMessage } from "./llm/message";
import { Button } from "./ui/button";

const chatSchema = z.object({
  message: z.string().min(1, "Message is required"),
});

interface Props {}

function ChatForm({}: Props) {
  const { formRef, onKeyDown } = useEnterSubmit();
  const [messages, setMessages] = useUIState<typeof AI>();
  const { sendMessage } = useActions<typeof AI>();
  const form = useForm<z.infer<typeof chatSchema>>({
    resolver: zodResolver(chatSchema),
    defaultValues: { message: "" },
  });

  async function onSubmit(data: z.infer<typeof chatSchema>) {
    const message = data.message.trim();
    formRef.current?.reset();

    if (!message) return;

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: Date.now(),
        role: "user",
        display: <UserMessage>{message}</UserMessage>,
      },
    ]);

    try {
      const responseMessage = await sendMessage(message);

      setMessages((currentMessages) => [...currentMessages, responseMessage]);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="fixed inset-x-0 bottom-0 w-full bg-gradient-to-b from-muted/30 from-0% to-muted/30 to-50% peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px]">
      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <div className="px-3 flex justify-center flex-col py-2 space-y-4 border-t shadow-lg bg-background sm:rounded-t-xl sm:border md:py-4 bg-white">
          <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)}>
            <div className="relative flex flex-col w-full overflow-hidden max-h-60 grow bg-background sm:rounded-md sm:border">
              <TextAutosizeArea
                autoFocus
                tabIndex={0}
                onKeyDown={onKeyDown}
                spellCheck={false}
                autoComplete="off"
                autoCorrect="off"
                rows={1}
                placeholder="Send a message"
                className="min-h-[60px] w-full resize-none bg-transparent pl-4 pr-16 py-[1.3rem] focus-within:outline-none sm:text-sm"
                {...form.register("message")}
              />
              <div className="absolute right-0 top-4 sm:right-4">
                <Button
                  type="submit"
                  size={"icon"}
                  disabled={form.watch("message") === ""}
                >
                  <ArrowDown className="size-5" />
                  <span className="sr-only">Send message</span>
                </Button>
              </div>
            </div>
          </form>

          <Button
            variant={"outline"}
            size={"lg"}
            onClick={(e) => {
              e.preventDefault();
              window.location.reload();
            }}
            className="p-4 mt-4 rounded-full bg-background"
          >
            <PlusIcon className="size-5" />
            <span>New chat</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
export default ChatForm;
