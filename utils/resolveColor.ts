const defaultColors = [
  "#FF0000",
  "#0000FF",
  "#008000",
  "#B22222",
  "#FF7F50",
  "#9ACD32",
  "#FF4500",
  "#2E8B57",
  "#DAA520",
  "#D2691E",
  "#5F9EA0",
  "#1E90FF",
  "#FF69B4",
  "#8A2BE2",
  "#00FF7F",
];

const randomColorsChosen: Record<string, Record<string, string>> = {};

export function resolveColor(
  channel: string,
  name: string,
  color: string | null
): string {
  if (color !== null) {
    return color;
  }
  if (!(channel in randomColorsChosen)) {
    randomColorsChosen[channel] = {};
  }
  if (name in randomColorsChosen[channel]) {
    color = randomColorsChosen[channel][name];
  } else {
    color = defaultColors[Math.floor(Math.random() * defaultColors.length)];
    randomColorsChosen[channel][name] = color;
  }
  return color;
}
