import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Twitch 聊天室訊息",
  description: "勞哥提供之自製 Twitch 聊天室訊息",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body className="p-5">{children}</body>
    </html>
  );
}
