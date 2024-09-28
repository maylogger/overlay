"use client";

import { useEffect, useState } from "react";
import tmi from "tmi.js";

export default function Home() {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const client = new tmi.Client({
      channels: ["may_logger"],
    });

    client.connect();

    client.on("message", (channel, tags, message, self) => {
      setMessages((prev) => [
        ...prev,
        `${tags["display-name"]}: ${message} ${self}`,
      ]);
    });

    return () => {
      client.disconnect();
    };
  }, []);

  return (
    <div>
      <h1>Twitch 聊天室訊息</h1>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}
