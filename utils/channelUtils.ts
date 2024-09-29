export function extractChannelName(input: string): string {
  const url = input.startsWith("http") ? new URL(input) : null;
  return url?.hostname === "www.twitch.tv" || url?.hostname === "twitch.tv"
    ? url.pathname.split("/").filter((segment) => segment !== "")[0] || input
    : input;
}
