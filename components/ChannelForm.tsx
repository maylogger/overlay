"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { extractChannelName } from "@/utils/channelUtils";
import { cn } from "@/lib/utils";
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
          return true;
        }
      },
      { message: "請輸入有效的 Twitch URL 或頻道名稱" }
    ),
});

export function ChannelForm({
  onSubmit,
  isConnected,
  className,
}: {
  onSubmit: (channel: string) => void;
  isConnected: boolean;
  className?: string;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      channel: localStorage.getItem("savedChannel") || "may_logger",
    },
  });

  function handleSubmit(values: z.infer<typeof formSchema>) {
    const channelName = extractChannelName(values.channel);
    localStorage.setItem("savedChannel", channelName);
    onSubmit(channelName);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className={cn("space-y-2", className)}
      >
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
        <Button type="submit">{isConnected ? "斷開" : "連接"}</Button>
      </form>
    </Form>
  );
}
