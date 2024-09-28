"use client";

import { useEffect, useState } from "react";
import tmi from "tmi.js";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function Home() {
  const [messages, setMessages] = useState<string[]>([]);
  const [channel, setChannel] = useState<string>("");
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const formSchema = z.object({
    channel: z.string().min(1, { message: "請輸入頻道名稱" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      channel: "may_logger",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (isConnected) {
      setChannel("");
      setIsConnected(false);
    } else {
      setChannel(values.channel);
      setIsConnected(true);
    }
  }

  useEffect(() => {
    if (!channel) return;

    const client = new tmi.Client({
      channels: [channel],
    });

    client.connect();

    client.on("message", (channel, tags, message, self) => {
      if (self) return;
      setMessages((prev) => [...prev, `${tags["display-name"]}: ${message}`]);
    });

    return () => {
      client.disconnect();
    };
  }, [channel]);

  return (
    <div>
      <h1>自製 Twitch 聊天室訊息</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="channel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Twitch 頻道名稱</FormLabel>
                <FormControl>
                  <Input
                    placeholder="輸入頻道名稱"
                    {...field}
                    disabled={isConnected}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {isConnected ? (
            <Button type="submit">斷開</Button>
          ) : (
            <Button type="submit">連接</Button>
          )}
        </form>
      </Form>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}
