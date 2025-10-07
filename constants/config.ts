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
  ANALYSIS_PROMPT: `Analyze this product image and provide detailed information in the following JSON format:
{
  "productName": "Product name",
  "brand": "Brand name",
  "category": "Product category",
  "ingredients": ["ingredient1", "ingredient2"],
  "chemicals": [
    {
      "name": "Chemical name",
      "purpose": "Purpose in product",
      "safety": "Safety information"
    }
  ],
  "nutritionalInfo": {
    "calories": "per serving",
    "protein": "amount",
    "carbs": "amount",
    "fat": "amount",
    "fiber": "amount",
    "sodium": "amount"
  },
  "allergens": ["allergen1", "allergen2"],
  "healthRating": "Rating out of 10",
  "benefits": ["benefit1", "benefit2"],
  "concerns": ["concern1", "concern2"],
  "storageInstructions": "How to store",
  "expiryInfo": "Expiry details if visible"
}

Provide accurate, detailed analysis based on visible text and ingredients on the package.`
};