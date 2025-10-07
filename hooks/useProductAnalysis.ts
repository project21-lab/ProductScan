import { useState } from 'react';
import { GeminiService } from '../services/geminiService';
import { PDFService } from '../services/pdfService';
import { ProductAnalysis, AnalysisResult } from '../types';

export function useProductAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ProductAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const analyzeProduct = async (imageUri: string): Promise<void> => {
    try {
      setIsAnalyzing(true);
      setError(null);

      const result: AnalysisResult = await GeminiService.analyzeProduct(imageUri);
      
      if (result.success && result.data) {
        setAnalysisResult(result.data);
      } else {
        setError(result.error || 'Analysis failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const exportToPDF = async (imageUri?: string): Promise<void> => {
    if (!analysisResult) {
      setError('No analysis data to export');
      return;
    }

    try {
      setIsExporting(true);
      setError(null);
      await PDFService.exportToPDF(analysisResult, imageUri);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  const resetAnalysis = (): void => {
    setAnalysisResult(null);
    setError(null);
  };

  return {
    isAnalyzing,
    analysisResult,
    error,
    isExporting,
    analyzeProduct,
    exportToPDF,
    resetAnalysis,
  };
}