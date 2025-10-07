import { Config } from '../constants/config';
import { ProductAnalysis, AnalysisResult } from '../types';

export class GeminiService {
  private static async convertImageToBase64(imageUri: string): Promise<string> {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      throw new Error('Failed to convert image to base64');
    }
  }

  static async analyzeProduct(imageUri: string): Promise<AnalysisResult> {
    try {
      if (Config.GEMINI_API_KEY === 'your-gemini-api-key-here') {
        // Return mock data for demo purposes
        return {
          success: true,
          data: {
            productName: "Demo Biscuit Pack",
            brand: "Sample Brand",
            category: "Snack Food",
            ingredients: ["Wheat Flour", "Sugar", "Vegetable Oil", "Salt", "Baking Powder"],
            chemicals: [
              {
                name: "Sodium Bicarbonate",
                purpose: "Leavening agent",
                safety: "Generally safe, used in baking"
              },
              {
                name: "Lecithin",
                purpose: "Emulsifier",
                safety: "Safe food additive, improves texture"
              }
            ],
            nutritionalInfo: {
              calories: "150 per serving",
              protein: "3g",
              carbs: "20g",
              fat: "7g",
              fiber: "1g",
              sodium: "200mg"
            },
            allergens: ["Wheat", "May contain nuts"],
            healthRating: "6/10",
            benefits: ["Source of carbohydrates", "Convenient snack"],
            concerns: ["High in saturated fat", "Contains processed ingredients"],
            storageInstructions: "Store in cool, dry place",
            expiryInfo: "Check package for best before date"
          }
        };
      }

      const base64Image = await this.convertImageToBase64(imageUri);
      
      const requestBody = {
        contents: [
          {
            parts: [
              { text: Config.ANALYSIS_PROMPT },
              {
                inline_data: {
                  mime_type: "image/jpeg",
                  data: base64Image
                }
              }
            ]
          }
        ]
      };

      const response = await fetch(
        `${Config.GEMINI_BASE_URL}/${Config.GEMINI_MODEL}:generateContent?key=${Config.GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const result = await response.json();
      const textResponse = result.candidates[0]?.content?.parts[0]?.text;
      
      if (!textResponse) {
        throw new Error('No response from Gemini API');
      }

      // Extract JSON from response (handle markdown code blocks)
      const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid JSON response from API');
      }

      const analysisData: ProductAnalysis = JSON.parse(jsonMatch[0]);
      
      return {
        success: true,
        data: analysisData
      };
    } catch (error) {
      console.error('Product analysis error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Analysis failed'
      };
    }
  }
}