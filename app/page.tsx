"use client";

import { useEffect, useState, useRef } from "react";
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
import DOMPurify from "dompurify";
import { TwitchMessage } from "@/types/twitch"; // 新增這行

export default function Home() {
  const [messages, setMessages] = useState<TwitchMessage[]>([]); // 所有 messages
  const [channel, setChannel] = useState<string>(""); // 所在頻道
  const [isConnected, setIsConnected] = useState<boolean>(false); // 連線狀態
  const messageListRef = useRef<HTMLUListElement>(null); // 訊息列表

  const formSchema = z.object({
    channel: z
      .string()
      .min(1)
      .refine(
        (value) => {
          try {
            const url = new URL(value);
            return (
              url.hostname === "www.twitch.tv" || url.hostname === "twitch.tv"
            );
          } catch {
            // 如果不是有效的 URL，假設它是一個頻道名稱
            return true;
          }
        },
        { message: "請輸入有效的 Twitch URL 或頻道名稱" }
      ),
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
      setMessages([]);
    } else {
      const channelName = extractChannelName(values.channel);
      setChannel(channelName);
      setIsConnected(true);
    }
  }

  // 從輸入分析頻道名稱
  function extractChannelName(input: string): string {
    const url = input.startsWith("http") ? new URL(input) : null;
    return url?.hostname === "www.twitch.tv" || url?.hostname === "twitch.tv"
      ? url.pathname.split("/").filter((segment) => segment !== "")[0] || input
      : input;
  }

  function getMessageHTML(
    message: string,
    { emotes }: { emotes: Record<string, string[]> }
  ): string {
    if (!emotes) return message;

    // 儲存所有表情符號關鍵字
    // ! 你必須先掃描訊息字串，之後再進行替換
    const stringReplacements: {
      stringToReplace: string;
      replacement: string;
    }[] = [];

    // 遍歷表情符號以存取 ID 和位置
    Object.entries(emotes).forEach(([id, positions]) => {
      // 只使用第一個位置來找出表情符號關鍵字
      const position = positions[0];
      const [start, end] = position.split("-");
      const stringToReplace = message.substring(
        parseInt(start, 10),
        parseInt(end, 10) + 1
      );

      stringReplacements.push({
        stringToReplace: stringToReplace,
        replacement: `<img src="https://static-cdn.jtvnw.net/emoticons/v2/${id}/default/dark/3.0">`,
      });
    });

    // 生成 HTML 並將所有表情符號關鍵字替換為圖片元素
    const messageHTML = stringReplacements.reduce(
      (acc, { stringToReplace, replacement }) => {
        // obs 瀏覽器似乎不知道 replaceAll
        return acc.split(stringToReplace).join(replacement);
      },
      message
    );

    return messageHTML;
  }

  // 使用 useMemo 來記憶最新的 10 條訊息
  useEffect(() => {
    if (!channel) return;

    const client = new tmi.Client({
      channels: [channel],
    });

    client.connect();

    client.on("message", (channel, tags, message, self) => {
      if (self) return;
      setMessages((prev) => {
        const newMessage: TwitchMessage = {
          id: tags["id"] || Date.now().toString(),
          user: tags["display-name"] || tags["username"] || "未知用戶",
          content: getMessageHTML(message, {
            emotes: (tags.emotes as Record<string, string[]>) || {},
          }),
        };
        // 只保留最新的 10 條訊息
        return [...prev, newMessage].slice(-10);
      });
    });

    return () => {
      client.disconnect();
    };
  }, [channel]);

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
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
      <ul ref={messageListRef} className="space-y-0.5 mt-2">
        {messages.map((msg, index) => (
          <li key={msg.id} className="line-clamp-1">
            <span className="text-red-500 mr-1">{index}</span>
            <span>{msg.user} </span>{" "}
            <span
              className="[&_img]:inline-block [&_img]:relative [&_img]:-mt-0.5 [&_img]:h-6 [&_img]:w-auto"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(msg.content),
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
