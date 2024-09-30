// 型別定義
interface Emote {
  [id: string]: string[];
}
interface StringReplacement {
  stringToReplace: string;
  replacement: string;
}
interface MessageWithEmotes {
  message: string;
  emotes: Emote;
}

// 修改函式簽名
export function getMessageHTML({ message, emotes }: MessageWithEmotes) {
  // 如果沒有表情符號，就直接回傳 message
  if (!emotes) return message;

  // 用來存放 emote 替換的 string
  const stringReplacements: StringReplacement[] = [];

  // 遍歷 emotes，將 emote 替換為 img 標籤
  Object.entries(emotes).forEach(([id, positions]) => {
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

  // 將 message 中的 emote 替換為 img 標籤
  const messageHTML = stringReplacements.reduce(
    (acc, { stringToReplace, replacement }) => {
      return acc.split(stringToReplace).join(replacement);
    },
    message
  );

  return messageHTML;
}
