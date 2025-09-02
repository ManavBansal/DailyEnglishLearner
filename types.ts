
export interface LearningItem {
  type: 'word' | 'sentence';
  english: string;
  hindi: string;
}

export interface GeminiResponse {
  dailyLesson: LearningItem[];
}
