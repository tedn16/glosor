export interface Word {
  en: string;
  sv: string;
}

export interface GlosaList {
  id: string;
  title: string;
  week: number;
  words: Word[];
}

export type Direction = 'en-sv' | 'sv-en';
export type Mode = 'type' | 'choice';

export interface QuizConfig {
  list: GlosaList;
  direction: Direction;
  mode: Mode;
}

export interface AnswerRecord {
  prompt: string;
  expected: string;
  given: string;
  correct: boolean;
}
