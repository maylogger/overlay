export function getMessageHTML(
  message: string,
  { emotes }: { emotes: Record<string, string[]> }
): string {
  if (!emotes) return message;

  const stringReplacements: {
    stringToReplace: string;
    replacement: string;
  }[] = [];

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

  const messageHTML = stringReplacements.reduce(
    (acc, { stringToReplace, replacement }) => {
      return acc.split(stringToReplace).join(replacement);
    },
    message
  );

  return messageHTML;
}
