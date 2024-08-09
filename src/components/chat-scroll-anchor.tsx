"use client";

import useAtBottom from "@/lib/hooks/use-at-bottom";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

function ChatScrollAnchor() {
  const trackVisibility = true;
  const isAtBottom = useAtBottom();
  const { ref, entry, inView } = useInView({
    trackVisibility,
    delay: 100,
    rootMargin: `0px 0px -50px 0px`,
  });

  useEffect(() => {
    if (isAtBottom && trackVisibility && !inView) {
      entry?.target.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  }, [isAtBottom, trackVisibility, inView, entry]);

  return <div ref={ref} className="h-px w-full" />;
}
export default ChatScrollAnchor;
