export interface ProductAnalysis {
  productName: string;
  brand: string;
  category: string;
  ingredients: string[];
  chemicals: Chemical[];
  nutritionalInfo: NutritionalInfo;
  allergens: string[];
  healthRating: string;
  benefits: string[];
  concerns: string[];
  storageInstructions: string;
  expiryInfo: string;
  similarProducts: SimilarProduct[];
}

export interface SimilarProduct {
  name: string;
  brand: string;
  healthRating: string;
  keyBenefit: string;
}

export interface Chemical {
  name: string;
  purpose: string;
  safety: string;
}

export interface NutritionalInfo {
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  fiber: string;
  sodium: string;
  sugar: string;
  saturatedFat: string;
  cholesterol: string;
  vitaminC: string;
  calcium: string;
  iron: string;
}

export interface CapturedImage {
  uri: string;
  base64?: string;
  timestamp: number;
}

export interface AnalysisResult {
  success: boolean;
  data?: ProductAnalysis;
  error?: string;
}