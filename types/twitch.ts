export interface TwitchEmote {
  id: string;
  positions: string[];
}

export interface TwitchMessage {
  id: string;
  user: string;
  content: string;
  timestamp: number; // 新增這行
  badges?: string[];
  color: string;
}
