import React, { useState } from 'react';
import { View, StyleSheet, Platform, Modal, Text, TouchableOpacity } from 'react-native';
import { CameraScreen } from '../components/CameraScreen';
import { ImagePreview } from '../components/ImagePreview';
import { AnalysisResults } from '../components/AnalysisResults';
import { LoadingScreen } from '../components/LoadingScreen';
import { useProductAnalysis } from '../hooks/useProductAnalysis';

type AppState = 'camera' | 'preview' | 'analyzing' | 'results';

export default function ProductScanApp() {
  const [appState, setAppState] = useState<AppState>('camera');
  const [capturedImageUri, setCapturedImageUri] = useState<string>('');
  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    title: string;
    message: string;
    onOk?: () => void;
  }>({ visible: false, title: '', message: '' });

  const {
    isAnalyzing,
    analysisResult,
    error,
    isExporting,
    analyzeProduct,
    exportToPDF,
    resetAnalysis,
  } = useProductAnalysis();

  const showAlert = (title: string, message: string, onOk?: () => void) => {
    if (Platform.OS === 'web') {
      setAlertConfig({ visible: true, title, message, onOk });
    } else {
      // For mobile, we'll use a simple alert replacement
      setAlertConfig({ visible: true, title, message, onOk });
    }
  };

  const handleImageCaptured = (imageUri: string) => {
    setCapturedImageUri(imageUri);
    setAppState('preview');
  };

  const handleRetake = () => {
    setCapturedImageUri('');
    setAppState('camera');
  };

  const handleProcess = async () => {
    if (!capturedImageUri) return;
    
    setAppState('analyzing');
    
    try {
      await analyzeProduct(capturedImageUri);
      
      // Wait for the hook state to update
      setTimeout(() => {
        if (error) {
          console.error('Analysis error:', error);
          showAlert('Analysis Failed', `Error: ${error}. Please try again with a clearer image.`);
          setAppState('preview');
        } else if (analysisResult) {
          setAppState('results');
        } else {
          showAlert('Analysis Failed', 'No results received. Please try again.');
          setAppState('preview');
        }
      }, 1000);
    } catch (err) {
      console.error('Process error:', err);
      showAlert('Analysis Failed', 'Failed to analyze product. Please check your internet connection and try again.');
      setAppState('preview');
    }
  };

  const handleNewScan = () => {
    setCapturedImageUri('');
    resetAnalysis();
    setAppState('camera');
  };

  const handleExportPDF = async () => {
    try {
      await exportToPDF(capturedImageUri);
      showAlert('Success', 'Product analysis report has been exported successfully!');
    } catch (err) {
      showAlert('Export Failed', 'Failed to export PDF. Please try again.');
    }
  };

  const renderCurrentScreen = () => {
    switch (appState) {
      case 'camera':
        return <CameraScreen onImageCaptured={handleImageCaptured} />;
      
      case 'preview':
        return (
          <ImagePreview
            imageUri={capturedImageUri}
            onRetake={handleRetake}
            onProcess={handleProcess}
            isProcessing={isAnalyzing}
          />
        );
      
      case 'analyzing':
        return <LoadingScreen message="Analyzing your product with AI..." />;
      
      case 'results':
        return analysisResult ? (
          <AnalysisResults
            analysis={analysisResult}
            imageUri={capturedImageUri}
            onNewScan={handleNewScan}
            onExportPDF={handleExportPDF}
            isExporting={isExporting}
          />
        ) : null;
      
      default:
        return <CameraScreen onImageCaptured={handleImageCaptured} />;
    }
  };

  return (
    <View style={styles.container}>
      {renderCurrentScreen()}
      
      {/* Cross-platform Alert Modal */}
      <Modal visible={alertConfig.visible} transparent animationType="fade">
        <View style={styles.alertOverlay}>
          <View style={styles.alertContainer}>
            <Text style={styles.alertTitle}>{alertConfig.title}</Text>
            <Text style={styles.alertMessage}>{alertConfig.message}</Text>
            <TouchableOpacity 
              style={styles.alertButton}
              onPress={() => {
                alertConfig.onOk?.();
                setAlertConfig(prev => ({ ...prev, visible: false }));
              }}
            >
              <Text style={styles.alertButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  alertOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    minWidth: 280,
    maxWidth: 320,
    margin: 20,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  alertMessage: {
    fontSize: 16,
    marginBottom: 20,
    color: '#666',
    lineHeight: 24,
  },
  alertButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  alertButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});