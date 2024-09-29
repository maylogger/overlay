"use client";

import { useState } from "react";
import { ChannelForm } from "@/components/ChannelForm";
import { MessageList } from "@/components/MessageList";
import { useTwitchClient } from "@/hooks/useTwitchClient";

export default function Home() {
  const [channel, setChannel] = useState<string>("");
  const { messages, isConnected } = useTwitchClient(channel);

  function handleChannelSubmit(newChannel: string) {
    if (isConnected) {
      setChannel("");
    } else {
      setChannel(newChannel);
    }
  }

  return (
    <div>
      <ChannelForm onSubmit={handleChannelSubmit} isConnected={isConnected} />
      <MessageList messages={messages} />
    </div>
  );
}
