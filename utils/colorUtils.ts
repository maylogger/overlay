// 將十六進位顏色轉換為 RGB 值
const hexToRgb = (hex: string): number[] => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
};

// 計算顏色的亮度
const calculateLuminance = (r: number, g: number, b: number): number => {
  return 0.299 * r + 0.587 * g + 0.114 * b;
};

// 檢查顏色是否太接近黑色或白色
export const isColorTooCloseToBlackOrWhite = (
  color: string,
  threshold: number = 40
): boolean => {
  const [r, g, b] = hexToRgb(color);
  const luminance = calculateLuminance(r, g, b);
  return luminance < threshold || luminance > 255 - threshold;
};

// 調整顏色以增加對比度
export const adjustColorForContrast = (
  color: string,
  amount: number = 100
): string => {
  const [r, g, b] = hexToRgb(color);
  const luminance = calculateLuminance(r, g, b);

  const newR = luminance < 128 ? Math.min(255, r + amount) : r;
  const newG = luminance < 128 ? Math.min(255, g + amount) : g;
  const newB = luminance < 128 ? Math.min(255, b + amount) : b;

  return `#${newR.toString(16).padStart(2, "0")}${newG
    .toString(16)
    .padStart(2, "0")}${newB.toString(16).padStart(2, "0")}`;
};
