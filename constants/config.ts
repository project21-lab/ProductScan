// Configuration for ProductScan App
export const Config = {
  // Add your Gemini API key here
  GEMINI_API_KEY: 'your-gemini-api-key-here',
  
  // Gemini API settings
  GEMINI_MODEL: 'gemini-1.5-flash',
  GEMINI_BASE_URL: 'https://generativelanguage.googleapis.com/v1beta/models',
  
  // App settings
  MAX_IMAGE_SIZE: 1024 * 1024, // 1MB
  SUPPORTED_FORMATS: ['jpg', 'jpeg', 'png'],
  
  // Analysis prompt template
  ANALYSIS_PROMPT: `You are an expert food scientist and nutritionist. Analyze this product image thoroughly and provide comprehensive information in the following JSON format. Be very detailed and accurate:

{
  "productName": "Exact product name from package",
  "brand": "Brand name from package",
  "category": "Food category (e.g., Snack Food, Beverage, Dairy)",
  "ingredients": ["List ALL ingredients in order as shown on package"],
  "chemicals": [
    {
      "name": "Chemical/Additive name (E-numbers, preservatives, etc.)",
      "purpose": "What it does in the product",
      "safety": "Safety profile and potential effects"
    }
  ],
  "nutritionalInfo": {
    "calories": "per serving with unit",
    "protein": "amount with unit",
    "carbs": "amount with unit",
    "fat": "amount with unit",
    "fiber": "amount with unit",
    "sodium": "amount with unit",
    "sugar": "amount with unit",
    "saturatedFat": "amount with unit",
    "cholesterol": "amount with unit",
    "vitaminC": "amount with unit or N/A",
    "calcium": "amount with unit or N/A",
    "iron": "amount with unit or N/A"
  },
  "allergens": ["All allergens and 'may contain' warnings"],
  "healthRating": "X/10 (numeric rating)",
  "benefits": ["Detailed health benefits and positive aspects"],
  "concerns": ["Health concerns, high sodium/sugar, artificial additives, etc."],
  "storageInstructions": "Storage instructions from package",
  "expiryInfo": "Expiry date if visible, or general shelf life info",
  "similarProducts": [
    {
      "name": "Similar healthier product name",
      "brand": "Brand of similar product",
      "healthRating": "X/10",
      "keyBenefit": "Main advantage over current product"
    }
  ]
}

IMPORTANT:
- Read ALL visible text on the package carefully
- Include complete ingredient lists
- Identify all chemical additives and preservatives
- Provide realistic health ratings based on ingredients
- Suggest 3-5 similar but healthier alternatives
- Be thorough with nutritional analysis
- Only return valid JSON, no markdown formatting`
};