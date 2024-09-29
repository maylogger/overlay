import { useRef } from "react";
import { TwitchMessage } from "@/types/twitch";
import DOMPurify from "dompurify";

type MessageListProps = {
  messages: TwitchMessage[];
};

export function MessageList({ messages }: MessageListProps) {
  const messageListRef = useRef<HTMLUListElement>(null);

  return (
    <main ref={messageListRef} className="space-y-0.5 mt-2 overflow-y-hidden">
      {messages.map((msg) => (
        <li key={msg.id} className="line-clamp-2">
          <span>{msg.user} </span>{" "}
          <span
            className="[&_img]:inline-block [&_img]:relative [&_img]:-mt-0.5 [&_img]:h-6 [&_img]:w-auto"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(msg.content),
            }}
          />
        </li>
      ))}
    </main>
  );
}
