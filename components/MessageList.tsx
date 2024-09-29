import { useRef, useEffect } from "react";
import { TwitchMessage } from "@/types/twitch";
import DOMPurify from "dompurify";
import { cn } from "@/lib/utils";

export function MessageList({
  messages,
  className,
}: {
  messages: TwitchMessage[];
  className?: string;
}) {
  const messageListRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <main
      ref={messageListRef}
      className={cn(className, "overflow-y-hidden scroll-smooth")}
    >
      <div className="flex flex-col justify-end">
        {messages.map((msg) => (
          <div key={msg.id} className="line-clamp-2">
            <span>{msg.user} </span>{" "}
            <span
              className="[&_img]:inline-block [&_img]:relative [&_img]:-mt-0.5 [&_img]:h-6 [&_img]:w-auto"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(msg.content),
              }}
            />
          </div>
        ))}
      </div>
    </main>
  );
}
