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
    <div className="h-screen flex flex-col items-stretch">
      <ChannelForm
        className="flex-none p-5"
        onSubmit={handleChannelSubmit}
        isConnected={isConnected}
      />
      <MessageList
        className="flex-1 p-5 bg-slate-950 text-slate-100"
        messages={messages}
      />
    </div>
  );
}
