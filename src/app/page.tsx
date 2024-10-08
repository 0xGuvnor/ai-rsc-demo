import ChatForm from "@/components/chat-form";
import ChatList from "@/components/chat-list";
import ChatScrollAnchor from "@/components/chat-scroll-anchor";

export default function Home() {
  return (
    <main>
      <div className="pb-[200px] pt-4 md:pt-10">
        <ChatList />
        <ChatScrollAnchor />
      </div>

      <ChatForm />
    </main>
  );
}
