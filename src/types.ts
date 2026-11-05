export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface FoodItem {
  id?: string;
  name: string;
  synonyms: string[];
  serving: string;
  grams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  category: 'staples' | 'curries' | 'protein' | 'breakfast' | 'snacks' | 'fruits' | 'beverages' | 'custom';
}

export interface LogEntry {
  id: string;
  name: string;
  serving: string;
  qty: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meal: MealType;
  timestamp: number;
}

export interface Profile {
  weight: number; // in kg
  height?: number; // in cm
  caloriesGoal: number; // in kcal
  proteinGoal: number; // in grams
  carbsGoal: number; // in grams
  fatGoal: number; // in grams
  geminiKey?: string;
  name?: string;
}

export interface SearchResult {
  food: FoodItem;
  score: number;
}

export interface DayLogs {
  [dateKey: string]: LogEntry[];
}
