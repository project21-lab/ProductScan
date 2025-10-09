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