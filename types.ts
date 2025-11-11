
export enum Goal {
  LOSE_WEIGHT = 'Emagrecer',
  GAIN_MUSCLE = 'Ganhar massa muscular',
  MAINTAIN_WEIGHT = 'Manter o peso',
  IMPROVE_HEALTH = 'Melhorar saúde geral',
}

export enum ActivityLevel {
    SEDENTARY = 'Sedentário',
    LIGHT = 'Levemente ativo',
    MODERATE = 'Moderadamente ativo',
    VERY = 'Muito ativo',
}

export interface UserProfile {
  name: string;
  age: number;
  weight: number;
  height: number;
  sex: 'Masculino' | 'Feminino';
  activityLevel: ActivityLevel;
  goal: Goal;
  dietaryRestrictions: string[];
  preferences: string;
}

export interface Meal {
  name: string;
  calories: number;
  description: string;
  substitutions: string[];
}

export interface MealPlan {
  breakfast: Meal;
  morning_snack: Meal;
  lunch: Meal;
  afternoon_snack: Meal;
  dinner: Meal;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}
