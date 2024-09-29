import { useState, useEffect } from "react";
import tmi from "tmi.js";
import { TwitchMessage } from "@/types/twitch";
import { getMessageHTML } from "@/utils/messageUtils";

export function useTwitchClient(channel: string) {
  const [messages, setMessages] = useState<TwitchMessage[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    if (!channel) return;

    const client = new tmi.Client({
      channels: [channel],
    });

    client.connect().then(() => setIsConnected(true));

    client.on("message", (channel, tags, message, self) => {
      if (self) return;
      setMessages((prev) => {
        const newMessage: TwitchMessage = {
          id: tags["id"] || Date.now().toString(),
          user: tags["display-name"] || tags["username"] || "未知用戶",
          content: getMessageHTML(message, {
            emotes: (tags.emotes as Record<string, string[]>) || {},
          }),
          timestamp: tags["tmi-sent-ts"]
            ? parseInt(tags["tmi-sent-ts"])
            : Date.now(),
          badges: tags.badges ? Object.keys(tags.badges) : undefined,
          color: tags.color,
        };
        return [...prev, newMessage].slice(-100);
      });
    });

    return () => {
      client.disconnect();
      setIsConnected(false);
    };
  }, [channel]);

  return { messages, isConnected };
}