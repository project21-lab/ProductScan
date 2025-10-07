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
        // Return enhanced mock data for demo purposes
        return {
          success: true,
          data: {
            productName: "Cream Filled Chocolate Biscuits",
            brand: "Demo Foods",
            category: "Snack Food - Cookies & Biscuits",
            ingredients: [
              "Wheat Flour", "Sugar", "Vegetable Oil (Palm)", "Cocoa Powder", 
              "Milk Powder", "Salt", "Baking Powder", "Artificial Vanilla Flavoring", 
              "Soy Lecithin (E322)", "Sodium Bicarbonate (E500)", "Artificial Colors (E102, E110)"
            ],
            chemicals: [
              {
                name: "Soy Lecithin (E322)",
                purpose: "Emulsifier to bind ingredients and improve texture",
                safety: "Generally safe, derived from soybeans, helps with mixing"
              },
              {
                name: "Sodium Bicarbonate (E500)",
                purpose: "Leavening agent for light texture",
                safety: "Safe baking soda, commonly used in food production"
              },
              {
                name: "Artificial Colors (E102, E110)",
                purpose: "Food coloring for visual appeal",
                safety: "May cause hyperactivity in children, avoid if sensitive"
              },
              {
                name: "Palm Oil",
                purpose: "Fat source for texture and shelf life",
                safety: "High in saturated fat, environmental concerns"
              }
            ],
            nutritionalInfo: {
              calories: "150 per 30g serving",
              protein: "2.5g",
              carbs: "20g",
              fat: "7g",
              fiber: "1g",
              sodium: "180mg",
              sugar: "8g",
              saturatedFat: "3.5g",
              cholesterol: "5mg",
              vitaminC: "N/A",
              calcium: "20mg",
              iron: "1.2mg"
            },
            allergens: ["Contains: Wheat, Milk, Soy", "May contain: Nuts, Eggs"],
            healthRating: "4/10",
            benefits: [
              "Quick energy source from carbohydrates",
              "Contains some iron for blood health",
              "Convenient portable snack",
              "Provides immediate glucose for brain function"
            ],
            concerns: [
              "High in saturated fat (3.5g per serving)",
              "Contains artificial colors that may affect children",
              "High sugar content (8g per serving)",
              "Palm oil has environmental impact",
              "Processed ingredients with minimal nutritional value",
              "High calorie density for small serving size"
            ],
            storageInstructions: "Store in cool, dry place below 25°C. Keep away from direct sunlight.",
            expiryInfo: "Best before 12 months from manufacture date. Check package for exact date.",
            similarProducts: [
              {
                name: "Oat & Honey Digestive Biscuits",
                brand: "Healthy Choice",
                healthRating: "7/10",
                keyBenefit: "Higher fiber content and no artificial colors"
              },
              {
                name: "Dark Chocolate Rice Cakes",
                brand: "Nature's Own",
                healthRating: "8/10",
                keyBenefit: "Lower calories and antioxidants from dark chocolate"
              },
              {
                name: "Whole Grain Crackers",
                brand: "Wholesome",
                healthRating: "7/10",
                keyBenefit: "More fiber and protein, less sugar"
              },
              {
                name: "Almond & Date Energy Balls",
                brand: "Pure Snacks",
                healthRating: "9/10",
                keyBenefit: "Natural ingredients, healthy fats, no artificial additives"
              }
            ]
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
        const errorData = await response.text();
        console.error('Gemini API Error Response:', errorData);
        throw new Error(`Gemini API error ${response.status}: ${errorData}`);
      }

      const result = await response.json();
      const textResponse = result.candidates[0]?.content?.parts[0]?.text;
      
      if (!textResponse) {
        throw new Error('No response from Gemini API');
      }

      // Extract JSON from response (handle markdown code blocks and clean response)
      let cleanResponse = textResponse.trim();
      
      // Remove markdown code blocks if present
      if (cleanResponse.startsWith('```json')) {
        cleanResponse = cleanResponse.replace(/```json\n?/, '').replace(/\n?```$/, '');
      } else if (cleanResponse.startsWith('```')) {
        cleanResponse = cleanResponse.replace(/```\n?/, '').replace(/\n?```$/, '');
      }
      
      // Find JSON object
      const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error('No JSON found in response:', textResponse);
        throw new Error('Invalid JSON response from API. Response: ' + textResponse.substring(0, 200));
      }

      let analysisData: ProductAnalysis;
      try {
        analysisData = JSON.parse(jsonMatch[0]);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.error('Attempted to parse:', jsonMatch[0]);
        throw new Error('Failed to parse API response as JSON');
      }
      
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