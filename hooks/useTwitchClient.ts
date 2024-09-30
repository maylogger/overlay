import { useState, useEffect } from "react";
import tmi from "tmi.js";
import { TwitchMessage } from "@/types/twitch";
import { getMessageHTML } from "@/utils/messageUtils";
import { adjustColorForContrast } from "@/utils/colorUtils";
import { resolveColor } from "@/utils/resolveColor";

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
          content: getMessageHTML({
            message,
            emotes: tags.emotes || {},
          }),
          timestamp: tags["tmi-sent-ts"]
            ? parseInt(tags["tmi-sent-ts"])
            : Date.now(),
          badges: tags.badges ? Object.keys(tags.badges) : undefined,
          color: adjustColorForContrast(
            resolveColor(
              channel,
              tags["display-name"] || tags["username"] || "未知用戶",
              tags.color || null
            )
          ),
        };
        return [...prev, newMessage].slice(-10);
      });
    });

    return () => {
      client.disconnect();
      setIsConnected(false);
    };
  }, [channel]);

  return { messages, isConnected };
}
