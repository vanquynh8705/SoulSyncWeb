export interface User {
  id: string;
  name: string;
  email: string;
  avatarColor?: string;
  isAdmin?: boolean;
  token?: string;
}

export interface QuizQuestion {
  id: number;
  text: string;
  category: "burnout" | "overthinking" | "urgency" | "coping";
  options: {
    value: number;
    text: string;
    subtext?: string;
  }[];
}

export interface QuizAnswer {
  questionId: number;
  value: number;
}

export interface QuizResult {
  scoreBurnout: number; // 1 to 4
  scoreOverthinking: number; // 1 to 4
  scoreUrgency: number; // 1 to 4
  scoreCoping: number; // 1 to 4
  overallScore: number; // average
  profileName: string;
  description: string;
  recommendations: string[];
}

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
}
