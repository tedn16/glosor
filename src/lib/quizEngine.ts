import type { Direction, GlosaList, Word } from './types';

export function shuffle<T>(input: readonly T[]): T[] {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function promptFor(word: Word, direction: Direction): string {
  return direction === 'en-sv' ? word.en : word.sv;
}

export function answerFor(word: Word, direction: Direction): string {
  return direction === 'en-sv' ? word.sv : word.en;
}

export function normalize(s: string): string {
  return s.trim().toLocaleLowerCase('sv').replace(/\s+/g, ' ');
}

export function isCorrect(given: string, expected: string): boolean {
  return normalize(given) === normalize(expected);
}

/**
 * Pick up to 3 distractors from the same list, plus the correct answer, and shuffle.
 * If the list has fewer than 4 words total, returns whatever is available.
 */
export function buildChoices(
  correct: Word,
  list: GlosaList,
  direction: Direction,
  count = 4,
): string[] {
  const correctAnswer = answerFor(correct, direction);
  const pool = list.words
    .filter((w) => w !== correct)
    .map((w) => answerFor(w, direction))
    .filter((a) => normalize(a) !== normalize(correctAnswer));

  const distractors = shuffle(pool).slice(0, count - 1);
  return shuffle([correctAnswer, ...distractors]);
}
