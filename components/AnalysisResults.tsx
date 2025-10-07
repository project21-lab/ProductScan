import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProductAnalysis } from '../types';

const { width } = Dimensions.get('window');

interface AnalysisResultsProps {
  analysis: ProductAnalysis;
  imageUri?: string;
  onNewScan: () => void;
  onExportPDF: () => void;
  isExporting?: boolean;
}

export function AnalysisResults({ 
  analysis, 
  imageUri,
  onNewScan, 
  onExportPDF, 
  isExporting = false 
}: AnalysisResultsProps) {
  const insets = useSafeAreaInsets();

  const getHealthRatingColor = (rating: string): string => {
    const numRating = parseFloat(rating.split('/')[0]);
    if (numRating >= 8) return '#4CAF50';
    if (numRating >= 6) return '#FF9800';
    return '#f44336';
  };

  const renderSection = (
    title: string, 
    icon: string, 
    children: React.ReactNode,
    color: string = '#2196F3'
  ) => (
    <View style={styles.section}>
      <View style={[styles.sectionHeader, { backgroundColor: color }]}>
        <MaterialIcons name={icon as any} size={20} color="white" />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4CAF50', '#45a049']}
        style={[styles.header, { paddingTop: insets.top }]}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <MaterialIcons name="analytics" size={28} color="white" />
            <Text style={styles.headerTitle}>Analysis Results</Text>
          </View>
          <TouchableOpacity
            style={styles.exportButton}
            onPress={onExportPDF}
            disabled={isExporting}
          >
            {isExporting ? (
              <MaterialIcons name="hourglass-empty" size={20} color="white" />
            ) : (
              <MaterialIcons name="picture-as-pdf" size={20} color="white" />
            )}
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Product Header */}
          <View style={styles.productHeader}>
            {imageUri && (
              <Image
                source={{ uri: imageUri }}
                style={styles.productImage}
                contentFit="cover"
              />
            )}
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{analysis.productName}</Text>
              <Text style={styles.brandName}>{analysis.brand}</Text>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{analysis.category}</Text>
              </View>
            </View>
          </View>

          {/* Health Rating */}
          {renderSection(
            'Health Rating',
            'star',
            <View style={styles.ratingContainer}>
              <Text style={[
                styles.ratingText,
                { color: getHealthRatingColor(analysis.healthRating) }
              ]}>
                {analysis.healthRating}
              </Text>
              <View style={styles.ratingBar}>
                <View 
                  style={[
                    styles.ratingFill,
                    { 
                      width: `${(parseFloat(analysis.healthRating.split('/')[0]) / 10) * 100}%`,
                      backgroundColor: getHealthRatingColor(analysis.healthRating)
                    }
                  ]} 
                />
              </View>
            </View>,
            getHealthRatingColor(analysis.healthRating)
          )}

          {/* Ingredients */}
          {renderSection(
            'Ingredients',
            'list',
            <View style={styles.tagsContainer}>
              {analysis.ingredients.map((ingredient, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{ingredient}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Nutritional Info */}
          {renderSection(
            'Complete Nutritional Information',
            'restaurant',
            <View style={styles.nutritionGrid}>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>Calories</Text>
                <Text style={styles.nutritionValue}>{analysis.nutritionalInfo.calories}</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>Protein</Text>
                <Text style={styles.nutritionValue}>{analysis.nutritionalInfo.protein}</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>Carbs</Text>
                <Text style={styles.nutritionValue}>{analysis.nutritionalInfo.carbs}</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>Total Fat</Text>
                <Text style={styles.nutritionValue}>{analysis.nutritionalInfo.fat}</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>Saturated Fat</Text>
                <Text style={styles.nutritionValue}>{analysis.nutritionalInfo.saturatedFat}</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>Fiber</Text>
                <Text style={styles.nutritionValue}>{analysis.nutritionalInfo.fiber}</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>Sugar</Text>
                <Text style={styles.nutritionValue}>{analysis.nutritionalInfo.sugar}</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>Sodium</Text>
                <Text style={styles.nutritionValue}>{analysis.nutritionalInfo.sodium}</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>Cholesterol</Text>
                <Text style={styles.nutritionValue}>{analysis.nutritionalInfo.cholesterol}</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>Vitamin C</Text>
                <Text style={styles.nutritionValue}>{analysis.nutritionalInfo.vitaminC}</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>Calcium</Text>
                <Text style={styles.nutritionValue}>{analysis.nutritionalInfo.calcium}</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>Iron</Text>
                <Text style={styles.nutritionValue}>{analysis.nutritionalInfo.iron}</Text>
              </View>
            </View>
          )}

          {/* Chemicals */}
          {renderSection(
            'Chemical Analysis',
            'science',
            <View>
              {analysis.chemicals.map((chemical, index) => (
                <View key={index} style={styles.chemicalItem}>
                  <Text style={styles.chemicalName}>{chemical.name}</Text>
                  <Text style={styles.chemicalPurpose}>
                    <Text style={styles.label}>Purpose: </Text>
                    {chemical.purpose}
                  </Text>
                  <Text style={styles.chemicalSafety}>
                    <Text style={styles.label}>Safety: </Text>
                    {chemical.safety}
                  </Text>
                </View>
              ))}
            </View>,
            '#9C27B0'
          )}

          {/* Allergens */}
          {analysis.allergens.length > 0 && renderSection(
            'Allergens',
            'warning',
            <View style={styles.tagsContainer}>
              {analysis.allergens.map((allergen, index) => (
                <View key={index} style={[styles.tag, styles.allergenTag]}>
                  <Text style={styles.allergenText}>{allergen}</Text>
                </View>
              ))}
            </View>,
            '#f44336'
          )}

          {/* Benefits */}
          {renderSection(
            'Benefits',
            'thumb-up',
            <View>
              {analysis.benefits.map((benefit, index) => (
                <View key={index} style={styles.listItem}>
                  <MaterialIcons name="check-circle" size={16} color="#4CAF50" />
                  <Text style={styles.listText}>{benefit}</Text>
                </View>
              ))}
            </View>,
            '#4CAF50'
          )}

          {/* Concerns */}
          {renderSection(
            'Health Concerns',
            'report-problem',
            <View>
              {analysis.concerns.map((concern, index) => (
                <View key={index} style={styles.listItem}>
                  <MaterialIcons name="error" size={16} color="#f44336" />
                  <Text style={styles.listText}>{concern}</Text>
                </View>
              ))}
            </View>,
            '#f44336'
          )}

          {/* Storage Info */}
          {renderSection(
            'Storage & Expiry Information',
            'inventory',
            <View>
              <View style={styles.storageItem}>
                <Text style={styles.label}>Storage Instructions:</Text>
                <Text style={styles.storageText}>{analysis.storageInstructions}</Text>
              </View>
              <View style={styles.storageItem}>
                <Text style={styles.label}>Expiry Information:</Text>
                <Text style={styles.storageText}>{analysis.expiryInfo}</Text>
              </View>
            </View>
          )}

          {/* Similar Products Recommendations */}
          {analysis.similarProducts && analysis.similarProducts.length > 0 && renderSection(
            'Healthier Alternatives',
            'recommend',
            <View>
              {analysis.similarProducts.map((product, index) => (
                <View key={index} style={styles.similarProductItem}>
                  <View style={styles.similarProductHeader}>
                    <Text style={styles.similarProductName}>{product.name}</Text>
                    <View style={[styles.ratingBadge, { 
                      backgroundColor: getHealthRatingColor(product.healthRating) 
                    }]}>
                      <Text style={styles.ratingBadgeText}>{product.healthRating}</Text>
                    </View>
                  </View>
                  <Text style={styles.similarProductBrand}>Brand: {product.brand}</Text>
                  <View style={styles.benefitContainer}>
                    <MaterialIcons name="star" size={16} color="#4CAF50" />
                    <Text style={styles.similarProductBenefit}>{product.keyBenefit}</Text>
                  </View>
                </View>
              ))}
            </View>,
            '#FF6B35'
          )}
        </View>
      </ScrollView>

      <View style={[styles.bottomControls, { paddingBottom: insets.bottom }]}>
        <TouchableOpacity
          style={styles.newScanButton}
          onPress={onNewScan}
        >
          <MaterialIcons name="camera-alt" size={20} color="#2196F3" />
          <Text style={styles.newScanButtonText}>New Scan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  exportButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  productHeader: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 16,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  brandName: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  categoryText: {
    color: '#1976d2',
    fontSize: 12,
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  sectionContent: {
    padding: 16,
  },
  ratingContainer: {
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  ratingBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
  },
  ratingFill: {
    height: '100%',
    borderRadius: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    color: '#1976d2',
    fontSize: 14,
  },
  allergenTag: {
    backgroundColor: '#ffebee',
  },
  allergenText: {
    color: '#c62828',
    fontSize: 14,
    fontWeight: 'bold',
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  nutritionItem: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: (width - 80) / 2 - 8,
    flex: 1,
  },
  nutritionLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: 'bold',
  },
  nutritionValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
    marginTop: 4,
  },
  chemicalItem: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  chemicalName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  chemicalPurpose: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  chemicalSafety: {
    fontSize: 14,
    color: '#666',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  listText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
  },
  storageItem: {
    marginBottom: 12,
  },
  storageText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  similarProductItem: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B35',
  },
  similarProductHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  similarProductName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  ratingBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  similarProductBrand: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  benefitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  similarProductBenefit: {
    fontSize: 14,
    color: '#4CAF50',
    marginLeft: 6,
    flex: 1,
    fontWeight: '500',
  },
  bottomControls: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  newScanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e3f2fd',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  newScanButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
  },
});