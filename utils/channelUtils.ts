export function extractChannelName(input: string) {
  // 如果字串是 URL，就解析 URL
  const url = input.startsWith("http") ? new URL(input) : null;
  // 如果 URL 是 twitch.tv，就回傳 channel name
  // 如果 URL 不是 twitch.tv，就回傳整個字串
  return url?.hostname === "www.twitch.tv" || url?.hostname === "twitch.tv"
    ? url.pathname.split("/").filter((segment) => segment !== "")[0]
    : input;
}
