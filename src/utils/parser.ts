import { FoodItem, SearchResult } from '../types';
import { BASE_FOODS } from '../data/baseFoods';

const NUMBER_WORDS: Record<string, number> = {
  a: 1,
  an: 1,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  half: 0.5,
  quarter: 0.25,
  ek: 1,
  do: 2,
  teen: 3,
  char: 4,
  paanch: 5,
  aadha: 0.5,
  dedh: 1.5,
  dhai: 2.5,
};

const FILLER = new Set([
  'i',
  'had',
  'ate',
  'eat',
  'eaten',
  'with',
  'some',
  'of',
  'the',
  'for',
  'breakfast',
  'lunch',
  'dinner',
  'snack',
  'and',
  'plus',
  'also',
  'then',
  'my',
  'today',
  'just',
  'about',
  'around',
  'piece',
  'pieces',
  'plate',
  'plates',
  'bowl',
  'bowls',
  'cup',
  'cups',
  'katori',
  'glass',
  'glasses',
  'serving',
  'servings',
  'slice',
  'slices',
  'scoop',
  'scoops',
  'handful',
]);

export function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/one and a half|1 and a half/g, '1.5')
    .replace(/two and a half|2 and a half/g, '2.5')
    .replace(/[^a-z0-9.\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export interface ParsedPart {
  qty: number;
  query: string;
}

export function parsePhrase(raw: string): ParsedPart[] {
  const text = normalize(raw);
  const parts = text
    .split(/\band\b|\bplus\b|\bwith\b|,|\bthen\b/)
    .map((s) => s.trim())
    .filter(Boolean);

  return parts
    .map((part) => {
      const tokens = part.split(' ');
      let qty = 1;
      const rest: string[] = [];
      for (const t of tokens) {
        if (/^\d+(\.\d+)?$/.test(t)) {
          qty = parseFloat(t);
        } else if (NUMBER_WORDS[t] !== undefined) {
          qty = NUMBER_WORDS[t];
        } else if (!FILLER.has(t)) {
          rest.push(t);
        }
      }
      return { qty, query: rest.join(' ') };
    })
    .filter((p) => p.query);
}

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (!m) return n;
  if (!n) return m;

  const d: number[][] = Array.from({ length: m + 1 }, (_, i) => [
    i,
    ...Array(n).fill(0),
  ]);
  for (let j = 0; j <= n; j++) d[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      d[i][j] = Math.min(
        d[i - 1][j] + 1,
        d[i][j - 1] + 1,
        d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return d[m][n];
}

function similarity(a: string, b: string): number {
  if (a === b) return 1;
  const maxLen = Math.max(a.length, b.length);
  if (maxLen <= 3 && a !== b) return 0;
  return 1 - levenshtein(a, b) / maxLen;
}

export function scoreFood(query: string, food: FoodItem): number {
  const names = [food.name.toLowerCase(), ...food.synonyms.map((s) => s.toLowerCase())];
  let best = 0;
  const qTokens = query.toLowerCase().split(' ');

  for (const name of names) {
    let s = similarity(query.toLowerCase(), name);
    if (name.includes(query.toLowerCase()) || query.toLowerCase().includes(name)) {
      s = Math.max(s, 0.85);
    }
    const nTokens = name.split(' ');
    let matched = 0;
    for (const qt of qTokens) {
      let bestTok = 0;
      for (const nt of nTokens) {
        bestTok = Math.max(bestTok, similarity(qt, nt));
      }
      if (bestTok >= 0.75) matched += bestTok;
    }
    const overlap = matched / Math.max(qTokens.length, nTokens.length);
    best = Math.max(best, s, overlap);
  }
  return best;
}

export function searchFoods(query: string, customFoods: FoodItem[] = []): SearchResult[] {
  const allFoods = [...BASE_FOODS, ...customFoods];
  return allFoods
    .map((f) => ({ food: f, score: scoreFood(query, f) }))
    .filter((r) => r.score >= 0.52)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}
