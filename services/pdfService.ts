import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { ProductAnalysis } from '../types';

export class PDFService {
  static generateHTML(analysis: ProductAnalysis, imageUri?: string): string {
    const currentDate = new Date().toLocaleDateString();
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Product Analysis Report</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              margin: 40px;
              color: #333;
              line-height: 1.6;
            }
            .header {
              text-align: center;
              border-bottom: 3px solid #2196F3;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .product-image {
              text-align: center;
              margin: 20px 0;
            }
            .product-image img {
              max-width: 300px;
              max-height: 200px;
              border-radius: 8px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            .section {
              margin: 25px 0;
              padding: 20px;
              background: #f8f9fa;
              border-radius: 8px;
              border-left: 4px solid #2196F3;
            }
            .section h3 {
              color: #2196F3;
              margin-top: 0;
              font-size: 18px;
            }
            .ingredient-list {
              display: flex;
              flex-wrap: wrap;
              gap: 8px;
              margin-top: 10px;
            }
            .ingredient-tag {
              background: #e3f2fd;
              padding: 4px 12px;
              border-radius: 16px;
              font-size: 14px;
              color: #1976d2;
            }
            .chemical-item {
              background: white;
              padding: 15px;
              margin: 10px 0;
              border-radius: 6px;
              border: 1px solid #e0e0e0;
            }
            .nutrition-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 15px;
              margin-top: 15px;
            }
            .nutrition-item {
              background: white;
              padding: 12px;
              border-radius: 6px;
              text-align: center;
              border: 1px solid #e0e0e0;
            }
            .rating {
              font-size: 24px;
              font-weight: bold;
              color: #4CAF50;
              text-align: center;
              padding: 15px;
              background: white;
              border-radius: 6px;
              margin: 10px 0;
            }
            .footer {
              text-align: center;
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              color: #666;
              font-size: 12px;
            }
            .similar-product {
              background: white;
              padding: 16px;
              margin: 12px 0;
              border-radius: 8px;
              border-left: 4px solid #FF6B35;
            }
            .similar-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 8px;
            }
            .similar-header h4 {
              margin: 0;
              color: #333;
              font-size: 16px;
            }
            .rating-badge {
              background: #4CAF50;
              color: white;
              padding: 4px 8px;
              border-radius: 12px;
              font-size: 12px;
              font-weight: bold;
            }
            .benefit {
              display: flex;
              align-items: center;
              margin-top: 8px;
              color: #4CAF50;
            }
            .benefit-icon {
              margin-right: 8px;
            }
            .list-item {
              margin: 8px 0;
              padding: 8px 12px;
              background: white;
              border-radius: 4px;
              border-left: 3px solid #4CAF50;
            }
            .concern-item {
              border-left-color: #f44336;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Product Analysis Report</h1>
            <h2>${analysis.productName}</h2>
            <p>Brand: ${analysis.brand} | Category: ${analysis.category}</p>
            <p>Generated on: ${currentDate}</p>
          </div>

          ${imageUri ? `
          <div class="product-image">
            <img src="${imageUri}" alt="Product Image" />
          </div>
          ` : ''}

          <div class="section">
            <h3>🌟 Health Rating</h3>
            <div class="rating">${analysis.healthRating}</div>
          </div>

          <div class="section">
            <h3>📋 Ingredients</h3>
            <div class="ingredient-list">
              ${analysis.ingredients.map(ingredient => 
                `<span class="ingredient-tag">${ingredient}</span>`
              ).join('')}
            </div>
          </div>

          <div class="section">
            <h3>🧪 Chemical Analysis</h3>
            ${analysis.chemicals.map(chemical => `
              <div class="chemical-item">
                <h4>${chemical.name}</h4>
                <p><strong>Purpose:</strong> ${chemical.purpose}</p>
                <p><strong>Safety:</strong> ${chemical.safety}</p>
              </div>
            `).join('')}
          </div>

          <div class="section">
            <h3>📊 Complete Nutritional Information</h3>
            <div class="nutrition-grid">
              <div class="nutrition-item">
                <strong>Calories</strong><br>${analysis.nutritionalInfo.calories}
              </div>
              <div class="nutrition-item">
                <strong>Protein</strong><br>${analysis.nutritionalInfo.protein}
              </div>
              <div class="nutrition-item">
                <strong>Carbs</strong><br>${analysis.nutritionalInfo.carbs}
              </div>
              <div class="nutrition-item">
                <strong>Total Fat</strong><br>${analysis.nutritionalInfo.fat}
              </div>
              <div class="nutrition-item">
                <strong>Saturated Fat</strong><br>${analysis.nutritionalInfo.saturatedFat}
              </div>
              <div class="nutrition-item">
                <strong>Sugar</strong><br>${analysis.nutritionalInfo.sugar}
              </div>
              <div class="nutrition-item">
                <strong>Fiber</strong><br>${analysis.nutritionalInfo.fiber}
              </div>
              <div class="nutrition-item">
                <strong>Sodium</strong><br>${analysis.nutritionalInfo.sodium}
              </div>
              <div class="nutrition-item">
                <strong>Cholesterol</strong><br>${analysis.nutritionalInfo.cholesterol}
              </div>
              <div class="nutrition-item">
                <strong>Vitamin C</strong><br>${analysis.nutritionalInfo.vitaminC}
              </div>
              <div class="nutrition-item">
                <strong>Calcium</strong><br>${analysis.nutritionalInfo.calcium}
              </div>
              <div class="nutrition-item">
                <strong>Iron</strong><br>${analysis.nutritionalInfo.iron}
              </div>
            </div>
          </div>

          <div class="section">
            <h3>⚠️ Allergens</h3>
            <div class="ingredient-list">
              ${analysis.allergens.map(allergen => 
                `<span class="ingredient-tag" style="background: #ffebee; color: #c62828;">${allergen}</span>`
              ).join('')}
            </div>
          </div>

          <div class="section">
            <h3>✅ Benefits</h3>
            ${analysis.benefits.map(benefit => 
              `<div class="list-item">${benefit}</div>`
            ).join('')}
          </div>

          <div class="section">
            <h3>⚠️ Health Concerns</h3>
            ${analysis.concerns.map(concern => 
              `<div class="list-item concern-item">${concern}</div>`
            ).join('')}
          </div>

          <div class="section">
            <h3>📦 Storage & Expiry Information</h3>
            <p><strong>Storage:</strong> ${analysis.storageInstructions}</p>
            <p><strong>Expiry Info:</strong> ${analysis.expiryInfo}</p>
          </div>

          ${analysis.similarProducts && analysis.similarProducts.length > 0 ? `
          <div class="section">
            <h3>🔄 Healthier Alternative Recommendations</h3>
            ${analysis.similarProducts.map(product => `
              <div class="similar-product">
                <div class="similar-header">
                  <h4>${product.name}</h4>
                  <span class="rating-badge">${product.healthRating}</span>
                </div>
                <p><strong>Brand:</strong> ${product.brand}</p>
                <div class="benefit">
                  <span class="benefit-icon">✨</span>
                  <span>${product.keyBenefit}</span>
                </div>
              </div>
            `).join('')}
          </div>
          ` : ''}

          <div class="footer">
            <p>Generated by ProductScan App</p>
            <p>This analysis is based on AI interpretation and should not replace professional advice</p>
          </div>
        </body>
      </html>
    `;
  }

  static async exportToPDF(analysis: ProductAnalysis, imageUri?: string): Promise<void> {
    try {
      const html = this.generateHTML(analysis, imageUri);
      
      const { uri } = await Print.printToFileAsync({
        html,
        base64: false,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Share Product Analysis Report',
          UTI: 'com.adobe.pdf'
        });
      } else {
        throw new Error('Sharing is not available on this device');
      }
    } catch (error) {
      throw new Error('Failed to export PDF: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }
}