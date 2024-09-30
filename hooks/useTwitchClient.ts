import { useState, useEffect } from "react";
import tmi from "tmi.js";
import { TwitchMessage } from "@/types/twitch";
import { getMessageHTML } from "@/utils/messageUtils";
import { adjustColorForContrast } from "@/utils/colorUtils";
export function useTwitchClient(channel: string) {
  const [messages, setMessages] = useState<TwitchMessage[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    if (!channel) return;

    const client = new tmi.Client({
      channels: [channel],
    });

    client.connect().then(() => setIsConnected(true));

    const defaultColors = [
      "#FF0000",
      "#0000FF",
      "#008000",
      "#B22222",
      "#FF7F50",
      "#9ACD32",
      "#FF4500",
      "#2E8B57",
      "#DAA520",
      "#D2691E",
      "#5F9EA0",
      "#1E90FF",
      "#FF69B4",
      "#8A2BE2",
      "#00FF7F",
    ];
    const randomColorsChosen: Record<string, Record<string, string>> = {};

    function resolveColor(
      channel: string,
      name: string,
      color: string | undefined
    ) {
      if (color !== null) {
        return color;
      }
      if (!(channel in randomColorsChosen)) {
        randomColorsChosen[channel] = {};
      }
      if (name in randomColorsChosen[channel]) {
        color = randomColorsChosen[channel][name];
      } else {
        color = defaultColors[Math.floor(Math.random() * defaultColors.length)];
        randomColorsChosen[channel][name] = color;
      }
      return color;
    }

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
          color: resolveColor(
            channel,
            tags["display-name"] || tags["username"] || "未知用戶",
            tags.color
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
