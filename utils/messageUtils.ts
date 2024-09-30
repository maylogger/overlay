// 型別定義
interface Emote {
  [id: string]: string[];
}
interface MessageWithEmotes {
  message: string;
  emotes: Emote;
}

// 修改函式簽名
export function getMessageHTML({ message, emotes }: MessageWithEmotes): string {
  // 如果沒有表情符號，就直接回傳 message
  if (!emotes || Object.keys(emotes).length === 0) return message;

  // 使用 Array.from() 將訊息轉換為字元陣列
  const splitText = Array.from(message);

  // 遍歷 emotes 物件
  for (const [id, positions] of Object.entries(emotes)) {
    for (const position of positions) {
      const [start, end] = position.split("-").map(Number);
      const length = end - start + 1;

      // 建立空白陣列來替換表情符號文字
      const empty = Array(length).fill("");

      // 替換表情符號文字為空白
      splitText.splice(start, length, ...empty);

      // 插入表情符號的 img 標籤
      splitText[
        start
      ] = `<img class="emoticon" src="https://static-cdn.jtvnw.net/emoticons/v2/${id}/default/dark/3.0">`;
    }
  }

  // 將處理後的字元陣列合併成字串
  return splitText.join("");
}
