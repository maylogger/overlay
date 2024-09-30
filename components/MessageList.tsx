"use client";

import { useRef } from "react";
import { TwitchMessage } from "@/types/twitch";
import DOMPurify from "dompurify";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function MessageList({
  messages,
  className,
}: {
  messages: TwitchMessage[];
  className?: string;
}) {
  const messageListRef = useRef<HTMLUListElement>(null);

  return (
    <main
      ref={messageListRef}
      className={cn(
        className,
        "overflow-hidden flex flex-col justify-end items-stretch"
      )}
    >
      <AnimatePresence>
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            className="line-clamp-3 flex-none"
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            transition={{ duration: 0.125 }}
          >
            <span>{msg.user} </span>{" "}
            <span
              className="[&_img]:inline-block [&_img]:relative [&_img]:-mt-0.5 [&_img]:h-6 [&_img]:w-auto"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(msg.content),
              }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </main>
  );
}
